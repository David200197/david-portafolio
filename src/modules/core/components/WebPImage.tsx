import React, { ImgHTMLAttributes, JSX } from 'react'

interface WebPImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> {
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

  const webpSrc = `${base}.webp`

  return (
    <img
      src={webpSrc}
      srcSet={srcSet}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      {...props}
    />
  )
}
