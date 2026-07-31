import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Business from './business'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Business user={null} />
  </StrictMode>,
)
