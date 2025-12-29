'use client'

import { getImagePath } from '@/modules/core/utils/get-img-path'
import { useSidebar } from '../context/sidebar-context'
import Image from 'next/image'

export const TriggerSidebarButton = () => {
  const { toggle } = useSidebar()

  return (
    <button
      aria-label={'open-menu'}
      onClick={toggle}
      className="w-[30px] h-[30px] fixed left-[20px] bottom-[20px] rounded-lg shadow-lg bg-white p-1 cursor-pointer"
    >
      <Image src={getImagePath('menu.svg')} alt="menu" width={30} height={30} />
    </button>
  )
}
