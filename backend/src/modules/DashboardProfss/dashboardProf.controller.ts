import { Request, Response } from 'express'
import { getDashboardProfData } from './dashboardProf.service.js'

export const getDashboardProf = async (
  req: Request,
  res: Response
) => {
  try {

    const userId = (req as any).user.id

    const data =
      await getDashboardProfData(userId)

    res.json({
      success: true,
      data
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Erreur dashboard professionnel'
    })
  }
}