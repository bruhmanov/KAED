import React from 'react'

import ReactDOM from 'react-dom/client'

import {
  BrowserRouter,
} from 'react-router-dom'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import App from './App'

import './index.css'

import {
  initTelegram,
  applyTelegramTheme,
} from './app/telegram/telegram'

const queryClient =
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,

        refetchOnWindowFocus:
          false,
      },

      mutations: {
        retry: 1,
      },
    },
  })

initTelegram()

applyTelegramTheme()

const rootElement =
  document.getElementById(
    'root'
  )

if (!rootElement) {
  throw new Error(
    'Root element not found'
  )
}

ReactDOM.createRoot(
  rootElement
).render(
  <React.StrictMode>
    <QueryClientProvider
      client={queryClient}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)