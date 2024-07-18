import multer from "multer";
import * as fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "C:/uploads/AthleansApp/Documents"
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath)
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 10000000 } });

export default upload;
