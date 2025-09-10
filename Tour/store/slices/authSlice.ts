import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'tourist' | 'police' | 'hotel' | 'airport' | null;

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  userId?: string;
  digitalId?: string; // blockchain DID
}

const initialState: AuthState = {
  isAuthenticated: false,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInSuccess(
      state,
      action: PayloadAction<{ userId: string; role: Exclude<UserRole, null>; digitalId?: string }>
    ) {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.digitalId = action.payload.digitalId;
    },
    signOut(state) {
      state.isAuthenticated = false;
      state.userId = undefined;
      state.role = null;
      state.digitalId = undefined;
    },
    setRole(state, action: PayloadAction<Exclude<UserRole, null>>) {
      state.role = action.payload;
    },
  },
});

export const { signInSuccess, signOut, setRole } = authSlice.actions;
export default authSlice.reducer;



