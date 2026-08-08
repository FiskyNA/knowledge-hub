import { Request, Response, NextFunction } from 'express'

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack)

  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({ message: 'Database error', error: err.message })
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({ message: 'File upload error', error: err.message })
  }

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
