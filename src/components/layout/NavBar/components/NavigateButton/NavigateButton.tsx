import { Link } from 'react-scroll'
import { ButtonStyled } from './NavigateButton.styled'

type Props = { to: string; children: string; offset?: number; onClick?: () => void }
const NavigateButton = ({ to, children, offset = 0, onClick }: Props) => {
  return (
    <ButtonStyled onClickCapture={onClick} data-to-scrollspy-id={to}>
      <Link to={to} spy smooth hashSpy offset={offset} duration={800}>
        {children}
      </Link>
    </ButtonStyled>
  )
}
export default NavigateButton
