/// <reference types="vite-plugin-svgr/client" />
import { ReactComponent as Logo } from '@/assets/logo.svg'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useContainer } from './Navbar.container'
import { DrawerContainer, LinkStyled, StyledAppBar, ToolbarStyled } from './Navbar.styled'
import { primaryMain } from '@/providers'
import { BANNER_MARK, CONTACT_US_MARK, MY_WORK_MARK, PERSONAL_INFO_MARK } from '@/constant'
import NavigateButton from './components/NavigateButton'
import { DesktopMedia, MobileMedia } from '@/components/customs/Media'
import MenuIcon from '@mui/icons-material/Menu'
import { IconButton, SwipeableDrawer } from '@mui/material'

const NavBar = () => {
  const { isInitialPosition, drawer, toggle } = useContainer()
  return (
    <Box flexGrow={1}>
      <StyledAppBar position='fixed' isInitialPosition={isInitialPosition}>
        <ToolbarStyled disableGutters>
          <LinkStyled to={BANNER_MARK} spy smooth hashSpy duration={800}>
            <Logo width={'35px'} height={'35px'} fill={primaryMain} />
            <DesktopMedia>
              <Typography marginLeft={1.5} color={'black'} variant='h1' fontSize={26}>
                David's Portafolio
              </Typography>
            </DesktopMedia>
          </LinkStyled>
          <MobileMedia>
            <IconButton color='inherit' aria-label='open drawer' onClick={toggle} edge='start'>
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer anchor={'right'} open={drawer} onClose={toggle} onOpen={toggle}>
              <DrawerContainer>
                <NavigateButton to={BANNER_MARK} onClick={toggle}>
                  Home
                </NavigateButton>
                <NavigateButton to={PERSONAL_INFO_MARK} offset={-120} onClick={toggle}>
                  About me
                </NavigateButton>
                <NavigateButton to={MY_WORK_MARK} offset={150} onClick={toggle}>
                  My Jobs
                </NavigateButton>
                <NavigateButton to={CONTACT_US_MARK} onClick={toggle}>
                  Contact Me
                </NavigateButton>
              </DrawerContainer>
            </SwipeableDrawer>
          </MobileMedia>
          <DesktopMedia>
            <NavigateButton to={BANNER_MARK}>Home</NavigateButton>
            <NavigateButton to={PERSONAL_INFO_MARK} offset={-120}>
              About me
            </NavigateButton>
            <NavigateButton to={MY_WORK_MARK} offset={150}>
              My Jobs
            </NavigateButton>
            <NavigateButton to={CONTACT_US_MARK}>Contact Me</NavigateButton>
          </DesktopMedia>
        </ToolbarStyled>
      </StyledAppBar>
    </Box>
  )
}

export default NavBar
