import { TypedOptions } from 'typed.js'

type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'button'
  | 'overline'
  | 'inherit'
  | undefined

export type TypedWrapperOptions = { fontSizeCursor?: string }

export type TyperOptions = TypedOptions & {
  variant: Variant
  color: string
} & TypedWrapperOptions
