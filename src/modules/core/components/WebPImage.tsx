import Image from 'next/image'
import React, { ImgHTMLAttributes, JSX } from 'react'

interface WebPImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'srcSet' | 'sizes' | 'width' | 'height'
  > {
  src: string
  alt: string
  width?: number
  height?: number
  containerClassName?: string
}

export default function WebPImage({
  src,
  alt,
  width,
  height,
  containerClassName,
  className = '',
  ...props
}: WebPImageProps): JSX.Element {
  const base = src.replace(/\.[^/.]+$/, '')
  const webpSrc = `${base}.webp`

  if (containerClassName) {
    return (
      <div className={`relative ${containerClassName}`}>
        <Image
          src={webpSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover ${className}`}
          loading="lazy"
          decoding="async"
          {...props}
        />
      </div>
    )
  }

  return (
    <Image
      src={webpSrc}
      alt={alt}
      width={width}
      height={height}
      style={{ width: '100%', height: 'auto' }}
      className={className}
      loading="lazy"
      decoding="async"
      {...props}
    />
  )
}
