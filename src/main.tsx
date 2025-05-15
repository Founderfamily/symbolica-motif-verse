
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import i18n config to ensure it initializes
import './i18n/config'

// Create root and render App
createRoot(document.getElementById("root")!).render(<App />);
