import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';

import { Button } from '@mui/material';

import BarChartIcon from '@mui/icons-material/BarChart';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EditNoteIcon from '@mui/icons-material/EditNote';

import './dashboardPage.css';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
      <div className="dashboard">

        <header className="dashboard-header">

          <div className="dashboard-header-top">

            <div className="dashboard-title-block">
              <h1 className="dashboard-title">Тренировки</h1>
              <p className="dashboard-subtitle">
                Управление и анализ ваших тренировок
              </p>
            </div>

            {user && (
                <div className="dashboard-user">
                  <span className="dashboard-user-name">{user.email}</span>

                  <Button
                      variant="outlined"
                      size="small"
                      onClick={handleLogout}
                  >
                    Выйти
                  </Button>
                </div>
            )}

          </div>

          <div className="dashboard-actions">
            <Link to="/data-entry">
              <Button
                  variant="contained"
                  size="large"
              >
                Добавить тренировку
              </Button>
            </Link>
          </div>

        </header>

        <main className="dashboard-cards">

          <Link to="/analytics" className="dashboard-card dashboard-card--analytics">
            <div className="dashboard-card-icon">
              <BarChartIcon fontSize="large" />
            </div>

            <h2 className="dashboard-card-title">
              Аналитика
            </h2>

            <p className="dashboard-card-desc">
              Просмотр статистики и отчётов по тренировкам
            </p>
          </Link>

          <Link to="/trainingList" className="dashboard-card dashboard-card--workouts">
            <div className="dashboard-card-icon">
              <FitnessCenterIcon fontSize="large" />
            </div>

            <h2 className="dashboard-card-title">
              Ваши тренировки
            </h2>

            <p className="dashboard-card-desc">
              История всех ваших тренировок
            </p>
          </Link>

          <Link to="/data-entry" className="dashboard-card dashboard-card--add">
            <div className="dashboard-card-icon">
              <EditNoteIcon fontSize="large" />
            </div>

            <h2 className="dashboard-card-title">
              Ввод данных
            </h2>

            <p className="dashboard-card-desc">
              Добавление новой тренировки
            </p>
          </Link>

        </main>

      </div>
  );
};