'use client'

import { useEffect, useRef } from 'react'
import { PortfolioService } from '../services/portfolio-service'
import { getService } from '@/modules/core/utils/di-utils'

const particleOptions = getService(PortfolioService).getParticlesOptions()

export const BackgroundParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current || !containerRef.current) return

    const timeoutId = setTimeout(async () => {
      const [{ tsParticles }, { loadSlim }] = await Promise.all([
        import('@tsparticles/engine'),
        import('@tsparticles/slim'),
      ])

      await loadSlim(tsParticles)

      if (containerRef.current) {
        // Reducir partículas en móvil
        const isMobile = window.innerWidth < 768
        const options = {
          ...particleOptions,
          particles: {
            ...particleOptions.particles,
            number: {
              ...particleOptions.particles?.number,
              value: isMobile ? 50 : 200,
            },
          },
        }

        await tsParticles.load({
          id: 'tsparticles',
          element: containerRef.current,
          options,
        })
        initialized.current = true
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      import('@tsparticles/engine').then(({ tsParticles }) => {
        tsParticles.dom().forEach((container) => container.destroy())
      })
    }
  }, [])

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
