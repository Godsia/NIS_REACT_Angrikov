import type { RootState } from './index';

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
export const selectAuthInitialized = (state: RootState) => state.auth.isInitialized;

export const selectLanguage = (state: RootState) => state.settings.language;
export const selectTheme = (state: RootState) => state.settings.theme;
export const selectPageSize = (state: RootState) => state.settings.pageSize;
