import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthInitializer } from './components/AuthInitializer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardPage } from './components/dashboard/dashboardPage';
import { AnalyticsPage } from './pages/analyticsPage/AnalyticsPage';
import { AnalyticsDetailPage } from './pages/analyticsPage/AnalyticsDetailPage';
import { TrainingList } from './pages/trainingListPage/TrainingList';
import { DataEntryPage } from './pages/dataEntryPage/DataEntryPage';
import { LoginPage } from './pages/loginPage/LoginPage';
import { RegisterPage } from './pages/registerPage/RegisterPage';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthInitializer>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics/:date"
                element={
                  <ProtectedRoute>
                    <AnalyticsDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trainingList"
                element={
                  <ProtectedRoute>
                    <TrainingList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/data-entry"
                element={
                  <ProtectedRoute>
                    <DataEntryPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AuthInitializer>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
