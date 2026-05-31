import { Request, Response, NextFunction } from "express";
import { PortfolioService } from "./portfolio.service.js";
import { updatePortfolioSettingsSchema } from "./portfolio.validation.js";

export const getMyPortfolio = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const portfolio = await PortfolioService.getMyPortfolio(req.user.id);
    if (!portfolio) {
      res.status(404).json({ message: "Portfolio not found" });
      return;
    }
    res.json({ portfolio });
  } catch (err) {
    next(err);
  }
};

export const getPublicPortfolio = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const studentId = Number(req.params.studentId);

    if (!Number.isInteger(studentId) || studentId <= 0) {
      res.status(400).json({ message: "Invalid student ID" });
      return;
    }

    const result = await PortfolioService.getPublicPortfolio(studentId);

    if (!result) {
      res.status(404).json({ message: "Portfolio not found" });
      return;
    }

    if ("restricted" in result) {
      res.status(403).json({ message: "This portfolio is private" });
      return;
    }

    res.json({ portfolio: result });
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const parsed = updatePortfolioSettingsSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: "Données invalides",
        errors:  parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const portfolio = await PortfolioService.updateSettings(req.user.id, parsed.data);
    res.json({ message: "Portfolio updated", portfolio });
  } catch (err) {
    next(err);
  }
};