import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store';
import { AppRouter } from './app/router';
import { AuthInit, ThemeAndLanguageSync } from './app/init';
import { ErrorBoundary } from './shared/ui/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeAndLanguageSync>
            <AuthInit>
              <AppRouter />
            </AuthInit>
          </ThemeAndLanguageSync>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
