import { StrictMode } from 'react'
import ReactDOM from 'react-dom'

import { ThemeProvider } from '@/providers/Theme'
import App from './App'
import { composeProviders } from './utils/providers'

import './locales/i18n'

const Provider = composeProviders([StrictMode, ThemeProvider])

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
)
