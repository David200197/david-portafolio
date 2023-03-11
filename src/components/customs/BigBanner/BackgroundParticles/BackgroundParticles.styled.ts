import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import Particles from 'react-tsparticles'

const isBlackdropFilterSupported = CSS.supports('backdrop-filter', 'blur(4px)')

export const BlurScreen = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  backdropFilter: 'blur(4px)',
  backgroundColor: isBlackdropFilterSupported ? undefined : 'rgba(255, 255, 255, 0.7)',
  filter: isBlackdropFilterSupported ? undefined : 'blur(18px)'
})

export const Container = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '115vh',
  '@media screen and (min-width: 720px)': {
    height: '135vh'
  }
}))

export const StyledParticles = styled(Particles)({
  height: '100%'
})
