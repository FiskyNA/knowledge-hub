import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import { client } from '../lib/prisma'
import { generateToken } from '../lib/jwt'
import { hashPassword, comparePassword } from '../lib/bcrypt'
import { authMiddleware, asyncHandler, AuthRequest } from '../middleware/auth'

const router = Router()

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty().trim().escape(),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, name } = req.body

    const existingUser = await client.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' })
    }

    const hashedPassword = await hashPassword(password)

    const user = await client.user.create({
      data: { email, password: hashedPassword, name },
    })

    const token = generateToken({ userId: user.id, email: user.email })

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    })
  })
)

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    const user = await client.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken({ userId: user.id, email: user.email })

    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    })
  })
)

router.get(
  '/me',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await client.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })

    res.json({ user })
  })
)

router.post('/logout', (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' })
})

export default router
