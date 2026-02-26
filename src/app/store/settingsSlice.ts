import { createSlice } from '@reduxjs/toolkit';
import type { Language, Theme, PageSize } from '../../shared/config/constants';
import { DEFAULT_LANGUAGE, DEFAULT_PAGE_SIZE, DEFAULT_THEME } from '../../shared/config/constants';

interface SettingsState {
  language: Language;
  theme: Theme;
  pageSize: PageSize;
}

const initialState: SettingsState = {
  language: DEFAULT_LANGUAGE,
  theme: DEFAULT_THEME,
  pageSize: DEFAULT_PAGE_SIZE,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: { payload: Language }) => {
      state.language = action.payload;
    },
    setTheme: (state, action: { payload: Theme }) => {
      state.theme = action.payload;
    },
    setPageSize: (state, action: { payload: PageSize }) => {
      state.pageSize = action.payload;
    },
  },
});

export const { setLanguage, setTheme, setPageSize } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
