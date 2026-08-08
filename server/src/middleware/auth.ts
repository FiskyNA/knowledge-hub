import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/jwt'
import { client } from '../lib/prisma'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
  }
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    const user = await client.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid token - user not found' })
    }

    req.user = { id: user.id, email: user.email }
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)
}
