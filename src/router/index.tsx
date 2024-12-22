import { PageWrapper } from '@/components/layout/PageWrapper'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter(
  [
    {
      path: '',
      Component: PageWrapper,
      children: [
        {
          path: '/',
          lazy: async () => {
            const component = await import('@/views/HomePage')
            return { Component: component.default }
          }
        },
        {
          path: '/blog',
          lazy: async () => {
            const component = await import('@/views/BlogPage')
            return { Component: component.default }
          }
        }
      ]
    }
  ],
  { basename: '/david-portafolio/' }
)
