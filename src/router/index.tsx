import HomePage from '@/views'
import { createBrowserRouter } from 'react-router-dom'
import Navbar from '@/components/layout/NavBar/Navbar'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <>
          <Navbar />
          <HomePage />
        </>
      )
    }
  ],
  { basename: '/david-portafolio/' }
)
