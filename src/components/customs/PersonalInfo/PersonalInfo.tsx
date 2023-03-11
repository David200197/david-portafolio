import { Avatar, StyledGrid } from './PersonalInfo.styled'
import Grid from '@mui/material/Grid'
import {
  Container,
  FinalCurveStyled,
  InfoStyled,
  InitialCurveStyled,
  PersonalInfoDescription,
  PersonalInfoTitle
} from './PersonalInfo.styled'
import Skills from './Skills'
import Social from './Social'

const PersonalInfo = () => {
  return (
    <Container>
      <InitialCurveStyled />
      <InfoStyled>
        <PersonalInfoTitle variant='h5' mt={2}>
          About me...
        </PersonalInfoTitle>
        <Grid container spacing={2} mt={3} alignItems='center'>
          <StyledGrid item xs={12} md={6} textAlign='center'>
            <Avatar src='/avatar.jfif' alt='avatar' />
            <PersonalInfoDescription variant='body1'>
              Hi! I am David Alfonso Pereira, a fullstack developer with more than 3 years of experience, master various
              technologies and with a teamwork mentality
            </PersonalInfoDescription>
            <Social />
          </StyledGrid>
          <StyledGrid item xs={12} md={6} display='flex' flexDirection='column' alignItems='center'>
            <PersonalInfoTitle variant='h5' mt={2}>
              Skills
            </PersonalInfoTitle>
            <Skills />
          </StyledGrid>
        </Grid>
      </InfoStyled>
      <FinalCurveStyled />
    </Container>
  )
}

export default PersonalInfo
