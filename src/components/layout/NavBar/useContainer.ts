import useScroll from '@/hooks/useScroll'

export const useContainer = () => {
  const { scrollValue } = useScroll()
  return { isInitialPosition: scrollValue < 10 }
}
