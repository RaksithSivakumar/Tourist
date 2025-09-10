import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

interface LocationState {
  current?: Coordinates;
  history: Coordinates[];
  geofences: { id: string; center: Coordinates; radiusMeters: number }[];
}

const initialState: LocationState = {
  history: [],
  geofences: [],
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation(state, action: PayloadAction<Coordinates | undefined>) {
      state.current = action.payload;
      if (action.payload) state.history.push(action.payload);
    },
    addGeofence(
      state,
      action: PayloadAction<{ id: string; center: Coordinates; radiusMeters: number }>
    ) {
      state.geofences.push(action.payload);
    },
    removeGeofence(state, action: PayloadAction<string>) {
      state.geofences = state.geofences.filter((g) => g.id !== action.payload);
    },
    clearHistory(state) {
      state.history = [];
    },
  },
});

export const { setCurrentLocation, addGeofence, removeGeofence, clearHistory } =
  locationSlice.actions;
export default locationSlice.reducer;



