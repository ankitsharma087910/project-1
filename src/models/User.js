import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
const userSchema = Schema(
  {
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
    likedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
    verificationToken: {
      type: String,
    },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save",async function(next){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
})

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
