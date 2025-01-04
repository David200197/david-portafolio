import { loadFull } from 'tsparticles'
import { BlurScreen, Container, StyledParticles } from './BackgroundParticles.styled'
import { particlesOptions } from './particles-options'
import { initParticlesEngine } from '@tsparticles/react'
import { useEffect, useState } from 'react'

const BackgroundParticles = () => {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async engine => {
      await loadFull(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  return (
    <Container>
      {init && <StyledParticles id='tsparticles' options={particlesOptions} />}
      <BlurScreen />
    </Container>
  )
}

export default BackgroundParticles
