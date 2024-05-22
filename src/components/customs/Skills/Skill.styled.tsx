import { styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'

export const CustomTooltip = styled(({ className, left, ...props }: TooltipProps & { left?: string }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ left }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    left
  }
}))
