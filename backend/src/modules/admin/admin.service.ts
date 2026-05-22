import { Role, UserStatus } from "@prisma/client";
import { sendApprovalEmail, sendRejectionEmail } from "../../utils/email.js"
import {prisma} from "../../utils/prisma.js";
import bcrypt from "bcryptjs";
import { CreateUserInput, UpdateUserInput } from "./admin.validation.js";
interface RegisterData {
  email: string;
  password: string;
  // name: string;
  role: Role;
}
export const AdminServices = {
  async createUser(data: CreateUserInput) {
    const hashed = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        // name: data.name,
        email: data.email,
        password: hashed,
        role: data.role,
        status: UserStatus.ACTIVE,
      },
    });
    return user;
  },

  async getAllUsers(filters?: { role?: Role; status?: UserStatus }) {
    return prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        email: true,
        // name: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },
  async deleteUser(id: number) {
    await prisma.user.delete({ where: { id } });
  },
  async updateUserStatus(id: number, status: UserStatus) {
    return prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, email: true, status: true },
    });
  },
  async updateUser(id: number, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        // name: true,
        role: true,
        status: true,
      },
    });
  },

  async approveUser(id: number) {
      const existingUser = await prisma.user.findUnique({
    where: { id },
    // select: { email: true, name: true, status: true },
     select: { email: true, status: true },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  if (existingUser.status !== UserStatus.PENDING) {
    throw new Error("Only pending users can be approved");
  }
    const user = await prisma.user.update({
      where: { id, status: UserStatus.PENDING },
      data: { status: UserStatus.ACTIVE }
    });
  if (!existingUser.email ) {
    throw new Error("User email not found");
  }
   await sendApprovalEmail(existingUser.email, existingUser.email);
  // await sendApprovalEmail(existingUser.email, existingUser.name?? 'User');
    return user;
  },

  async rejectUser(id: number, reason?: string) {
    const user = await prisma.user.update({
      where: { id, status:UserStatus.PENDING},
      data: { status: UserStatus.REJECTED },
      // select: { email: true, name: true },
      select: { email: true },
    });
     if (!user.email ) {
    throw new Error("User email not found");
  }
    // await sendRejectionEmail(user.email, user.name??'User', reason);
     await sendRejectionEmail(user.email, user.email, reason);
    return user;
  },
};
