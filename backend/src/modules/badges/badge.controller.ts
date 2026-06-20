import { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";

export const getMyBadgesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const student = await prisma.student.findUniqueOrThrow({
      where: { userId },
      include: {
        portfolio: {
          include: {
            PortfolioBadge: {
              include: { Badge: true }
            }
          }
        }
      }
    });

    const obtained = student.portfolio?.PortfolioBadge.map(pb => pb.Badge) || [];
    const allBadges = await prisma.badge.findMany();
    
    const locked = allBadges.filter(b => !obtained.some(ob => ob.id === b.id));

    res.json({ obtained, locked });
  } catch (error) {
    next(error);
  }
};
