import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register, clearError } from '../../store/authSlice';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import '../loginPage/LoginPage.css';

const MIN_PASSWORD_LENGTH = 3;
const MIN_EMAIL_LENGTH = 3;

export const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validate = (): boolean => {
    let valid = true;

    if (!email.trim()) {
      setEmailError('Введите email');
      valid = false;
    } else if (email.trim().length < MIN_EMAIL_LENGTH) {
      setEmailError(`Email должен быть не менее ${MIN_EMAIL_LENGTH} символов`);
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Введите пароль');
      valid = false;
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Пароль должен быть не менее ${MIN_PASSWORD_LENGTH} символов`);
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    await dispatch(register({ email: email.trim(), password }));
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <Paper elevation={6} className="login-card">
          <Typography variant="h4" component="h1" className="login-title">
            Регистрация
          </Typography>

          <Typography className="login-subtitle">
            Создайте аккаунт для учёта тренировок
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate className="login-form">
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              disabled={isLoading}
              autoComplete="email"
              autoFocus
            />
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              className="login-button"
            >
              {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Зарегистрироваться'}
            </Button>
          </Box>

          <Typography className="login-footer">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="login-link">
              Войти
            </Link>
          </Typography>
        </Paper>
      </div>
    </div>
  );
};
