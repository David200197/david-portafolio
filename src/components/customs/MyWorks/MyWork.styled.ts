import { styled } from '@mui/material'
import { SectionContainer } from '@/components/global/styled'

export const Section = styled(SectionContainer)(({ theme }) => ({
  background: '#fff',
  minHeight: 'auto',
  paddingTop: '200px',
  paddingBottom: '350px !important',
  [theme.breakpoints.up('md')]: {
    paddingTop: '300px !important'
  }
}))
