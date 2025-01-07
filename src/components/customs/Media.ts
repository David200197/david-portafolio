import { styled } from '@mui/material'

export const DesktopMedia = styled('div')({
  '@media (max-width: 767px)': {
    display: 'none'
  },
  display: 'flex'
})

export const MobileMedia = styled('div')({
  '@media (min-width: 768px)': {
    display: 'none'
  }
})
