import { User } from "../models/User.js";
import TokenService from "../services/tokenService.js";
import AppError from "./../utils/error.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    console.log(authHeader,'header');

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new AppError(401, "Authorization token missing or malformed")
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new AppError(401, "No token provided"));
    }

    const decoded = TokenService.verifyAccessToken(token);

    const user = await User.findById(decoded.userId).select(
      "-password -refreshToken"
    );

    if (!user) {
      return next(new AppError(401, "User not found"));
    }
    
    req.user = user;
    next();
  } catch (err) {
    return next(new AppError(401, "Invalid or expired token"));
  }
};

export default protect;
