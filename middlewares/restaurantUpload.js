import multer from "multer";
import path from "path";

// storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// file filter for image validation
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (![".jpg", ".jpeg", ".png",".webp"].includes(ext) || !["image/jpeg", "image/png","image/webp"].includes(mime)) {
    return cb(new Error("Only JPG, JPEG, webp and PNG images are allowed."), false);
  }
  cb(null, true);
};

export const uploadRestaurantImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // max 5MB per file
  },
}).fields([
  { name: "coverPhoto", maxCount: 1 },
  { name: "ambiencePhotos", maxCount: 5 },
]);
