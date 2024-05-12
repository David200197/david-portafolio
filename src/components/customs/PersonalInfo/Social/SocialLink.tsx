import { IconMui } from '@/interface/icon'
import Tooltip from '@mui/material/Tooltip'

type Props = {
  to: string
  title: string
  icon: IconMui
}
const SocialLink = ({ to, title, icon: IconProp }: Props) => (
  <Tooltip arrow title={title}>
    <a href={to} style={{ margin: '0 10px' }} target='_blank' rel='noreferrer'>
      <IconProp fontSize='large' htmlColor='white' />
    </a>
  </Tooltip>
)
export default SocialLink
