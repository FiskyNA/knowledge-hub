import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { TooltipProvider } from '@/components/ui/tooltip'
import { AppLayout } from '@/components/layout/AppLayout'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { QueryProvider } from '@/components/layout/QueryProvider'

import { LandingPage } from '@/features/subjects/pages/LandingPage'
import { SubjectPage } from '@/features/subjects/pages/SubjectPage'
import { ChapterPage } from '@/features/chapters/pages/ChapterPage'
import { NotePage } from '@/features/notes/pages/NotePage'
import { FilePage } from '@/features/files/pages/FilePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'subjects/:subjectId', element: <SubjectPage /> },
      { path: 'subjects/:subjectId/chapters/:chapterId', element: <ChapterPage /> },
      { path: 'notes/:noteId', element: <NotePage /> },
      { path: 'files/:fileId', element: <FilePage /> },
    ],
  },
])

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}

export default App
