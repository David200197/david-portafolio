import { FC, useMemo } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'

export const ThemeProvider: FC = ({ children }) => {
  const muiTheme = useMemo(() => createThemeHelper(), [])

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}

export const primaryMain = '#202033'
const createThemeHelper = () => {
  return createTheme({
    palette: {
      background: {
        default: '#f0f0f0',
        paper: '#ffffff'
      },
      primary: {
        main: primaryMain
      },
      error: {
        main: 'rgb(232, 51, 51)'
      },
      success: {
        main: 'rgb(76,175,80)'
      }
    }
  })
}
