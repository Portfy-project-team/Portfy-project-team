import { Role, UserStatus } from "@prisma/client";
import { sendApprovalEmail, sendRejectionEmail } from "../../utils/email.js";
import { prisma } from "../../utils/prisma.js";
import bcrypt from "bcryptjs";
import type { AjouterUserInput, UpdateUserInput } from "./admin.validation.js";

export const AdminServices = {

  // CORRECTION 1 : AjouterUser
  // Le service hashait le mot de passe mais ne l'utilisait pas dans prisma.user.create
  // La variable hashed était calculée mais jamais passée à data — bug critique
  // Le compte était créé sans mot de passe (password: null)
  async AjouterUser(data: AjouterUserInput) {
    const hashed = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email:    data.email,
        role:     data.role,
        password: hashed,        // manquait dans la version originale
        status:   UserStatus.ACTIVE,
        isEmailVerified: true,   // créé par Admin — email vérifié d'office
      },
      // select explicite — ne jamais retourner le password
      select: {
        id:        true,
        email:     true,
        role:      true,
        status:    true,
        createdAt: true,
      },
    });

    return user;
  },

  async getAllUsers(filters?: { role?: Role; status?: UserStatus }) {
    return prisma.user.findMany({
      where:   filters,
      select: {
        id:        true,
        email:     true,
        role:      true,
        status:    true,
        createdAt: true,
        // password jamais retourné
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async deleteUser(id: number) {
    await prisma.user.delete({ where: { id } });
  },

  async updateUserStatus(id: number, status: UserStatus) {
    return prisma.user.update({
      where:  { id },
      data:   { status },
      select: { id: true, email: true, status: true },
    });
  },

  // CORRECTION 2 : updateUser
  // select explicite ajouté — la version originale retournait tous les champs
  // dont potentiellement password si null ou non filtré
  async updateUser(id: number, data: UpdateUserInput) {
    return prisma.user.update({
      where:  { id },
      data,
      select: {
        id:     true,
        email:  true,
        role:   true,
        status: true,
        // password exclu
      },
    });
  },

  async approveUser(id: number) {
    const existingUser = await prisma.user.findUnique({
      where:  { id },
      select: { email: true, status: true },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    if (existingUser.status !== UserStatus.PENDING) {
      throw new Error("Only pending users can be approved");
    }

    const user = await prisma.user.update({
      where:  { id, status: UserStatus.PENDING },
      data:   { status: UserStatus.ACTIVE },
      select: { id: true, email: true, status: true },
    });

    if (!existingUser.email) {
      throw new Error("User email not found");
    }

    await sendApprovalEmail(existingUser.email, existingUser.email);

    return user;
  },

  async rejectUser(id: number, reason?: string) {
    const user = await prisma.user.update({
      where:  { id, status: UserStatus.PENDING },
      data:   { status: UserStatus.REJECTED },
      select: { email: true },
    });

    if (!user.email) {
      throw new Error("User email not found");
    }

    await sendRejectionEmail(user.email, user.email, reason);

    return user;
  },
};