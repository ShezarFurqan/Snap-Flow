import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

export const uploadFields = upload.fields([
  { name: "media", maxCount: 10 }, // for posts
  { name: "file", maxCount: 1 },   // for stories
]);

export default upload;
