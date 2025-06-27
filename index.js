import express from "express"
import { connectToDB } from "./src/database/db.js";
import dotenv from "dotenv";
import authRoutes from './src/routes/auth-routes.js';
import articleRoutes from "./src/routes/article-routes.js";
import categoryRoutes from "./src/routes/category-routes.js";


import cors from 'cors'
import { User } from "./src/models/User.js";
import logger from "./src/utils/logger.js";
dotenv.config();
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth",authRoutes);
app.use('/api/article',articleRoutes);
app.use("/api/category", categoryRoutes);


app.get("/",(req,res)=>{
    console.log('req')
})

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  logger.error(
    `${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});



app.get("/api/verify/:token", async (req, res) => {
  const token = req.params.token;

  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return res.status(400).send("Invalid or expired verification token.");
  }

  user.isVerified = true;
  user.verificationToken = undefined; // remove the token after verification
  await user.save();

  res.send("Email verified successfully!");
});
  

connectToDB().then(()=>{
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
})
