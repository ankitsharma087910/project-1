import mongoose from "mongoose";

export const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);