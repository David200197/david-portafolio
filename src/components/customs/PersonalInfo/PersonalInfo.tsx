import { AstronautDeveloper, StyledGrid } from './PersonalInfo.styled'
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
import { useTranslation } from 'react-i18next'

const PersonalInfo = () => {
  const { t } = useTranslation()

  return (
    <Container id='personal_info'>
      <InitialCurveStyled />
      <InfoStyled>
        <PersonalInfoTitle variant='h5' mt={2}>
          {t(`navigations.about_me`)}
        </PersonalInfoTitle>
        <Grid container spacing={2} mt={3} alignItems='center'>
          <StyledGrid item xs={12} md={6} textAlign='center'>
            <AstronautDeveloper src={'astronaut_developer.svg'} alt='avatar' />
            <PersonalInfoDescription variant='body1'>{t(db.profile.description)}</PersonalInfoDescription>
            <Social socials={db.socials} />
          </StyledGrid>
          <StyledGrid item xs={12} md={6} display='flex' flexDirection='column' alignItems='center'>
            <PersonalInfoTitle variant='h5' mt={2}>
              {t('skills')}
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
