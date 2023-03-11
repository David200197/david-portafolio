import Button from '@mui/material/Button'
import { styled } from '@mui/material'

export const ButtonContainer = styled(Button)({
  '@keyframes low-fly-row': {
    '0%': { transform: 'translate(-33px,0)' },
    '50%': { transform: 'translate(-33px,-30px)' },
    '100%': { transform: 'translate(-33px,0)' }
  },
  position: 'absolute',
  top: '90vh',
  left: '50%',
  right: '50%',
  animation: 'low-fly-row 2s ease-in-out infinite alternate',
  cursor: 'pointer',
  zIndex: 3,
  background: 'transparent',
  '&:hover': {
    background: 'transparent'
  }
})
