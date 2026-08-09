import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { config, PUBLIC_USER_ID } from '../config'
import { client } from '../lib/prisma'

if (config.cloudinary.cloudName) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  })
}

const useCloudinary = !!config.cloudinary.cloudName

let storage: multer.StorageEngine

if (useCloudinary) {
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'knowledge-hub',
      resource_type: 'raw',
      format: (req: any, file: any) => {
        const ext = file.originalname.split('.').pop()
        return ext || 'pdf'
      },
    } as any,
  })
} else {
  const multerDisk = require('multer').diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const path = require('path')
      const fs = require('fs')
      const uploadPath = path.resolve(config.uploadDir)
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true })
      }
      cb(null, uploadPath)
    },
    filename: (req: any, file: any, cb: any) => {
      const path = require('path')
      const { v4: uuidv4 } = require('uuid')
      const ext = path.extname(file.originalname)
      cb(null, `${uuidv4()}${ext}`)
    },
  })
  storage = multerDisk
}

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

  const ext = require('path').extname(req.file.originalname).toLowerCase()
  const mimeType = req.file.mimetype
  const fileUrl = useCloudinary ? (req.file as any).path : req.file.filename

  try {
    const file = await client.file.create({
      data: {
        name: req.file.filename,
        originalName: req.file.originalname,
        path: fileUrl,
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
