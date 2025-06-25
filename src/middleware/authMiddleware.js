import { User } from "../models/User.js";
import TokenService from "../services/tokenService.js";

 
const protect = async (req , res , next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
    }

    
  if (!token) {
    return next(new AppError("No token provided", 401));
  }
  try{
    const decoded  = TokenService.verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select(
      "-password -refreshToken -verificationToken"
    );
      
    if (!user) {
      return next(new AppError("User not found", 401));
    }

    req.user = user;
    next();

  }catch(err){
    return next(new AppError("Invalid token", 401));
  }
}

export default protect;