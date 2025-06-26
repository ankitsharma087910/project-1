import { User } from "../models/User.js";
import crypto from 'crypto'
import emailService from "../services/emailService.js";
import logger from "../utils/logger.js";
import AppError from './../utils/error.js';
import TokenService from "../services/tokenService.js";
import { responseHandler } from "../utils/responseHandler.js";

export const userRegisterController = async(req,res)=>{
    try{
      const { email, password ,name} = req.body;

      // user exists
      const isExist = await User.findOne({ email });
      if (isExist) {
        return res.status(400).json({ message: "User already exists" });
      }
      if(!email || !password || !name){
        return responseHandler(res, 400, data, "Please add all fields");
      }

      const verificationToken = crypto.randomBytes(32).toString("hex");

      console.log(process.env.EMAIL_USER,'email')
      
      // Send verification email
       await emailService.sendVerificationEmail(email,verificationToken);

      // Create user
      const user = new User({
        email,
        password,
        name,
        verificationToken,
      });

      await user.save();

      res.status(201).json({
        message:
          "Registration successful. Please check your email for verification.",
          success:true,
      });
    }catch(err){
        console.log(err);
    }
}


export const verifyEmailController = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return next(new AppError(400, "Invalid or expired verification token"));
    }

    user.isVerified = true;

    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (error) {
    logger.error(`Email verification error: ${error.message}`);
    next(error);
  }
};



export const userLoginController = async(req,res,next)=>{
  try{
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError(400, "Email and password are required")); // inside try ✅
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError(401, "User not registered"));
    }

    if (!(await user.comparePassword(password))) {
      return next(new AppError(401, "Incorrect password"));
    }

    if (!user.isVerified) {
      return next(new AppError(401, "Please verify your email first"));
    }

    const accessToken = TokenService.generateAccessToken(user._id);
    const refreshToken = TokenService.generateRefreshToken(user._id);

   
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/refresh-token", // Restrict to refresh endpoint
    });

    
    user.refreshToken = refreshToken;
    await user.save();

    const data = { userId: user._id };

    return responseHandler(res, 200, data, "Login Successfully");
  }catch(error){
    logger.error(`Login error: ${error.message}`);
    next(error);
  }
}


export const refreshTokenController = async(req,res,next)=>{
  try{
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new AppError(401, "Refresh token required"));
    }
    const decoded = TokenService.verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId).select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError(401, "Invalid refresh token"));
    }

    const newAccessToken = TokenService.generateAccessToken(user._id);
    const newRefreshToken = TokenService.generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      status: "success",
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  }catch(error){
    logger.error(`Refresh token error: ${error.message}`);
    next(error);
  }
}

export const logoutController = async(req,res,next)=>{
  try{
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new AppError(400, "Refresh token required"));
    }

    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/refresh-token" });

    return responseHandler(res, 200, null, "Logged out successfully");

  }catch(error){
    logger.error(`Logout error: ${error.message}`);
    next(error);
  }
}


