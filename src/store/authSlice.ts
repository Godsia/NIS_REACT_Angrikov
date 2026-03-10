import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  authApi,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  getAccessToken,
  saveUserToStorage,
  getUserFromStorage,
  clearUserFromStorage,
} from '../services/authApi';

const ACCESS_TOKEN_KEY = 'accessToken';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem(ACCESS_TOKEN_KEY, response.token);
      const user: AuthUser = { id: response.userId, email: response.email };
      saveUserToStorage(user);
      return { user };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка входа'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.register(credentials);
      localStorage.setItem(ACCESS_TOKEN_KEY, response.token);
      const user: AuthUser = { id: response.userId, email: response.email };
      saveUserToStorage(user);
      return { user };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка регистрации'
      );
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  clearUserFromStorage();
});

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: getAccessToken(),
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    restoreUserFromStorage: (state) => {
      const user = getUserFromStorage();
      if (user && getAccessToken()) {
        state.user = user;
        state.isAuthenticated = true;
      }
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = getAccessToken();
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = getAccessToken();
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError, setInitialized, restoreUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
