import { ButtonStyled } from './NavigateButton.styled'
import { useLocation, useNavigate } from 'react-router-dom'

type Props = { to: string; children: string; onClick?: () => void; mark?: string }
const NavigateButton = ({ to, children, onClick, mark }: Props) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onClickHandler = () => {
    if (onClick) onClick()
    navigate(to)
  }

  return (
    <ButtonStyled
      className={pathname === to ? 'active-scroll-spy' : ''}
      onClickCapture={onClickHandler}
      data-to-scrollspy-id={mark}
    >
      {children}
    </ButtonStyled>
  )
}
export default NavigateButton
