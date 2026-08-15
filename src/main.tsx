import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@material/web/all.js' // Material Web Components
import './index.css'
import App from './App.tsx'
import './types/material.d.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
