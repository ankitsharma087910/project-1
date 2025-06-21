import mongoose, { Schema } from "mongoose";


const userSchema = Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: { 
    type: String 
}
},{
    timestamps:true
});

export const User = mongoose.model("User",userSchema);