import { loadFull } from 'tsparticles'
import { BlurScreen, Container, StyledParticles } from './BackgroundParticles.styled'
import { particlesOptions } from './particles-options'
import { Engine } from '@/interface/engine'

const BackgroundParticles = () => {
  const particlesInit = async (main: Engine) => await loadFull(main)

  return (
    <Container>
      <StyledParticles init={particlesInit} options={particlesOptions} />
      <BlurScreen />
    </Container>
  )
}

export default BackgroundParticles
