import { styled } from '@mui/material'
import Box from '@mui/material/Box'

export const WrapperTitle = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'absolute',
  top: '50vh',
  transform: 'translate(-50%, -50%)',
  left: '50%',
  zIndex: 3,
  whiteSpace: 'nowrap'
})
