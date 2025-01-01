/// <reference types="vite-plugin-svgr/client" />
import { ReactComponent as Logo } from '@/assets/logo.svg'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useContainer } from './Navbar.container'
import { DrawerContainer, LinkStyled, StyledAppBar, ToolbarStyled } from './Navbar.styled'
import { primaryMain } from '@/providers'
import { BANNER_MARK } from '@/constant'
import ScrollNavigateButton from './components/ScrollNavigateButton'
import { DesktopMedia, MobileMedia } from '@/components/customs/Media'
import MenuIcon from '@mui/icons-material/Menu'
import { IconButton, SwipeableDrawer } from '@mui/material'
import NavigateButton from './components/NavigateButton'
import db from '@/db'

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
                David's Portfolio
              </Typography>
            </DesktopMedia>
          </LinkStyled>
          <MobileMedia>
            <IconButton color='inherit' aria-label='open drawer' onClick={toggle} edge='start'>
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer anchor={'right'} open={drawer} onClose={toggle} onOpen={toggle}>
              <DrawerContainer>
                {db.navigations.map(navigator => {
                  if (navigator.to)
                    return (
                      <NavigateButton
                        to={navigator.to}
                        onClick={toggle}
                        mark={navigator.mark}
                        key={navigator.mark}
                        disabled={navigator.disabled}
                      >
                        {navigator.label}
                      </NavigateButton>
                    )
                  return (
                    <ScrollNavigateButton
                      mark={navigator.mark}
                      key={navigator.mark}
                      onClick={toggle}
                      disabled={navigator.disabled}
                    >
                      {navigator.label}
                    </ScrollNavigateButton>
                  )
                })}
              </DrawerContainer>
            </SwipeableDrawer>
          </MobileMedia>
          <DesktopMedia>
            {db.navigations.map(navigator => {
              if (navigator.to)
                return (
                  <NavigateButton
                    to={navigator.to}
                    mark={navigator.mark}
                    key={navigator.mark}
                    disabled={navigator.disabled}
                  >
                    {navigator.label}
                  </NavigateButton>
                )
              return (
                <ScrollNavigateButton mark={navigator.mark} key={navigator.mark} disabled={navigator.disabled}>
                  {navigator.label}
                </ScrollNavigateButton>
              )
            })}
          </DesktopMedia>
        </ToolbarStyled>
      </StyledAppBar>
    </Box>
  )
}

export default NavBar