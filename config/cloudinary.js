import { v2 as cloudinary } from "cloudinary";
import {dotenv} from "dotenv"
dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // cloud_name: "dyosbwnb0",
  // api_key: "699567561713578",
  // api_secret: "b4vPz8OTQ0UEVJAxHENbYymxkQ8",
  // Click 'View API Keys' above to copy your API secret
});

// CLOUDINARY_API_KEY = 699567561713578 ;
// CLOUDINARY_API_SECRET = b4vPz8OTQ0UEVJAxHENbYymxkQ8;
// CLOUDINARY_CLOUD_NAME = dyosbwnb0;
export default cloudinary;
