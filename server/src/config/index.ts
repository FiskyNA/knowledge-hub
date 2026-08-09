export const config = {
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-change-in-prod',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp',
    'text/plain',
    'text/markdown',
    'application/json',
    'text/html',
    'text/css',
    'text/javascript',
    'application/javascript',
    'application/typescript',
    'application/zip',
    'application/x-rar4',
    'application/x-7z-compressed',
    'application/x-tar',
    'application/gzip',
    'video/mp4',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
  ],
}

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-prod'
export const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads'
export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '52428800', 10)
export const ALLOWED_MIME_TYPES = config.allowedMimeTypes
export const PUBLIC_USER_ID = '00000000-0000-0000-0000-000000000000'
