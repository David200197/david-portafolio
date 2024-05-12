import { FunctionComponent } from 'react'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { SvgIconTypeMap } from '@mui/material'

export type Icon = FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined
  }
>

export type IconMui = OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
  muiName: string
}
