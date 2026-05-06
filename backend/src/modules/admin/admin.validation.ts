import { email, z } from 'zod';

export const createUserSchema =z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
  
  // email: نص، يجب أن يكون إيميل صحيح
  email: z.string().email('Invalid email format'),
  
  password: z.string().min(8, 'Password must be at least 8 characters'),
  
  role: z.enum(['ADMIN', 'PRO','STUDENT','PROF']),
})
export const updateUserSchema = z.object({
     name: z.string().min(2).optional(),
  email: z.string().email('Invalid email format').optional(),
  role: z.enum(['ADMIN', 'PRO','STUDENT','PROF']).optional(),
  status: z.enum(['pending', 'active', 'rejected', 'blocked']).optional(),
})
export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'active', 'rejected', 'blocked']).optional(),
})
export const RejectUserSchema = z.object({
  reason: z.string().optional(),
});
export const listUsersQuerySchema = z.object({
  role: z.enum(['ADMIN', 'PRO','STUDENT','PROF']).optional(),
  status: z.enum(['pending', 'active', 'rejected', 'blocked']).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateStatusSchema = z.infer<typeof updateStatusSchema>;