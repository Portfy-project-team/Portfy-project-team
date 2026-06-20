import { Request, Response } from "express";
import { z } from "zod";
import { fetchAuthenticatedStudentProfile } from "./export-portfolio.service.js";
import { generateStudentPdf } from "./export-portfolio.pdf-util.js";

// CORRECTION 1 : validation de la couleur thème avec Zod
// Sans validation, un attaquant peut injecter n'importe quelle valeur
// dans themeColor qui est utilisée directement dans les styles SVG/PDF
const exportSchema = z.object({
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Couleur invalide — format attendu : #RRGGBB")
    .optional(),
}).strict();

export const exportStudentPdf = async (
  req: Request,
  res: Response
): Promise<void> => {
  // CORRECTION 2 : req.user! au lieu de (req as any).user?.id
  // Le cast (req as any) contourne TypeScript — req.user est garanti
  // par verifyToken qui est branché sur cette route
  const parsed = exportSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors:  parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const userId     = req.user!.id;
    const themeColor = parsed.data.color ?? "#1e40af";

    const profile   = await fetchAuthenticatedStudentProfile(userId);
    const pdfBuffer = await generateStudentPdf(profile, { themeColor });

    const fileName = `Portfolio_${profile.prenom ?? "etudiant"}_${profile.nom ?? ""}.pdf`
      .replace(/\s+/g, "_")
      .replace(/__+/g, "_");

    res.setHeader("Content-Type",        "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length",      pdfBuffer.length);
    res.status(200).end(pdfBuffer);

  } catch (error: any) {
    if (error.message === "PROFILE_NOT_FOUND") {
      res.status(404).json({
        message: "Profil étudiant introuvable.",
      });
      return;
    }

    console.error("[exportStudentPdf]", error);
    res.status(500).json({
      message: "Erreur lors de la génération du PDF.",
    });
  }
};