import { cn } from '@/modules/core/lib/utils'
import moduleCss from './AstronautAvatar.module.css'
import { getImagePath } from '@/modules/core/utils/get-img-path'

type Props = { className?: string }

export const AstronautAvatar = ({ className }: Props) => (
  <img
    src={getImagePath('astronaut_developer.svg')}
    className={cn(moduleCss.astronaut_avatar, className)}
  />
)
