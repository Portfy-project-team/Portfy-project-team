import multer from "multer";
import path from "path";

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: "uploads/avatars/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// Filtre : accepter uniquement les images
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Format non autorisé. Uniquement des images."), false);
  }
};

// Export du middleware configuré
export const uploadAvatar = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
}).single("avatar");