import multer from "multer";

const upload = multer({ limits: { fileSize: 10000000 } });

export default upload;