import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import SnapContextProvider from './context/SnapContext.jsx'

createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
  <SnapContextProvider>
    <App />
    </SnapContextProvider>
  </BrowserRouter>
)
