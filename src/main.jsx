import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './global.css'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store'

import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'


const client = new QueryClient

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <App />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </Provider>
    </PersistGate>
  </React.StrictMode>,
)
