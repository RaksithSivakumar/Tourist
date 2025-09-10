import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EmergencyLevel = 1 | 2 | 3 | null;

interface EmergencyState {
  activeLevel: EmergencyLevel;
  lastTriggeredAt?: number;
  isBroadcasting: boolean;
}

const initialState: EmergencyState = {
  activeLevel: null,
  isBroadcasting: false,
};

const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    triggerLevel(state, action: PayloadAction<1 | 2 | 3>) {
      state.activeLevel = action.payload;
      state.lastTriggeredAt = Date.now();
    },
    resetEmergency(state) {
      state.activeLevel = null;
      state.isBroadcasting = false;
    },
    setBroadcasting(state, action: PayloadAction<boolean>) {
      state.isBroadcasting = action.payload;
    },
  },
});

export const { triggerLevel, resetEmergency, setBroadcasting } = emergencySlice.actions;
export default emergencySlice.reducer;



