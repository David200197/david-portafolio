import React, { ImgHTMLAttributes, JSX } from 'react'

interface WebPImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'srcSet' | 'sizes'> {
  src: string
  alt: string
  width?: number
  height?: number
}

export default function WebPImage({
  src,
  alt,
  width,
  height,
  ...props
}: WebPImageProps): JSX.Element {
  const base = src.replace(/\.[^/.]+$/, '')

  const availableSizes = [320, 640, 768, 1024, 1280, 1536, 1920] as const

  const srcSet = availableSizes
    .map((size) => `${base}-${size}w.webp ${size}w`)
    .join(', ')

  const sizes = width
    ? availableSizes
        .filter((size) => size <= width)
        .map((size, index, arr) => {
          if (index === arr.length - 1) {
            return `${size}px`
          }
          return `(max-width: ${size}px) ${size}px`
        })
        .join(', ') || `${width}px`
    : '100vw'

  const webpSrc = `${base}.webp`

  return (
    <img
      src={webpSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      {...props}
    />
  )
}
