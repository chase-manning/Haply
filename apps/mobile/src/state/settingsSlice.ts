import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

/* TYPES */
export enum Mode {
  Default,
  Dark,
  Light,
}

export interface SettingsState {
  remindersEnabled: boolean;
  randomReminders: boolean;
  frequencyMinutesMin: number;
  frequencyMinutesMax: number;
  nextNotification: Date;
  tagOptions: string[];
  colorPrimary: string;
  mode: Mode;
}

const initialState: SettingsState = {
  remindersEnabled: true,
  randomReminders: false,
  frequencyMinutesMin: 7 * 60,
  frequencyMinutesMax: 7 * 60,
  nextNotification: new Date(2050, 1, 1),
  tagOptions: [
    "With Friends",
    "With Family",
    "Tired",
    "Well Rested",
    "In Pain",
    "Sick",
    "Working",
    "At Home",
    "On Holiday",
    "Eating Well",
    "Eating Poorly",
    "Exercising",
  ],
  colorPrimary: "#4071fe",
  mode: Mode.Default,
};

/* SLICE */
export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<SettingsState>) => {
      state.remindersEnabled = action.payload.remindersEnabled;
      state.randomReminders = action.payload.randomReminders;
      state.frequencyMinutesMin = action.payload.frequencyMinutesMin;
      state.frequencyMinutesMax = action.payload.frequencyMinutesMax;
      state.nextNotification = action.payload.nextNotification;
      state.tagOptions = action.payload.tagOptions;
      state.colorPrimary = action.payload.colorPrimary;
      state.mode = action.payload.mode;
    },
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
    setTagOptions: (state, action: PayloadAction<string[]>) => {
      state.tagOptions = action.payload;
    },
    addTagOption: (state, action: PayloadAction<string>) => {
      state.tagOptions.push(action.payload);
    },
    removeTagOption: (state, action: PayloadAction<string>) => {
      const index = state.tagOptions.indexOf(action.payload);
      if (index > -1) state.tagOptions.splice(index, 1);
    },
    setColorPrimary: (state, action: PayloadAction<string>) => {
      state.colorPrimary = action.payload;
    },
    toggleMode: (state) => {
      if (state.mode === Mode.Dark) state.mode = Mode.Light;
      else state.mode = Mode.Dark;
    },
  },
});

export const {
  toggleRemindersEnabled,
  toggleRandomReminders,
  setFrequencyMinutesMin,
  setFrequencyMinutesMax,
  updateNextNotification,
  setSettings,
  setTagOptions,
  addTagOption,
  removeTagOption,
  setColorPrimary,
  toggleMode,
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
export const selectTagOptions = (state: RootState) => state.settings.tagOptions;
export const selectColorPrimary = (state: RootState) =>
  state.settings.colorPrimary;
export const selectMode = (state: RootState) => state.settings.mode;

export default settingsSlice.reducer;
