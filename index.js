import express from "express"
import { connectToDB } from "./database/db.js";
import dotenv from "dotenv";
import authRoutes from './routes/auth-routes.js';
import cors from 'cors'
import { User } from "./models/User.js";
dotenv.config();
const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/auth",authRoutes);

app.get("/",(req,res)=>{
    console.log('req')
})



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
  

const port = 4000;
connectToDB().then(()=>{
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
})
