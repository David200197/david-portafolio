import Typography from '@mui/material/Typography'
import { useEffect, useRef } from 'react'
import Typed from 'typed.js'
import { TyperOptions } from './Typer.interface'
import { TypedWrapper } from './Typer.styled'

const Typer = ({ variant, fontSizeCursor = '5px', color, ...typedOptions }: TyperOptions) => {
  const el = useRef(null)

  useEffect(() => {
    if (!el.current) return
    const typed = new Typed(el.current as Element, typedOptions)

    return () => {
      typed.destroy()
    }
  }, [typedOptions])

  return (
    <TypedWrapper fontSizeCursor={fontSizeCursor}>
      <Typography ref={el} variant={variant} fontFamily='sans-serif' color={color} />
    </TypedWrapper>
  )
}
export default Typer
