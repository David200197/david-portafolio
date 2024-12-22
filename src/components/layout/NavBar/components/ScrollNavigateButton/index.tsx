import { Link } from 'react-scroll'
import { ButtonStyled } from './NavigateButton.styled'

type Props = { to: string; children: string; offset?: number; onClick?: () => void }
const ScrollNavigateButton = ({ to, children, offset = 0, onClick }: Props) => {
  const onClickHandler = async () => {
    if (onClick) onClick()
  }

  return (
    <ButtonStyled onClickCapture={onClickHandler} data-to-scrollspy-id={to}>
      <Link to={to} spy smooth hashSpy offset={offset} duration={800}>
        {children}
      </Link>
    </ButtonStyled>
  )
}
export default ScrollNavigateButton
