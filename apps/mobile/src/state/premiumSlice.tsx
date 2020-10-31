import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

/* TYPES */
interface PremiumState {
  isPremium: boolean;
}

const initialState: PremiumState = {
  isPremium: false,
};

/* SLICE */
export const premiumSlice = createSlice({
  name: "premium",
  initialState,
  reducers: {
    setPremium: (state) => {
      state.isPremium = true;
    },
    setFree: (state) => {
      state.isPremium = false;
    },
  },
});

export const { setPremium, setFree } = premiumSlice.actions;

/* SELECTS */
export const selectIsPremium = (state: RootState) => state.premium.isPremium;

export default premiumSlice.reducer;
