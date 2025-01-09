import Typer from '@/components/customs/Typer'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useState } from 'react'
import { WrapperTitle } from './TitleBanner.styled'
import { primaryMain } from '@/providers/Theme'
import { useTranslation } from 'react-i18n-thin'

const TitleBanner = () => {
  const { t } = useTranslation()
  const [isEndLine, setIsEndLine] = useState(false)
  const onComplete = () => {
    setIsEndLine(true)
  }

  return (
    <WrapperTitle>
      {isEndLine ? (
        <Typography variant='h3' fontFamily='sans-serif' paddingTop={1.699} color={primaryMain}>
          {t('big_title')}
        </Typography>
      ) : (
        <Typer
          color={primaryMain}
          variant='h3'
          fontSizeCursor={'3rem'}
          strings={[t('big_title')]}
          typeSpeed={25}
          onComplete={onComplete}
        />
      )}

      {isEndLine ? (
        <Typer color={primaryMain} variant='h6' fontSizeCursor='1.5rem' strings={[t('small_title')]} typeSpeed={25} />
      ) : (
        <Box padding={2} />
      )}
    </WrapperTitle>
  )
}
export default TitleBanner
