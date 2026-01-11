// Default
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Additional
import './index.css';
import NavBar from './components/navbar.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavBar />
  </StrictMode>,
);

