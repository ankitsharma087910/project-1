import { User } from "../models/User.js";
import TokenService from "../services/tokenService.js";
import AppError from "./../utils/error.js";
import {parse} from "cookie"
import jwt  from 'jsonwebtoken';
 
const protect = async (req , res , next)=>{
   
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.accessToken;
    console.log(token,'token');

  if (!token) {
    return next(new AppError("No token provided", 401));
  }
  try{
    const decode = jwt.decode(token);
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