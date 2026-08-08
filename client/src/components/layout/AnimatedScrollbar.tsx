import { useEffect } from 'react'

export function AnimatedScrollbar() {
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'custom-scrollbar'
    style.textContent = `
      :root {
        --scrollbar-bg: rgba(0, 0, 0, 0.03);
        --scrollbar-thumb: linear-gradient(180deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%);
        --scrollbar-thumb-hover: linear-gradient(180deg, #9333ea 0%, #b347d9 50%, #9333ea 100%);
      }

      ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }

      ::-webkit-scrollbar-track {
        background: var(--scrollbar-bg);
        border-radius: 10px;
      }

      ::-webkit-scrollbar-thumb {
        background: var(--scrollbar-thumb);
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: padding-box;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 
          0 0 0 2px rgba(139, 92, 246, 0.1),
          inset 0 0 0 1px rgba(139, 92, 246, 0.2);
      }

      ::-webkit-scrollbar-thumb:hover {
        background: var(--scrollbar-thumb-hover);
        box-shadow: 
          0 0 0 3px rgba(139, 92, 246, 0.2),
          0 0 10px rgba(139, 92, 246, 0.4),
          inset 0 0 0 1px rgba(139, 92, 246, 0.3);
        transform: scale(1.05);
      }

      ::-webkit-scrollbar-thumb:active {
        transform: scale(0.95);
      }

      html {
        scrollbar-width: thin;
        scrollbar-color: #8b5cf6 rgba(0, 0, 0, 0.03);
      }
    `

    document.head.appendChild(style)

    return () => {
      const existing = document.getElementById('custom-scrollbar')
      if (existing) existing.remove()
    }
  }, [])

  return null
}
