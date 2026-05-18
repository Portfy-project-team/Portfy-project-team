import { Router } from 'express';
import { verifyToken } from "../../middlewares/auth.middleware.js"
import {requireRole} from '../../middlewares/auth.middleware.js'
import {
  createUser,
  listUsers,
  deleteUser,
updateUser,
updateUserStatus,
approveUser,
rejectUser
} from './admin.controller.js';

const router = Router();



router.post('/users',verifyToken,requireRole('ADMIN'), createUser);                 
router.get('/users',verifyToken,requireRole('ADMIN'), listUsers);                   
router.patch('/users/:id',verifyToken,requireRole('ADMIN'), updateUser);           
router.delete('/users/:id',verifyToken,requireRole('ADMIN'), deleteUser);           
router.patch('/users/:id/status',verifyToken, requireRole('ADMIN'), updateUserStatus);

router.post('/accept-invite/:id',verifyToken,requireRole('ADMIN'), approveUser);
router.post('/reject-invite/:id',verifyToken,requireRole('ADMIN'), rejectUser);


export default router;
