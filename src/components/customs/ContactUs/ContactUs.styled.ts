import { ReactComponent as FinalCurve } from '@/assets/banners/finalCurve.svg'
import { SectionContainer } from '@/components/global/styled'
import { Box, TextField, styled } from '@mui/material'

export const Container = styled(Box)({
  position: 'relative'
})

export const InitialCurveStyled = styled(FinalCurve)({
  zIndex: 3,
  bottom: 'calc(100% - 20px)',
  position: 'absolute',
  rotate: '180deg'
})

export const ContactUsContainerStyled = styled(SectionContainer)(({ theme }) => ({
  background: theme.palette.primary.main,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  minHeight: '400px',
  color: 'white'
}))

export const ContactUsForm = styled(Box)({
  width: '100%',
  maxWidth: '400px',
  height: '500px',
  boxShadow: 'rgba(255, 255, 255, 0.1) 0px 10px 50px;',
  borderRadius: '15px',
  marginTop: '50px',
  marginBottom: '50px',
  background: '#39394C',
  padding: '20px'
})

export const TextFieldStyled = styled(TextField)({
  width: '100%',
  margin: '10px 0',
  label: {
    color: '#cbcbdd !important'
  },
  input: {
    color: '#cbcbdd !important'
  },
  textarea: {
    color: '#cbcbdd !important'
  },
  '&:focus': {
    label: {
      color: '#cbcbdd !important'
    }
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#565670'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#565670'
    }
  }
})
