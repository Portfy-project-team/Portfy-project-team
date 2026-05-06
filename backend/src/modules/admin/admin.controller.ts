import {Request,Response, NextFunction } from "express";
import { createUserSchema, listUsersQuerySchema, RejectUserSchema, updateStatusSchema, updateUserSchema } from "./admin.validation.js";
import { AdminServices } from "./admin.service.js";
import prisma from "../../shared/utils/prisma.js";
import { UserStatus } from "@prisma/client";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createUserSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (existingUser) {
      res.status(409).json({ message: 'A user with this email already exists.' });
      return;
    }
    const user = await AdminServices.createUser(data);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
   next(err);
  }
};
export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = listUsersQuerySchema.parse(req.query);
    const users = await AdminServices.getAllUsers(filters);
    res.json({ users });
  } catch (err) {
    next(err);
  }
};
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await AdminServices.deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const data = updateUserSchema.parse(req.body);
    const updatedUser = await AdminServices.updateUser(id, data);
    res.json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    next(err);
  }
};
export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const { status } =updateStatusSchema.parse(req.body) 
    
    if (!status) {
      res.status(400).json({ 
        message: 'Invalid status. Allowed: active, blocked, pending, rejected' 
      });
      return;
    }

    // التحقق من وجود المستخدم
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // منع تغيير الحالة إلى نفس الحالة الحالية
    if (userExists.status === status) {
      res.status(409).json({ message: `User is already ${status}` });
      return;
    }

    const user = await AdminServices.updateUserStatus(id, status);
    res.json({ message: `User status updated to ${status}`, user });
  } catch (err) {
     next(err);
  }
};
export const approveUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.status !== 'pending') {
      res.status(409).json({ message: 'Only pending users can be approved' });
      return;
    }

    const updatedUser = await AdminServices.approveUser(id);
    res.json({ message: 'User approved', user: updatedUser });
  } catch (err) {
    next(err);
  }
};
export const rejectUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.status !== 'pending') {
      res.status(409).json({ message: 'Only pending users can be rejected' });
      return;
    }

    const { reason } = RejectUserSchema.parse(req.body);
    const rejectedUser = await AdminServices.rejectUser(id, reason);
    res.json({ message: 'User rejected', reason, user: rejectedUser });
  } catch (err) {
    next(err);
  }
};