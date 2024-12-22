import { ButtonStyled } from './NavigateButton.styled'
import { useLocation, useNavigate } from 'react-router-dom'

type Props = { to: string; children: string; onClick?: () => void }
const NavigateButton = ({ to, children, onClick }: Props) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onClickHandler = () => {
    if (onClick) onClick()
    navigate(to)
  }

  return (
    <ButtonStyled className={pathname === to ? 'active-scroll-spy' : ''} onClickCapture={onClickHandler}>
      {children}
    </ButtonStyled>
  )
}
export default NavigateButton
