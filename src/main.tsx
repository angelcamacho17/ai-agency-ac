import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// No StrictMode: anime.js timelines + scroll observers double-fire and leak
// under StrictMode's intentional double-invoked effects. Cleanup is handled
// per-component via createScope().revert() instead.
createRoot(document.getElementById('root')!).render(<App />)
