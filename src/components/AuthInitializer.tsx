import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { restoreUserFromStorage, setInitialized } from '../store/authSlice';
import { getAccessToken } from '../services/authApi';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (getAccessToken() && !isInitialized) {
      dispatch(restoreUserFromStorage());
    } else if (!getAccessToken()) {
      dispatch(setInitialized());
    }
  }, [dispatch, isInitialized]);

  return <>{children}</>;
};
