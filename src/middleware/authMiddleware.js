import { User } from "../models/User.js";
import TokenService from "../services/tokenService.js";
import AppError from "./../utils/error.js";
import jwt  from 'jsonwebtoken';
 
const protect = async (req , res , next)=>{
  console.log(req?.headers, "token");
    const token = req?.headers?.authorization.split(" ")[1];

  if (!token) {
    return next(new AppError("No token provided", 401));
  }
  try{
    const decoded  = TokenService.verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select(
      "-password -refreshToken -verificationToken"
    );
    if (!user) {
      return next(new AppError(401, "User not found"));
    }
    req.user = user;
    next();
  }catch(err){
    return next(new AppError(401, "Invalid token"));
  }
}

export default protect;