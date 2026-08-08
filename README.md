# Knowledge Hub

A fancy, interactive file and note management website for organizing knowledge by subject, chapter, and topic.

## Features

- **Subject/Chapter Organization**: Organize notes and files hierarchically
- **Rich Text Editor**: Full-featured TipTap editor with formatting toolbar
- **File Management**: Upload, preview, and download all file types
- **Interactive UI**: 3D particles, scroll-linked animations, glitch text effects
- **Authentication**: JWT-based login and registration
- **Dark/Light Mode**: Automatic theme switching

## Tech Stack

### Frontend
- **React 19** + TypeScript
- **Vite 5** - Build tooling
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **GSAP** - Scroll-linked animations
- **Three.js** (@react-three/fiber) - 3D background particles
- **TipTap** - Rich text editor
- **TanStack Query** - Server state management
- **Zustand** - Client state management

### Backend
- **Node.js** + Express
- **TypeScript**
- **Prisma ORM** with SQLite/PostgreSQL
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads

## Development Setup

### Prerequisites
- Node.js 20+
- npm 10+

### Local Development

1. Clone the repository
2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Start the backend server:
   ```bash
   cd server
   npm install
   npm run dev
   ```

4. Start the frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Docker Setup (PostgreSQL)

```bash
cp .env.example .env
docker-compose up --build
```

The frontend will be available at `http://localhost:5173` (dev) or `http://localhost` (docker).
The backend API will be available at `http://localhost:4000`.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create a subject
- `PUT /api/subjects/:id` - Update a subject
- `DELETE /api/subjects/:id` - Delete a subject

### Chapters
- `GET /api/chapters?subjectId=xxx` - Get chapters for a subject
- `POST /api/chapters` - Create a chapter
- `PUT /api/chapters/:id` - Update a chapter
- `DELETE /api/chapters/:id` - Delete a chapter

### Notes
- `GET /api/notes?chapterId=xxx` - Get notes for a chapter
- `GET /api/notes/:id` - Get a single note
- `POST /api/notes` - Create a note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### Files
- `GET /api/files?chapterId=xxx` - Get files for a chapter
- `GET /api/files/:id` - Get file metadata
- `GET /api/files/:id/download` - Download a file
- `POST /api/upload` - Upload a file
- `DELETE /api/files/:id` - Delete a file

## Project Structure

```
knowledge-hub/
├── client/              # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/      # shadcn/ui components
│   │   │   ├── layout/  # Sidebar, Header, ThemeProvider
│   │   │   ├── effects/ # 3D particles, gradients, animations
│   │   │   └── sections/
│   │   ├── features/
│   │   │   ├── auth/    # Login, Register, ProtectedRoute
│   │   │   ├── subjects/
│   │   │   ├── chapters/
│   │   │   ├── notes/   # TipTap editor
│   │   │   └── files/   # Upload, preview
│   │   ├── hooks/       # Data hooks, animation hooks
│   │   ├── lib/         # API client, utilities
│   │   ├── stores/      # Zustand stores
│   │   └── types/       # TypeScript types
│   └── public/
├── server/              # Backend (Express + Prisma)
│   ├── src/
│   │   ├── lib/        # Prisma, JWT, bcrypt
│   │   ├── middleware/ # Auth, error handler, upload
│   │   ├── routes/     # Auth, subjects, chapters, notes, files
│   │   └── config/
│   └── prisma/
├── docker-compose.yml
└── .env.example
```

## License

MIT
