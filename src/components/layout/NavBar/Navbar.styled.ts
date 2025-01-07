import MuiAppBar from '@mui/material/AppBar'
import { Box, styled } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import isPropValid from '@emotion/is-prop-valid'
import { Link } from 'react-scroll'

export const StyledAppBar = styled(MuiAppBar, { shouldForwardProp: isPropValid })<{
  isInitialPosition: boolean
}>(({ theme, isInitialPosition }) => ({
  backgroundColor: isInitialPosition ? 'transparent' : 'white',
  color: theme.palette.primary.main,
  padding: `${isInitialPosition ? theme.spacing(1) : 0} 14px`,
  [theme.breakpoints.only('lg')]: {
    padding: `${isInitialPosition ? theme.spacing(2) : 0} 10%`
  },
  [theme.breakpoints.up('xl')]: {
    padding: `${isInitialPosition ? theme.spacing(2) : 0} 13%`
  },
  boxShadow: isInitialPosition
    ? 'none'
    : `0px 2px 4px -1px rgba(black,0.1),0px 4px 5px 0px rgba(black ,0.2),0px 1px 10px 0px rgba(black,0.3) !important`,
  transition: 'all 0.5s ease-out'
}))

export const ToolbarStyled = styled(Toolbar)({
  alignItems: 'center',
  justifyContent: 'space-between'
})

export const LinkStyled = styled(Link)({
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer'
})

export const DrawerContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '10px',
  alignItems: 'start',
  textAlign: 'start'
})
