// Default
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Additional
import './index.css';
import App from './app.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

