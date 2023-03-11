import Box from '@mui/material/Box'
import { styled } from '@mui/material'

export const SectionContainer = styled(Box)(({ theme }) => ({
  padding: `${theme.spacing(2)} 14px`,
  [theme.breakpoints.only('lg')]: {
    padding: `${theme.spacing(2)} 10%`
  },
  [theme.breakpoints.up('xl')]: {
    padding: `${theme.spacing(2)} 13%`
  }
}))
