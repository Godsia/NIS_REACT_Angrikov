import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '../../../app/api/authApi';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation();
  const [login, { isLoading, error }] = useLoginMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const validate = useCallback(() => {
    const errors: { username?: string; password?: string } = {};
    if (!username.trim()) errors.username = t('auth.errors.required');
    if (!password) errors.password = t('auth.errors.required');
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [username, password, t]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      try {
        await login({ username: username.trim(), password }).unwrap();
        onSuccess?.();
      } catch (err) {
        let message = t('auth.errors.invalidCredentials');
        if (err && typeof err === 'object' && 'data' in err) {
          const data = (err as { data?: { message?: string } }).data;
          if (data && typeof data.message === 'string') message = data.message;
        }
        if (err && typeof err === 'object' && 'status' in err && (err as { status: string }).status === 'FETCH_ERROR') {
          message = t('auth.errors.network');
        }
        setFieldErrors({ password: message });
      }
    },
    [username, password, login, validate, onSuccess, t]
  );

  const apiError =
    error && 'data' in error ? (error.data as { message?: string })?.message : undefined;
  const displayError: string | undefined = fieldErrors.password ?? apiError;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label={t('auth.username')}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={fieldErrors.username}
        autoComplete="username"
        disabled={isLoading}
        autoFocus
      />
      <Input
        label={t('auth.password')}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={displayError}
        autoComplete="current-password"
        disabled={isLoading}
      />
      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? t('common.loading') : t('auth.submit')}
      </Button>
    </form>
  );
}
