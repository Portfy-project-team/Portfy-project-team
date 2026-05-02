import { Request, Response, NextFunction } from 'express'

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERREUR] ${err.message}`)
  if (err.code === 'P2002') return res.status(409).json({ message: 'Cette valeur existe déjà' })
  if (err.code === 'P2025') return res.status(404).json({ message: 'Ressource non trouvée' })
  res.status(err.status || 500).json({ message: err.message || 'Erreur interne du serveur' })
}

export default errorMiddleware