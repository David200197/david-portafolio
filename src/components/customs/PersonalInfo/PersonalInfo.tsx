import { useTranslation } from 'react-i18n-thin'
import { AstronautDeveloper, StyledGrid } from './PersonalInfo.styled'
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
import Grid from '@mui/material/Grid2'
import { useRef } from 'react'

const PersonalInfo = () => {
  const { t } = useTranslation()
  const years = useRef(new Date().getFullYear() - 2021).current

  return (
    <Container id='personal_info'>
      <InitialCurveStyled />
      <InfoStyled>
        <PersonalInfoTitle variant='h5' mt={2}>
          {t(`about_me`)}
        </PersonalInfoTitle>
        <Grid container spacing={2} mt={3} alignItems='center'>
          <StyledGrid size={{ xs: 12, md: 6 }} textAlign='center'>
            <AstronautDeveloper src={'astronaut_developer.svg'} alt='avatar' />
            <PersonalInfoDescription variant='body1'>{t(db.profile.description, { years })}</PersonalInfoDescription>
            <Social socials={db.socials} />
          </StyledGrid>
          <StyledGrid size={{ xs: 12, md: 6 }} display='flex' flexDirection='column' alignItems='center'>
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
