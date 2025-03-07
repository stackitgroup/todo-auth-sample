import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import './index.css'
import './app/i18n.ts'

const isDev = import.meta.env.DEV

if (isDev) {
  import('bootstrap/dist/css/bootstrap.min.css')
  import('bootstrap/dist/js/bootstrap.min.js')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
