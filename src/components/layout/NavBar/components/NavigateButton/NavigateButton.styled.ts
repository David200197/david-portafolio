import { Button, styled } from '@mui/material'

export const ButtonStyled = styled(Button)({
  margin: '0 5px',
  borderRadius: 0,
  '&.active-scroll-spy': {
    borderBottom: '3px solid black !important',
    transition: 'all 0.2s'
  }
})
