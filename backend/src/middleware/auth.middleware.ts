import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const verifierToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'Accès refusé : token manquant' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    ;(req as any).user = decoded
    next()
  } catch {
    return res.status(403).json({ message: 'Token invalide ou expiré' })
  }
}

export const verifierRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return res.status(403).json({ message: `Accès refusé. Rôle requis : ${roles.join(' ou ')}` })
    }
    next()
  }
}