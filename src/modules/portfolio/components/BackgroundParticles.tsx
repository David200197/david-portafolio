'use client'

import { useEffect, useRef, useState } from 'react'
import { getPortfolioService } from '@/modules/core/utils/di-utils'

const particleOptions = getPortfolioService().getParticlesOptions()

export const BackgroundParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const scheduleLoad = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => setIsVisible(true), { timeout: 3000 })
      } else {
        setTimeout(() => setIsVisible(true), 2000)
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
      const [{ tsParticles }, { loadSlim }] = await Promise.all([
        import('@tsparticles/engine'),
        import('@tsparticles/slim'),
      ])

      await loadSlim(tsParticles)

      if (containerRef.current) {
        const isMobile = window.innerWidth < 768
        const options = {
          ...particleOptions,
          particles: {
            ...particleOptions.particles,
            number: {
              ...particleOptions.particles?.number,
              value: isMobile ? 30 : 100,
            },
          },
          detectRetina: false,
        }

        await tsParticles.load({
          id: 'tsparticles',
          element: containerRef.current,
          options,
        })
        initialized.current = true
      }
    }

    loadParticles()

    return () => {
      import('@tsparticles/engine').then(({ tsParticles }) => {
        tsParticles.dom().forEach((container) => container.destroy())
      })
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      id="tsparticles"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  )
}
