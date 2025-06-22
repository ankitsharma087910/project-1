
import nodemailer  from 'nodemailer';
import dotenv from "dotenv"
import logger from '../utils/logger.js';
dotenv.config();
class EmailService{
    constructor(){
        this.transporter = nodemailer.createTransport({
          service: "gmail",
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
    }

    async sendVerificationEmail(email,verificationToken){
        const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

        const mailOptions = {
          from: "ankitsh474@gmail.com",
          to: email,
          subject: "Verify Your Email Address",
          html: 
            `<div>
            
              <h2>Email Verification</h2>
              <p>Please click the link below to verify your email address:</p>
              <a
                href='${verificationUrl}'
                style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;"
              >
                Verify Email
              </a>
              <p>This link will expire in 24 hours.</p>
            </div>
            `,
          
        };
        
        try {
          await this.transporter.sendMail(mailOptions);
          logger.info(`Verification email sent to ${email}`);
        } catch (err) {
          logger.error(
            `Failed to send verification email to ${email}: ${err.message}`
          );
          throw new Error("Failed to send verification email");
        }

    }
}

// creating single instance
export default new EmailService();