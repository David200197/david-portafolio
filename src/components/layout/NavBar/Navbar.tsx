/// <reference types="vite-plugin-svgr/client" />
import { ReactComponent as Logo } from '@/assets/logo.svg'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useContainer } from './Navbar.container'
import { LinkStyled, StyledAppBar, ToolbarStyled } from './Navbar.styled'
import { primaryMain } from '@/providers'

const NavBar = () => {
  const { isInitialPosition } = useContainer()
  return (
    <Box flexGrow={1}>
      <StyledAppBar position='fixed' isInitialPosition={isInitialPosition}>
        <ToolbarStyled disableGutters>
          <LinkStyled to=''>
            <Logo width={'35px'} height={'35px'} fill={primaryMain} />
            <Typography marginLeft={1.5} color={'black'} variant='h1' fontSize={26}>
              David's Portafolio
            </Typography>
          </LinkStyled>
        </ToolbarStyled>
      </StyledAppBar>
    </Box>
  )
}

export default NavBar
