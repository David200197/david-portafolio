import Box from '@mui/material/Box'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TelegramIcon from '@mui/icons-material/Telegram'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import SocialLink from './SocialLink'

const Social = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
    <SocialLink title='GitHub' icon={GitHubIcon} to={'https://github.com/David200197'} />
    <SocialLink
      title='LinkedIn'
      icon={LinkedInIcon}
      to={'https://www.linkedin.com/in/david-alfonso-pereira-40b350253/'}
    />
    <SocialLink title='Telegram' icon={TelegramIcon} to={'https://t.me/Dafoneira'} />
    <SocialLink title='WhatsApp' icon={WhatsAppIcon} to={'https://wa.me/qr/ETYTO7EVAJT6F1'} />
    <SocialLink title='Download CV' icon={FileDownloadIcon} to={'/CV.pdf'} />
  </Box>
)
export default Social
