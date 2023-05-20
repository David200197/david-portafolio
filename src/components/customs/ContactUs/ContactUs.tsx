import { Typography } from '@mui/material'
import {
  ContactUsContainerStyled,
  ContactUsForm,
  Container,
  InitialCurveStyled,
  TextFieldStyled
} from './ContactUs.styled'

const ContactUs = () => (
  <Container>
    <InitialCurveStyled />
    <ContactUsContainerStyled>
      <Typography color='#fff' textAlign='center' variant='h5' component={'h1'}>
        Contact Me
      </Typography>
      <ContactUsForm>
        <TextFieldStyled label='Your Name' variant='outlined' />
        <TextFieldStyled label='Your Email' variant='outlined' />
        <TextFieldStyled label='Your Phone' variant='outlined' />
        <TextFieldStyled label='Your Message' variant='outlined' multiline={true} rows={5} />
      </ContactUsForm>
    </ContactUsContainerStyled>
  </Container>
)
export default ContactUs
