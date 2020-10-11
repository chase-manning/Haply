import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "./store";

/* TYPES */
interface SettingsState {
  remindersEnabled: boolean;
  randomReminders: boolean;
  frequencyMinutesMin: number;
  frequencyMinutesMax: number;
  nextNotification: Date;
}

const initialState: SettingsState = {
  remindersEnabled: true,
  randomReminders: false,
  frequencyMinutesMin: 7 * 60,
  frequencyMinutesMax: 7 * 60,
  nextNotification: new Date(2050, 1, 1),
};

/* SLICE */
export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleRemindersEnabled: (state) => {
      state.remindersEnabled = !state.remindersEnabled;
    },
    toggleRandomReminders: (state) => {
      state.randomReminders = !state.randomReminders;
    },
    setFrequencyMinutesMin: (state, action: PayloadAction<number>) => {
      state.frequencyMinutesMin = action.payload;
    },
    setFrequencyMinutesMax: (state, action: PayloadAction<number>) => {
      state.frequencyMinutesMax = action.payload;
    },
    updateNextNotification: (state) => {
      let randomNumber: number = Math.random();
      let minutesAdded: number =
        state.frequencyMinutesMin * randomNumber +
        state.frequencyMinutesMax * (1 - randomNumber);

      let now: Date = new Date();
      state.nextNotification = new Date(now.getTime() + minutesAdded * 60000);
    },
  },
});

export const {
  toggleRemindersEnabled,
  toggleRandomReminders,
  setFrequencyMinutesMin,
  setFrequencyMinutesMax,
  updateNextNotification,
} = settingsSlice.actions;

/* SELECTS */
export const selectSettings = (state: RootState) => state.settings;
export const selectRemindersEnabled = (state: RootState) =>
  state.settings.remindersEnabled;
export const selectRandomReminders = (state: RootState) =>
  state.settings.randomReminders;
export const selectFrequencyMinutesMin = (state: RootState) =>
  state.settings.frequencyMinutesMin;
export const selectFrequencyMinutesMax = (state: RootState) =>
  state.settings.frequencyMinutesMax;
export const selectNextNotification = (state: RootState) =>
  state.settings.nextNotification;

export default settingsSlice.reducer;
