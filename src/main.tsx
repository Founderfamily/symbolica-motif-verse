
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import i18n config to ensure it initializes
import './i18n/config'

console.log('🚀 main.tsx: Starting application initialization');

try {
  console.log('🔍 main.tsx: Looking for root element');
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('❌ main.tsx: Root element not found!');
    throw new Error('Root element with id "root" not found');
  }
  
  console.log('✅ main.tsx: Root element found, creating React root');
  const root = createRoot(rootElement);
  
  console.log('🎨 main.tsx: Rendering App component');
  root.render(<App />);
  
  console.log('✅ main.tsx: App rendered successfully');
} catch (error) {
  console.error('❌ main.tsx: Critical error during initialization:', error);
  
  // Fallback error display
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fef2f2; font-family: system-ui, -apple-system, sans-serif;">
        <div style="text-align: center; padding: 2rem; background: white; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #dc2626; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Critical Application Error</h1>
          <p style="color: #374151; margin-bottom: 1rem;">The application failed to initialize.</p>
          <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.25rem; text-align: left; overflow: auto; font-size: 0.75rem;">${error instanceof Error ? error.message : String(error)}</pre>
        </div>
      </div>
    `;
  }
}
