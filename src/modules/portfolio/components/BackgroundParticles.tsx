'use client'

import { useEffect, useRef } from 'react'
import { loadFull } from 'tsparticles'
import { PortfolioService } from '../services/portfolio-service'
import { getService } from '@/modules/core/utils/di-utils'
import { tsParticles } from '@tsparticles/engine'

const particleOptions = getService(PortfolioService).getParticlesOptions()

export const BackgroundParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current || !containerRef.current) return

    const initializeParticles = async () => {
      await loadFull(tsParticles)

      if (containerRef.current) {
        await tsParticles.load({
          id: 'tsparticles',
          element: containerRef.current,
          options: particleOptions,
        })
        initialized.current = true
      }
    }

    initializeParticles()

    return () => {
      if (containerRef.current) {
        tsParticles.dom().forEach((container) => {
          container.destroy()
        })
      }
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
