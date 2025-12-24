'use client'

import DownArrow from '@/modules/core/svg/DownArrow'
import { ButtonContainer } from './ButtonContainer'
import Link from 'next/link'
import { usePorfolio } from '../../context/PortfolioContext'

const DownButton = () => {
  const { aboutMeHref } = usePorfolio()

  return (
    <ButtonContainer>
      <Link href={aboutMeHref} aria-label={'down'}>
        <DownArrow width={35} height={35} fill={'#000000'} />
      </Link>
    </ButtonContainer>
  )
}

export default DownButton
