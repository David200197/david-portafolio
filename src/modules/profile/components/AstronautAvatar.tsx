import { cn } from '@/modules/core/lib/utils'
import moduleCss from './AstronautAvatar.module.css'
import { getImagePath } from '@/modules/core/utils/get-img-path'
import Image from 'next/image'

type Props = { className?: string }

export const AstronautAvatar = ({ className }: Props) => (
  <Image
    src={getImagePath('astronaut_developer.svg')}
    className={cn(moduleCss.astronaut_avatar, className)}
    alt="Astronaut Developer"
    width={45}
    height={45}
  />
)
