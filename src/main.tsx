import { StrictMode } from 'react'
import { ThemeProvider } from '@/providers/Theme'
import App from './App'
import { composeProviders, createProvider } from './utils/providers'
import { createRoot } from 'react-dom/client'
import { I18nProvider } from './lib/I18n.lib'
import en from './locales/en.json'
import es from './locales/es.json'

const Provider = composeProviders([
  StrictMode,
  ThemeProvider,
  createProvider(I18nProvider, { defaultLanguage: 'en', translations: { en, es } })
])

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <Provider>
    <App />
  </Provider>
)
