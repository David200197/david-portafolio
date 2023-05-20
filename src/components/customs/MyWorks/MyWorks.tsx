import Grid from '@mui/material/Grid'
import { Section } from './MyWork.styled'
import Work from './Work'
import { GraphqlSkill, MuiSkill, NestSkill, NextSkill } from '../Skills'
import Typography from '@mui/material/Typography'
import { primaryMain } from '@/providers'

export const MyWorks = () => (
  <Section>
    <Typography color={primaryMain} textAlign='center' variant='h5' component={'h1'}>
      My Jobs
    </Typography>
    <Grid container spacing={2} mt={3}>
      <Grid item xs={12} md={4} display='flex' justifyContent='center'>
        <Work
          alt=''
          description='lorem das das das das das d asd as das d asd as das '
          image='/work-001.png'
          title='Teigee'
          time='January 2021 - Present'
          skills={[<NextSkill />, <MuiSkill />, <GraphqlSkill />]}
          link='http://www.teigee.com'
        />
      </Grid>
      <Grid item xs={12} md={4} display='flex' justifyContent='center'>
        <Work
          alt=''
          description='lorem das das das das das d asd as das d asd as das '
          image='/work-003.webp'
          title='Luvsuit'
          time='December 2022 - May 2023'
          skills={[<NestSkill />]}
        />
      </Grid>
      <Grid item xs={12} md={4} display='flex' justifyContent='center'>
        <Work
          alt=''
          description='lorem das das das das das d asd as das d asd as das '
          image='/work-002.png'
          title='Leiizy'
          time='Febrary 2023 - Present'
          skills={[<NextSkill />, <MuiSkill />]}
          link='https://www.leiizy.com'
        />
      </Grid>
    </Grid>
  </Section>
)
export default MyWorks
