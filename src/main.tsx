import { StrictMode } from 'react'
import ReactDOM from 'react-dom'

import '@/locales/i18n'
import { ThemeProvider } from '@/providers/Theme'
import App from './App'
import { composeProviders } from './utils/providers'

const Provider = composeProviders([StrictMode, ThemeProvider])

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
)
