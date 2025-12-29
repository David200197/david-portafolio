// src/modules/portfolio/components/BackgroundParticles.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

export const BackgroundParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const delay = window.innerWidth < 768 ? 4000 : 2500

    const scheduleLoad = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => setIsVisible(true), { timeout: delay })
      } else {
        setTimeout(() => setIsVisible(true), delay)
      }
    }

    if (document.readyState === 'complete') {
      scheduleLoad()
    } else {
      window.addEventListener('load', scheduleLoad)
      return () => window.removeEventListener('load', scheduleLoad)
    }
  }, [])

  useEffect(() => {
    if (!isVisible || initialized.current || !containerRef.current) return

    const loadParticles = async () => {
      const [{ tsParticles }, { loadSlim }, { particlesOptions }] =
        await Promise.all([
          import('@tsparticles/engine'),
          import('@tsparticles/slim'),
          import('@/modules/portfolio/services/options/particles'),
        ])

      await loadSlim(tsParticles)

      if (containerRef.current) {
        const isMobile = window.innerWidth < 768
        await tsParticles.load({
          id: 'tsparticles',
          element: containerRef.current,
          options: {
            ...particlesOptions,
            particles: {
              ...particlesOptions.particles,
              number: {
                ...particlesOptions.particles?.number,
                value: isMobile ? 20 : 80,
              },
            },
            detectRetina: false,
          },
        })
        initialized.current = true
      }
    }

    loadParticles()

    return () => {
      import('@tsparticles/engine').then(({ tsParticles }) => {
        tsParticles.dom().forEach((c) => c.destroy())
      })
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      id="tsparticles"
      className="absolute inset-0 -z-10"
    />
  )
}
