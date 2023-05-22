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
          description='Teigee is a platform to search, compare and review products, activities and characteristics from local businesses around you. We collaborate closely with our partners to keep our information trustworthy and up to date.'
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
          description='Luvsuite is an application that allows users to find and book accommodation online. It offers a wide variety of accommodation options, from hotels and motels to apartments, houses or private rooms.'
          image='/work-003.webp'
          title='Luvsuit'
          time='December 2022 - May 2023'
          skills={[<NestSkill />]}
        />
      </Grid>
      <Grid item xs={12} md={4} display='flex' justifyContent='center'>
        <Work
          alt=''
          description='Leiizy is an AI-powered content generation platform that utilizes ChatGPT technology to help users create custom content for various tasks, such as writing emails, crafting social media posts, or composing video descriptions.'
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
