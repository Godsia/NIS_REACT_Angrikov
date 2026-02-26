import React, { useEffect } from 'react';
import { useLazyGetMeQuery } from '../api/authApi';
import { useAppSelector, useAppDispatch } from '../../shared/lib/redux';
import { selectAuthToken, selectAuthInitialized } from '../store/selectors';
import { setInitialized, logout } from '../store/authSlice';

export function AuthInit({ children }: { children: React.ReactNode }) {
  const token = useAppSelector(selectAuthToken);
  const isInitialized = useAppSelector(selectAuthInitialized);
  const dispatch = useAppDispatch();
  const [getMe] = useLazyGetMeQuery();

  useEffect(() => {
    if (isInitialized) return;

    if (!token) {
      dispatch(setInitialized(true));
      return;
    }

    getMe()
      .unwrap()
      .then(() => {
        dispatch(setInitialized(true));
      })
      .catch(() => {
        dispatch(logout());
        dispatch(setInitialized(true));
      });
  }, [token, isInitialized, dispatch, getMe]);

  return <>{children}</>;
}
