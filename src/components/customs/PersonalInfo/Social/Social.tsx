import Box from '@mui/material/Box'
import SocialLink from './SocialLink'
import { Social as SocialType } from '@/interface/db'

type Props = { socials: SocialType[] }
const Social = ({ socials }: Props) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
    {socials.map((social, index) => (
      <SocialLink key={`social_${index}`} title={social.title} icon={social.icon} to={social.to} />
    ))}
  </Box>
)
export default Social
