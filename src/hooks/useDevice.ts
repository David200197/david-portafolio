import { useState, useEffect, useMemo } from 'react'

export type SizesDevice = {
  tablet?: number
  laptop?: number
  desktop?: number
}

const sizes = {
  tablet: 768,
  laptop: 992,
  desktop: 1170
}

const isWindow = typeof window !== 'undefined'

/**
 * @description This hook return the device screen
 * @param breakpoints: you can declare a device screen value: table, laptop and/or desktop.
 * This param is optional, this hook have a default values but you can replace it
 * @default
 * tablet: 768
 * laptop: 992
 * desktop: 1170
 * @returns
 */
const useDevice = (breakpoints: SizesDevice = sizes) => {
  const correctBreakpoints = useMemo(() => ({ ...sizes, ...breakpoints }), [breakpoints])

  const isMOBILE = 'isMOBILE'
  const isTABLET = 'isTABLET'
  const isLAPTOP = 'isLAPTOP'
  const isDESKTOP = 'isDESKTOP'

  const onLoadDevice = () => {
    if (!isWindow) {
      return
    }
    return window.innerWidth < correctBreakpoints.tablet
      ? isMOBILE
      : window.innerWidth < correctBreakpoints.laptop
      ? isTABLET
      : window.innerWidth < correctBreakpoints.desktop
      ? isLAPTOP
      : isDESKTOP
  }

  const [device, setDevice] = useState(onLoadDevice())

  useEffect(() => {
    const onResizeDevice = () => {
      return window.innerWidth < correctBreakpoints.tablet
        ? setDevice(isMOBILE)
        : window.innerWidth < correctBreakpoints.laptop
        ? setDevice(isTABLET)
        : window.innerWidth < correctBreakpoints.desktop
        ? setDevice(isLAPTOP)
        : setDevice(isDESKTOP)
    }
    window.addEventListener('resize', onResizeDevice)
    return () => {
      window.removeEventListener('resize', onResizeDevice)
    }
  }, [correctBreakpoints])

  return {
    isMOBILE: device === isMOBILE,
    isTABLET: device === isTABLET,
    isLAPTOP: device === isLAPTOP,
    isDESKTOP: device === isDESKTOP
  }
}

export default useDevice
