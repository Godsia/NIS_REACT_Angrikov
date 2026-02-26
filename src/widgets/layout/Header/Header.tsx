import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../shared/lib/redux';
import { selectAuthUser } from '../../../app/store/selectors';
import styles from './Header.module.css';

export function Header() {
  const user = useAppSelector(selectAuthUser);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        E-commerce Admin
      </Link>
      {user && (
        <span className={styles.user}>
          {user.firstName} {user.lastName}
        </span>
      )}
    </header>
  );
}
