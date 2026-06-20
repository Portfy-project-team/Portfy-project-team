import { Router } from 'express';
import { verifyToken } from "../../middlewares/auth.middleware.js"
import { requireRole } from '../../middlewares/auth.middleware.js'
import {
  createUser,
  listUsers,
  deleteUser,
  updateUser,
  updateUserStatus,
  approveUser,
  rejectUser,
  listAttestations,
  listModerationItems,
  listEstablishments,
  createEstablishment,
  updateEstablishment,
  getPlatformStats
} from './admin.controller.js';

const router = Router();

router.post('/users', verifyToken, requireRole('ADMIN'), createUser);
router.get('/users', verifyToken, requireRole('ADMIN'), listUsers);
router.delete('/users/:id', verifyToken, requireRole('ADMIN'), deleteUser);
router.put('/users/:id', verifyToken, requireRole('ADMIN'), updateUser);
router.patch('/users/:id/status', verifyToken, requireRole('ADMIN'), updateUserStatus);

router.get('/attestations', verifyToken, requireRole('ADMIN'), listAttestations);
router.get('/moderation', verifyToken, requireRole('ADMIN'), listModerationItems);
router.get('/establishments', verifyToken, requireRole('ADMIN'), listEstablishments);
router.post('/establishments', verifyToken, requireRole('ADMIN'), createEstablishment);
router.patch('/establishments/:id', verifyToken, requireRole('ADMIN'), updateEstablishment);
router.get('/platform-stats', verifyToken, requireRole('ADMIN'), getPlatformStats);

router.post('/accept-invite/:id', verifyToken, requireRole('ADMIN'), approveUser);
router.post('/reject-invite/:id', verifyToken, requireRole('ADMIN'), rejectUser);

export default router;
