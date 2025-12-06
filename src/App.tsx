import React from 'react';
import { EventProvider } from './context/EventContext';
import { Dashboard } from './pages/Dashboard';
import './styles/global.scss';

function App() {
  return (
    <EventProvider>
      <Dashboard />
    </EventProvider>
  );
}

export default App;
