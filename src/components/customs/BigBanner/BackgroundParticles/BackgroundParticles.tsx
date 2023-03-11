import { loadFull } from 'tsparticles'
import { Engine } from 'tsparticles-engine'
import { BlurScreen, Container, StyledParticles } from './BackgroundParticles.styled'
import { particlesOptions } from './particles-options'

const BackgroundParticles = () => {
  const particlesInit = async (main: Engine) => {
    await loadFull(main)
  }

  return (
    <Container>
      <StyledParticles init={particlesInit} options={particlesOptions} />
      <BlurScreen />
    </Container>
  )
}

export default BackgroundParticles
