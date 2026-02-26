import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../shared/lib/redux';
import { selectAuthUser } from '../../app/store/selectors';
import { useAppDispatch } from '../../shared/lib/redux';
import { logout } from '../../app/store/authSlice';
import { Button } from '../../shared/ui/Button';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const { t } = useTranslation();
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('profile.title')}</h1>
      <div className={styles.card}>
        {user.image && <img src={user.image} alt="" className={styles.avatar} />}
        <dl className={styles.list}>
          <dt>{t('profile.name')}</dt>
          <dd>{fullName}</dd>
          <dt>{t('profile.username')}</dt>
          <dd>{user.username}</dd>
          <dt>{t('profile.email')}</dt>
          <dd>{user.email}</dd>
        </dl>
        <Button variant="secondary" onClick={handleLogout}>
          {t('common.logout')}
        </Button>
      </div>
    </div>
  );
}
