import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config();


class TokenService {
  generateAccessToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
  }

  generateRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });
  }

  verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, process.env.REFRESH_SECRET);
  }
}

export default new TokenService();