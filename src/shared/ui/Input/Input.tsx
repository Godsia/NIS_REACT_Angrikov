import React, { memo } from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = memo(function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`;
  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input id={inputId} className={`${styles.input} ${error ? styles.hasError : ''} ${className}`.trim()} {...props} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
});
