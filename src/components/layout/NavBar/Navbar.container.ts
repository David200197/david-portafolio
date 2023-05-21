import useScroll from '@/hooks/useScroll'
import { useState } from 'react'

export const useContainer = () => {
  const { scrollValue } = useScroll()
  const [drawer, setDrawer] = useState(false)

  const toggle = () => setDrawer(prev => !prev)

  return { isInitialPosition: scrollValue < 10, toggle, drawer }
}
