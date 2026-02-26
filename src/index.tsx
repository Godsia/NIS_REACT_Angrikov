import React from 'react';
import ReactDOM from 'react-dom/client';
import { initI18n } from './shared/lib/i18n';
import { DEFAULT_LANGUAGE } from './shared/config/constants';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

initI18n(DEFAULT_LANGUAGE);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
