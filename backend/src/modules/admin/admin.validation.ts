import {z } from 'zod';

export const AjouterUserSchema =z.object({
  
  email: z.string().trim().email('Invalid email format'),
  
  password: z.string().trim().min(8, 'Password must be at least 8 characters'),
  
  role: z.enum(['ADMIN', 'PRO','STUDENT','PROF']),
})
export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  role: z.enum(['ADMIN', 'PRO','STUDENT','PROF']).optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'REJECTED', 'BLOCKED']).optional(),
})
export const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACTIVE', 'REJECTED', 'BLOCKED']).optional(),
})
export const RejectUserSchema = z.object({
  reason: z.string().trim().optional(),
});
export const listUsersQuerySchema = z.object({
  role: z.enum(['ADMIN', 'PRO','STUDENT','PROF']).optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'REJECTED', 'BLOCKED']).optional(),
});

export type AjouterUserInput = z.infer<typeof AjouterUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateStatusSchema = z.infer<typeof updateStatusSchema>;