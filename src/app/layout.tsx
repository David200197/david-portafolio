import { composeProviders } from '@/modules/core/utils/compose-providers'

import './globals.css'

import { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ErrorBoundaryProvider } from '@/modules/core/providers/ErrorBoundaryProvider'
import { DiProvider } from '@/modules/core/contexts/DiContext'
import { Metadatas } from '@/modules/core/components/Metadatas'
import { ToasterClient } from '@/modules/core/components/ToasterClient'

const Provider = composeProviders([ErrorBoundaryProvider, DiProvider])

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'David | Fullstack Developer - Next.js, React & Node.js',
  description:
    'Portfolio de David - Desarrollador Fullstack especializado en Next.js, Nest.jS, React. Diseño y desarrollo de aplicaciones web modernas y escalables.',
  keywords: [
    'fullstack developer',
    'desarrollador fullstack',
    'next.js',
    'nestjs',
    'react',
    'node.js',
    'graphql',
    'typescript',
    'portfolio',
    'web developer',
  ],
  authors: [{ name: 'David' }],
  creator: 'David',
  metadataBase: new URL('https://david200197.github.io'),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_US',
    url: 'https://david200197.github.io/david-portafolio/',
    siteName: 'David | Fullstack Developer Portfolio',
    title: 'David | Fullstack Developer - Next.js, React & Nest.js',
    description:
      'Portfolio de David - Desarrollador Fullstack especializado en Next.js, Nest.js, React. Diseño y desarrollo de aplicaciones web modernas y escalables.',
    images: [
      {
        url: '/david-portafolio/og_image.webp',
        width: 1200,
        height: 630,
        alt: 'David - Fullstack Developer | Portfolio de desarrollo web con Next.js, React y Nest.js',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'David | Fullstack Developer - Next.js, React & Node.js',
    description:
      'Portfolio de David - Desarrollador Fullstack especializado en Next.js, NestJS, React. Aplicaciones web modernas y escalables.',
    images: ['/david-portafolio/og_image.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'X-Content-Type-Options': 'nosniff',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Metadatas />
        <Provider>
          <ToasterClient />
          {children}
        </Provider>
      </body>
    </html>
  )
}
