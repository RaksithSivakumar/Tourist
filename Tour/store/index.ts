import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from './slices/authSlice';
import languageReducer from './slices/languageSlice';
import locationReducer from './slices/locationSlice';
import emergencyReducer from './slices/emergencySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageReducer,
    location: locationReducer,
    emergency: emergencyReducer,
  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;



