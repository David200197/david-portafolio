import Typer from '@/components/customs/Typer'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useState } from 'react'
import { BIG_TITLE } from './constants'
import { WrapperTitle } from './TitleBanner.styled'
import { primaryMain } from '@/providers/Theme'

const TitleBanner = () => {
  const [isEndLine, setIsEndLine] = useState(false)
  const onComplete = () => {
    setIsEndLine(true)
  }

  return (
    <WrapperTitle>
      {isEndLine ? (
        <Typography variant='h3' fontFamily='sans-serif' paddingTop={1.699} color={primaryMain}>
          {BIG_TITLE}
        </Typography>
      ) : (
        <Typer
          color={primaryMain}
          variant='h3'
          fontSizeCursor={'3rem'}
          strings={[BIG_TITLE]}
          typeSpeed={25}
          onComplete={onComplete}
        />
      )}

      {isEndLine ? (
        <Typer
          color={primaryMain}
          variant='h6'
          fontSizeCursor='1.5rem'
          strings={['I am Fullstack Developer']}
          typeSpeed={25}
        />
      ) : (
        <Box padding={2} />
      )}
    </WrapperTitle>
  )
}
export default TitleBanner
