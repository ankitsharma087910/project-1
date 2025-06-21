import { User } from "../models/User.js";
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { transporter } from "../config/nodemailer.js";


export const userRegisterController = async(req,res)=>{
    try{
      const { email, password } = req.body;

      // user exists
      const isExist = await User.findOne({ email });
      if (isExist) {
        return res.status(400).json({ message: "User already exists" });
      }

      // generate salt
      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      console.log(process.env.EMAIL_USER,'email')
      // Send verification email
      const verificationUrl = `http://localhost:4000/api/verify/${verificationToken}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification",
        html: `<p>Please verify your email by clicking <a href="${verificationUrl}">here</a></p>`,
      };

      await transporter.sendMail(mailOptions);

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        verificationToken,
      });

      await user.save();

      res.status(201).json({
        message:
          "Registration successful. Please check your email for verification.",
      });
    }catch(err){
        console.log(err);
    }
}




export const userLoginController = ()=>{
    
}