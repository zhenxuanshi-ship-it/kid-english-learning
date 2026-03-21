import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { ErrorBoundary } from './app/ErrorBoundary';
import { logRuntimeBoot } from './lib/runtime';
import { initTelemetry, trackEvent } from './lib/telemetry';
import './styles/globals.css';

logRuntimeBoot();
initTelemetry();
trackEvent('app_boot');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
