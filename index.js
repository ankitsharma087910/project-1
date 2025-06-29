import express from "express"
import { connectToDB } from "./src/database/db.js";
import dotenv from "dotenv";
import authRoutes from './src/routes/auth-routes.js';
import articleRoutes from "./src/routes/article-routes.js";
import categoryRoutes from "./src/routes/category-routes.js";
import cors from 'cors'
import logger from "./src/utils/logger.js";
// import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth",authRoutes);
app.use('/api/article',articleRoutes);
app.use("/api/category", categoryRoutes);

// app.use(cookieParser())
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


  

connectToDB().then(()=>{
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
})
