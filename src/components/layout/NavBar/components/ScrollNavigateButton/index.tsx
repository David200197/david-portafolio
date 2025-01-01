import { Link } from 'react-scroll'
import { ButtonStyled } from './NavigateButton.styled'
import { useLocation, useNavigate } from 'react-router-dom'

type Props = { mark: string; children: string; offset?: number; onClick?: () => void }
const ScrollNavigateButton = ({ mark, children, offset = 0, onClick }: Props) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isHomePath = pathname === '/'

  const onClickHandler = async () => {
    if (onClick) onClick()
    if (!isHomePath) navigate('/')
  }

  return (
    <ButtonStyled
      className={isHomePath ? '' : 'none-style'}
      onClickCapture={onClickHandler}
      data-to-scrollspy-id={mark}
    >
      <Link to={mark} spy smooth hashSpy offset={offset} duration={800}>
        {children}
      </Link>
    </ButtonStyled>
  )
}
export default ScrollNavigateButton
