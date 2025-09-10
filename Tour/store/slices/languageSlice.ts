import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'bn'
  | 'te'
  | 'ta'
  | 'gu'
  | 'mr'
  | 'kn'
  | 'ml'
  | 'or'
  | 'as';

interface LanguageState {
  language: SupportedLanguage;
}

const initialState: LanguageState = {
  language: 'en',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<SupportedLanguage>) {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;



