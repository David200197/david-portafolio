/// <reference types="vite-plugin-svgr/client" />
import { ReactComponent as DownArrow } from '@/assets/down-arrow.svg'
import { DOWN_BUTTON_CLASSNAME } from './constant'
import { ButtonContainer } from './DownButton.styled'
import { primaryMain } from '@/providers/Theme'

type Props = { onClick: () => void }

const DownButton = ({ onClick }: Props) => (
  <ButtonContainer
    onClick={onClick}
    variant='text'
    disableElevation
    disableFocusRipple
    disableRipple
    className={DOWN_BUTTON_CLASSNAME}
  >
    <DownArrow width={35} height={35} fill={primaryMain} />
  </ButtonContainer>
)

export default DownButton
