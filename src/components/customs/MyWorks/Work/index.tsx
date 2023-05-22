import { Box, Button } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Fragment } from 'react'
import { AvatarWork, ContainerSvg, JobCard } from './Work.styled'

type Props = {
  title: string
  alt: string
  image: string
  description: string
  time: string
  skills: JSX.Element[]
  link?: string
}

const Work = ({ title, image, alt, description, time, skills, link }: Props) => (
  <JobCard variant='outlined'>
    <CardHeader
      avatar={<AvatarWork aria-label='recipe'>{title[0].toUpperCase()}</AvatarWork>}
      title={title}
      subheader={time}
    />
    <CardMedia component='img' height='194' image={image} alt={alt} />
    <CardContent>
      <Typography variant='body2' color='text.secondary'>
        {description}
      </Typography>
    </CardContent>
    <CardActions disableSpacing>
      <Box display='flex' justifyContent='space-between' alignItems='center' width='100%' height='100%'>
        <ContainerSvg>
          {skills.map((skill, index) => (
            <Fragment key={`${title.split(' ').join(' ')}-${index}`}>{skill}</Fragment>
          ))}
        </ContainerSvg>
        {link && (
          <Button href={link} target='_blank' rel='noreferrer'>
            View
          </Button>
        )}
      </Box>
    </CardActions>
  </JobCard>
)
export default Work
