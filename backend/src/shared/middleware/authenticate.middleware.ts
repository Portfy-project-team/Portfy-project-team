import { UserStatus } from "@prisma/client";
import { verifytAccessToken } from "../utils/jwt.js";
import prisma from "../utils/prisma.js";
import { Request, Response, NextFunction } from "express";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ message: "access token  missing" });
    return;
  }
  try {
    const payload = verifytAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { status: true },
    });
    if (!user) {
      res.status(401).json({ message: "user not found" });
      return;
    }
    /*if (!user.emailVerified) {
  res.status(403).json({ message: 'Please verify your email first.' });
  return;
} */
    if (user.status !== UserStatus.active) {
      res.status(403).json({
        message: "Your account is not active. Please contact support.",
      });
      return;
    }
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
};
