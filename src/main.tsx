import { StrictMode } from 'react'
import { ThemeProvider } from '@/providers/Theme'
import App from './App'
import { composeProviders } from './utils/providers'
import { createRoot } from 'react-dom/client'

import './locales/i18n'

const Provider = composeProviders([StrictMode, ThemeProvider])

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <Provider>
    <App />
  </Provider>
)
