'use client'

import { getImagePath } from '@/modules/core/utils/get-img-path'
import { useSidebar } from '../context/sidebar-context'

export const TriggerSidebarButton = () => {
  const { toggle } = useSidebar()

  return (
    <button
      aria-label={'open-menu'}
      onClick={toggle}
      className="w-[30px] h-[30px] fixed left-[20px] bottom-[20px] rounded-lg shadow-lg bg-white p-1 cursor-pointer"
    >
      <img src={getImagePath('menu.svg')} alt="menu" />
    </button>
  )
}
