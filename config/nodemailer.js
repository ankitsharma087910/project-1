
import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
 secure:true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
