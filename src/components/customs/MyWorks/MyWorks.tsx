import Grid from '@mui/material/Grid'
import { Section } from './MyWork.styled'
import Work from './Work'
import Typography from '@mui/material/Typography'
import { primaryMain } from '@/providers'
import db from '@/db'

export const MyWorks = () => (
  <Section>
    <Typography color={primaryMain} textAlign='center' variant='h5' component={'h1'}>
      My Jobs
    </Typography>
    <Grid container spacing={2} mt={3}>
      {db.jobs.map((job, index) => (
        <Grid item xs={12} md={4} display='flex' justifyContent='center'>
          <Work
            key={`job_${index}`}
            alt={job.alt}
            logoSrc={job.logoSrc}
            description={job.description}
            image={job.image}
            title={job.title}
            time={job.time}
            skills={job.skills}
          />
        </Grid>
      ))}
    </Grid>
  </Section>
)
export default MyWorks
