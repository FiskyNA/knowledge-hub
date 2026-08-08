import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl px-4 lg:px-6">
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden h-8 w-8 p-0 -ml-1 mr-2"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <div className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
        v0.1.0
      </div>
    </header>
  )
}
