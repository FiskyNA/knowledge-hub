import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { config, PUBLIC_USER_ID } from '../config'
import { client } from '../lib/prisma'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(config.uploadDir)
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `${uuidv4()}${ext}`
    cb(null, filename)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter: (req, file, cb) => {
    cb(null, true)
  },
})

export function uploadSingle(fieldName: string) {
  return upload.single(fieldName)
}

export async function handleFileUpload(
  req: Request & { file?: Express.Multer.File },
  res: Response,
  next: NextFunction
) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }

  const ext = path.extname(req.file.originalname).toLowerCase()
  const mimeType = req.file.mimetype

  try {
    const file = await client.file.create({
      data: {
        name: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.filename,
        mimeType,
        size: req.file.size,
        extension: ext,
        userId: PUBLIC_USER_ID,
        chapterId: req.body.chapterId || undefined,
      },
    })

    res.status(201).json(file)
  } catch (error) {
    next(error)
  }
}

export { upload }
