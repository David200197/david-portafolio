/// <reference types="vite-plugin-svgr/client" />
import { ReactComponent as InitialCurve } from '@/assets/banners/initialCurve.svg'
import { ReactComponent as FinalCurve } from '@/assets/banners/finalCurve.svg'
import Box from '@mui/material/Box'
import { styled } from '@mui/material'
import { SectionContainer } from '@/components/global/styled'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

export const Container = styled(Box)({
  position: 'relative'
})
export const InitialCurveStyled = styled(InitialCurve)({
  zIndex: 3,
  bottom: 'calc(100% - 20px)',
  position: 'absolute'
})

export const InfoStyled = styled(SectionContainer)(({ theme }) => ({
  background: theme.palette.primary.main,
  width: '100%',
  minHeight: '400px',
  color: 'white'
}))

export const FinalCurveStyled = styled(FinalCurve)({
  zIndex: 3,
  top: 'calc(100% - 20px)',
  position: 'absolute'
})

export const PersonalInfoTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  textAlign: 'center'
}))

export const PersonalInfoDescription = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  textAlign: 'center',
  padding: 0,
  [theme.breakpoints.down('md')]: {
    padding: `0 ${theme.spacing(5)}`
  }
}))

export const Avatar = styled('img')({
  width: 300,
  height: 'auto',
  clipPath: 'circle(var(80px) at var(0) var(0))',
  borderRadius: '50%'
})

export const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(5)
  }
}))
