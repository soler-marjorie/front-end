import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './Router.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>  {/* On place BrowserRouter autour de l'app pour activer le routing */}
        <App />
      </BrowserRouter>
    </StrictMode>,
)
