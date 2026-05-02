import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './context/AppContext'
import { TourProvider } from './components/TourProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <TourProvider>
        <App />
      </TourProvider>
    </AppProvider>
  </StrictMode>,
)
