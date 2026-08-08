import { SubjectTreeView } from '@/features/subjects/components/SubjectTreeView'

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Knowledge Hub</h1>
      <p className="text-gray-600 dark:text-gray-300">Class 10 study notes and resources</p>

      <SubjectTreeView />
    </div>
  )
}
