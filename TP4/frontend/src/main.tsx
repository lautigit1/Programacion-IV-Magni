import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ParticipantesProvider } from './context/ParticipantesContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ParticipantesProvider>
      <App />
    </ParticipantesProvider>
  </React.StrictMode>
);
