import DownArrow from '@/modules/core/assets/down-arrow.svg'
import { ButtonContainer } from './ButtonContainer'
import Link from 'next/link'

const DownButton = () => (
  <ButtonContainer >
    <Link href={""}>
      <DownArrow width={35} height={35} fill={"#000000"} />
    </Link>
  </ButtonContainer>
)

export default DownButton
