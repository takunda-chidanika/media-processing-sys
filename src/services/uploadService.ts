import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req:any, file:any, cb:any) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req:any, file:any, cb:any) => {
        const fileTypes = /jpeg|jpg|png|mp4/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb(new Error("File type not supported"));
    },
});

export default upload;