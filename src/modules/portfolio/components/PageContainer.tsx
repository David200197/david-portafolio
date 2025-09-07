import { ReactNode } from 'react'
import { BackgroundParticles } from './BackgroundParticles'
import { BlurScreen } from './BlurScreen'

type Props = { children: ReactNode; height?: string; id?: string }
export const PageContainer = ({ children, height = '100%', id }: Props) => {
  return (
    <section className="min-h-screen flex flex-col" id={id}>
      {children}
      <BackgroundParticles />
      <BlurScreen height={height} />
    </section>
  )
}
