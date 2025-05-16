
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import i18n config to ensure it initializes
import './i18n/config'
import { BrowserRouter as Router } from 'react-router-dom';

// Create root and render App
createRoot(document.getElementById("root")!).render(
  <Router>
    <App />
  </Router>
);
