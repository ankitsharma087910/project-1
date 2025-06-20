import express from "express"
import { connectToDB } from "./database/db.js";
import dotenv from "dotenv"

dotenv.config();
const app = express();

app.use(express.json());

app.get("/",(req,res)=>{
    console.log(req,'req')
})

const port = 4000;
connectToDB().then(()=>{
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
})
