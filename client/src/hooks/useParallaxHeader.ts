import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function useParallaxHeader() {
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const handleScroll = () => {
      const scrollY = window.scrollY

      if (scrollY > 10) {
        gsap.to(header, {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'hsla(0, 0%, 0%, 0.7)',
          height: '56px',
          duration: 0.3,
          ease: 'power2.out',
        })
      } else {
        gsap.to(header, {
          backdropFilter: 'none',
          backgroundColor: 'transparent',
          height: '64px',
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return headerRef
}
