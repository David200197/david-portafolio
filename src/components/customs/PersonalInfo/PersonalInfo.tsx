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
import db from '@/db'

const PersonalInfo = () => {
  return (
    <Container id='personal_info'>
      <InitialCurveStyled />
      <InfoStyled>
        <PersonalInfoTitle variant='h5' mt={2}>
          About me...
        </PersonalInfoTitle>
        <Grid container spacing={2} mt={3} alignItems='center'>
          <StyledGrid item xs={12} md={6} textAlign='center'>
            <Avatar src={db.profile.avatar} alt='avatar' />
            <PersonalInfoDescription variant='body1'>{db.profile.description}</PersonalInfoDescription>
            <Social socials={db.socials} />
          </StyledGrid>
          <StyledGrid item xs={12} md={6} display='flex' flexDirection='column' alignItems='center'>
            <PersonalInfoTitle variant='h5' mt={2}>
              Skills
            </PersonalInfoTitle>
            <Skills skills={db.skills} />
          </StyledGrid>
        </Grid>
      </InfoStyled>
      <FinalCurveStyled />
    </Container>
  )
}

export default PersonalInfo
