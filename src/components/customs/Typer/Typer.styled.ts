import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import { TypedWrapperOptions } from './Typer.interface'
import isPropValid from '@emotion/is-prop-valid'

export const TypedWrapper = styled(Box, { shouldForwardProp: isPropValid })<TypedWrapperOptions>(
  ({ fontSizeCursor }) => ({
    display: 'flex',
    alignItems: 'flex-end',
    '& .typed-cursor': {
      fontSize: fontSizeCursor,
      marginBottom: `calc(${fontSizeCursor} * -0.05)`
    }
  })
)
