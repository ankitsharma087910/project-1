import multer from "multer";
import path from "path";

// set multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/temp/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// file filter function
const checkFileFilter = (req,file,cb)=>{
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload only images"));
    }
}


export const uploadMiddleware = multer({
  storage,
  fileFilter: checkFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

