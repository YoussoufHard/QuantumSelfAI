import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry
Sentry.init({
  dsn: 'https://ab14fcb00b82045a465dfc7c9c3b2d49@o4509454922088448.ingest.de.sentry.io/4509527930044496',
  environment: import.meta.env.MODE,
  integrations: [new BrowserTracing()], // Use "new" for BrowserTracing
  tracesSampleRate: 0.2, // Reduced to 20% to avoid quota issues; adjust as needed
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);