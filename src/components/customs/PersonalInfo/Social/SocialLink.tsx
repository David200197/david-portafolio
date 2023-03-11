import { SvgIconTypeMap } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { OverridableComponent } from '@mui/material/OverridableComponent'

type Props = {
  to: string
  title: string
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string
  }
}
const SocialLink = ({ to, title, icon: IconProp }: Props) => (
  <Tooltip arrow title={title}>
    <a href={to} style={{ margin: '0 10px' }} target='_blank' rel='noreferrer'>
      <IconProp fontSize='large' htmlColor='white' />
    </a>
  </Tooltip>
)
export default SocialLink
