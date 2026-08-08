import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { client } from '../lib/prisma'
import { asyncHandler } from '../middleware/auth'
import { PUBLIC_USER_ID } from '../config'

const router = Router()

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const subjects = await client.subject.findMany({
      where: { userId: PUBLIC_USER_ID },
      orderBy: { order: 'asc' },
      include: { chapters: true },
    })
    res.json(subjects)
  })
)

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const subject = await client.subject.findFirst({
      where: { id, userId: PUBLIC_USER_ID },
      include: { chapters: { orderBy: { order: 'asc' } } },
    })
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' })
    }
    res.json(subject)
  })
)

router.post(
  '/',
  [
    body('name').notEmpty().trim(),
    body('description').optional(),
    body('color').optional(),
    body('icon').optional(),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, description, color, icon } = req.body
    const order = await client.subject.count({ where: { userId: PUBLIC_USER_ID } })

    const subject = await client.subject.create({
      data: { name, description, color, icon, order, userId: PUBLIC_USER_ID },
    })
    res.status(201).json(subject)
  })
)

router.put(
  '/:id',
  [
    body('name').notEmpty().trim(),
    body('description').optional(),
    body('color').optional(),
    body('icon').optional(),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params
    const { name, description, color, icon } = req.body

    const subject = await client.subject.update({
      where: { id, userId: PUBLIC_USER_ID },
      data: { name, description, color, icon },
    })
    res.json(subject)
  })
)

router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    await client.subject.delete({ where: { id, userId: PUBLIC_USER_ID } })
    res.status(204).send()
  })
)

export default router
