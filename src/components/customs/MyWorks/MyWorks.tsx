import Grid from '@mui/material/Grid2'
import { Section } from './MyWork.styled'
import Work from './Work'
import Typography from '@mui/material/Typography'
import { primaryMain } from '@/providers/Theme'
import db from '@/db'
import { useTranslation } from 'react-i18n-thin'

export const MyWorks = () => {
  const { t } = useTranslation()

  return (
    <Section>
      <Typography color={primaryMain} textAlign='center' variant='h5' component={'h1'}>
        {t('jobs')}
      </Typography>
      <Grid container spacing={2} mt={3}>
        {db.jobs.map((job, index) => (
          <Grid
            data-job={job.title}
            data-job-type={job.type}
            key={`job_${index}`}
            size={{ xs: 6, md: 4 }}
            display='flex'
            justifyContent='center'
          >
            <Work
              alt={job.alt}
              logoSrc={job.logoSrc}
              description={t(job.description)}
              image={job.image}
              title={job.title}
              time={t(job.time)}
              skills={job.skills}
              link={job.link}
            />
          </Grid>
        ))}
      </Grid>
    </Section>
  )
}
export default MyWorks
