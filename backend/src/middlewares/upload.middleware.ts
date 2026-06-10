import multer  from "multer";
import path    from "path";
import crypto  from "crypto";

// CORRECTION 1 : whitelist des extensions autorisées
// La version originale acceptait tout fichier dont le mimetype commence par "image/"
// Un attaquant peut forger le mimetype côté client — la vérification mimetype seule
// n'est pas suffisante. On double la protection avec une whitelist d'extensions.
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// CORRECTION 2 : crypto.randomBytes au lieu de Math.random()
// Math.random() n'est pas cryptographiquement sécurisé — les noms de fichiers
// sont prévisibles, ce qui peut permettre à un attaquant de deviner et accéder
// aux fichiers d'autres utilisateurs
const storage = multer.diskStorage({
  destination: "uploads/avatars/",
  filename: (_req, file, cb) => {
    const ext        = path.extname(file.originalname).toLowerCase();
    const uniqueName = crypto.randomBytes(16).toString("hex");
    cb(null, uniqueName + ext);
  },
});

const fileFilter = (_req: any, file: any, cb: any) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // CORRECTION 3 : double vérification mimetype + extension
  // Vérifier les deux ensemble empêche :
  // - Un fichier malveillant avec mimetype forgé (ex: script.php avec mimetype image/jpeg)
  // - Un fichier avec double extension (ex: image.jpg.php)
  const isMimeValid = file.mimetype.startsWith("image/");
  const isExtValid  = ALLOWED_EXTENSIONS.has(ext);

  if (isMimeValid && isExtValid) {
    cb(null, true);
  } else {
    cb(
      new Error("Format non autorisé. Extensions acceptées : jpg, jpeg, png, webp."),
      false
    );
  }
};

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max — correct
}).single("avatar");