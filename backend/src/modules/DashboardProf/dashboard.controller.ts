import { Request, Response, NextFunction } from 'express'
import { getDashboardData } from './dashboard.service.js'

export async function dashboardController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // req.user est typé via src/types/express.d.ts — pas besoin de cast
    const { id: userId, role } = req.user

    const data = await getDashboardData(userId, role)

    res.json({ success: true, data })
  } catch (error) {
    next(error)
  }
}