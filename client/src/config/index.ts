export const config = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  appName: 'Knowledge Hub',
  version: '0.1.0',
  maxFileSize: 10 * 1024 * 1024,
  supportedFileTypes: [
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp',
    'mp3', 'mp4', 'avi', 'mov', 'wav',
    'txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts',
    'zip', 'rar', '7z', 'tar', 'gz'
  ],
}
