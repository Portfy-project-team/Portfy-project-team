import { Router } from 'express';
import { exportStudentPdf } from './export-portfolio.controller.js';
import { verifyToken,requireRole } from '../../middlewares/auth.middleware.js';

const router = Router();


router.post('/my-portfolio/export', verifyToken, requireRole('STUDENT'), exportStudentPdf);

export default router;