'use client'

import { useState, useEffect } from 'react'
import { WrapperTitle } from './WrapperTitle'
import { usePorfolio } from '../../context/PortfolioContext'
import dynamic from 'next/dynamic'

const Typer = dynamic(() => import('../Typer'), {
  ssr: false,
  loading: () => null,
})

const TitleBanner = () => {
  const [showTyper, setShowTyper] = useState(false)
  const { title } = usePorfolio()

  useEffect(() => {
    const timer = setTimeout(() => setShowTyper(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <WrapperTitle>
      <h1 className="font-sans text-3xl lg:text-5xl" style={{ color: '#000' }}>
        {title.big}
      </h1>

      {/* Efecto secundario: carga después */}
      {showTyper ? (
        <Typer
          className="font-sans text-base lg:text-xl mt-2"
          color="#000"
          fontSizeCursor="1.5rem"
          strings={[title.small]}
          typeSpeed={25}
        />
      ) : (
        <p className="font-sans text-base lg:text-xl mt-2 opacity-0">
          {title.small}
        </p>
      )}
    </WrapperTitle>
  )
}
export default TitleBanner
