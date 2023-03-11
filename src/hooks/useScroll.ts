import { useCallback, useEffect, useState } from 'react'

const ON_SCROLL_EVENT_LISTENER = 'scroll'

const useScroll = () => {
  const [scrollValue, setScrollValue] = useState<number>(0)

  const onScroll = useCallback(() => {
    const currentScrollValue = window.scrollY || document.documentElement.scrollTop
    if (currentScrollValue === scrollValue) return
    setScrollValue(currentScrollValue)
  }, [scrollValue])

  useEffect(() => {
    document.addEventListener(ON_SCROLL_EVENT_LISTENER, onScroll)
    return () => document.removeEventListener(ON_SCROLL_EVENT_LISTENER, onScroll)
  }, [onScroll, scrollValue])

  return { scrollValue }
}

export default useScroll
