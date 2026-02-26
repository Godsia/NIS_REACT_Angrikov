import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../../entities/user/model/types';
import { authApi } from '../api/authApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setCredentials: (state, action: { payload: { user: User; token: string } }) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setInitialized: (state, action: { payload: boolean }) => {
      state.isInitialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      const { accessToken, refreshToken: _refresh, ...user } = action.payload;
      state.user = user;
      state.token = accessToken;
    });
    builder.addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logout, setCredentials, setInitialized } = authSlice.actions;
export const authReducer = authSlice.reducer;
