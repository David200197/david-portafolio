/// <reference types="vite-plugin-svgr/client" />
import { ReactComponent as DownArrow } from '@/assets/down-arrow.svg'
import { DOWN_BUTTON_CLASSNAME } from './constant'
import { ButtonContainer } from './DownButton.styled'
import { primaryMain } from '@/providers/Theme'
import { Link } from 'react-scroll'
import { PERSONAL_INFO_MARK } from '@/constant'

const DownButton = () => (
  <ButtonContainer variant='text' disableElevation disableFocusRipple disableRipple className={DOWN_BUTTON_CLASSNAME}>
    <Link to={PERSONAL_INFO_MARK} spy smooth hashSpy offset={-120} duration={800}>
      <DownArrow width={35} height={35} fill={primaryMain} />
    </Link>
  </ButtonContainer>
)

export default DownButton
