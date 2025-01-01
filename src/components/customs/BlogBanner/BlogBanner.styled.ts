import { ReactComponent as FinalCurve } from '@/assets/banners/finalCurve.svg'
import { SectionContainer } from '@/components/global/styled'
import { Box, Button, styled } from '@mui/material'

export const Container = styled(Box)({
  position: 'relative'
})

export const InitialCurveStyled = styled(FinalCurve)({
  zIndex: 3,
  bottom: 'calc(100% - 20px)',
  position: 'absolute',
  rotate: '180deg'
})

export const BlogBannerContainerStyled = styled(SectionContainer)(({ theme }) => ({
  background: theme.palette.primary.main,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  minHeight: '300px',
  color: 'white'
}))

export const BlogButton = styled(Button)({
  width: 'auto',
  marginTop: '10px',
  background: '#cbcbdd',
  color: '#202033',
  '&:hover': {
    background: '#fff'
  }
})
