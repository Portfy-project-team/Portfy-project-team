import { Request, Response, NextFunction } from "express";
import { PortfolioService } from "./portfolio.service.js";
import { updatePortfolioSettingsSchema } from "./portfolio.validation.js";

export const getMyPortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
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
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = Number(req.params.studentId);
    if (isNaN(studentId)) {
      res.status(400).json({ message: "Invalid student ID" });
      return;
    }

    const portfolio = await PortfolioService.getPublicPortfolio(studentId);

    if (!portfolio) {
      res.status(404).json({ message: "Portfolio not found" });
      return;
    }

    if ("restricted" in portfolio) {
      res.status(403).json({ message: "This portfolio is private" });
      return;
    }

    res.json({ portfolio });
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = updatePortfolioSettingsSchema.parse(req.body);
    const portfolio = await PortfolioService.updateSettings(req.user.id, data);
    res.json({ message: "Portfolio updated", portfolio });
  } catch (err) {
    next(err);
  }
};