import { CircularProgress, Typography } from '@mui/material'
import {
  ButtonSubmit,
  ContactUsContainerStyled,
  ContactUsForm,
  Container,
  InitialCurveStyled,
  InputContainer,
  TextFieldStyled
} from './ContactUs.styled'
import { useForm } from 'react-hook-form'
import { ContactField, contactResolver } from './schema'
import { send } from '@emailjs/browser'
import { PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID } from '@/enviroment'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import { EMAIL, MESSAGE, NAME } from './constant'

const ContactUs = () => {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<ContactField>({ resolver: contactResolver as any }) //FIXME: fix the problem with yup and typescipt

  const onSubmit = handleSubmit(async ({ EMAIL, MESSAGE, NAME }) => {
    try {
      setLoading(true)
      await send(SERVICE_ID, TEMPLATE_ID, { EMAIL, MESSAGE, NAME }, PUBLIC_KEY)
      toast.success('The message was sent')
      setLoading(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      //FIXME: fix the problem with error type
      toast.error(error)
    }
  })

  return (
    <Container>
      <InitialCurveStyled />
      <ContactUsContainerStyled>
        <Typography color='#fff' textAlign='center' variant='h5' component={'h1'}>
          Contact Me
        </Typography>
        <ContactUsForm onSubmit={onSubmit}>
          <InputContainer>
            <TextFieldStyled
              label='Your Name'
              variant='outlined'
              {...register(NAME)}
              error={Boolean(errors.NAME)}
              helperText={errors.NAME?.message}
            />
            <TextFieldStyled
              label='Your Email'
              variant='outlined'
              {...register(EMAIL)}
              error={Boolean(errors.EMAIL)}
              helperText={errors.EMAIL?.message}
            />
            <TextFieldStyled
              label='Your Message'
              variant='outlined'
              {...register(MESSAGE)}
              multiline={true}
              rows={9}
              error={Boolean(errors.MESSAGE)}
              helperText={errors.MESSAGE?.message}
            />
          </InputContainer>
          <ButtonSubmit type='submit' variant='outlined' disabled={loading}>
            {loading ? <CircularProgress size={23} /> : 'Submit'}
          </ButtonSubmit>
        </ContactUsForm>
      </ContactUsContainerStyled>
    </Container>
  )
}
export default ContactUs
