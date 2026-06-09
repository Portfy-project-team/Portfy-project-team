import { Request, Response } from 'express';
import { fetchAuthenticatedStudentProfile } from './export-portfolio.service.js';
import { generateStudentPdf } from './export-portfolio.pdf-util.js';

export const exportStudentPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id as number;
    const themeColor = req.body?.color || '#1e40af';
    const profile = await fetchAuthenticatedStudentProfile(userId);
    const pdfBuffer = await generateStudentPdf(profile, { themeColor });

    // 3. Nom du fichier
    const fileName = `Portfolio_${profile.prenom ?? 'etudiant'}_${profile.nom ?? ''}.pdf`
      .replace(/\s+/g, '_')
      .replace(/__+/g, '_');

    // 4. Envoi du PDF au client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.status(200).end(pdfBuffer);
    
  } catch (error: any) {
    if (error.message === 'PROFILE_NOT_FOUND') {
      res.status(404).json({ 
        success: false, 
        message: 'Profil étudiant introuvable.' 
      });
      return;
    }
    
    console.error('[exportStudentPdf]', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la génération du PDF.' 
    });
  }
};

