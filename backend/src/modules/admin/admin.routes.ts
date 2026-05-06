import { Router } from 'express';
import { authenticate } from '../../shared/middleware/authenticate.middleware.js';
import {authorize} from '../../shared/middleware/authorize.middleware.js'
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



router.post('/users',authenticate,authorize('ADMIN'), createUser);                 
router.get('/users',authenticate,authorize('ADMIN'), listUsers);                   
router.patch('/users/:id',authenticate,authorize('ADMIN'), updateUser);           
router.delete('/users/:id',authenticate,authorize('ADMIN'), deleteUser);           
router.patch('/users/:id/status',authenticate, authorize('ADMIN'), updateUserStatus);


router.post('/accept-invite/:id',authenticate,authorize('ADMIN'), approveUser);
router.post('/reject-invite/:id',authenticate,authorize('ADMIN'), rejectUser);


export default router;
