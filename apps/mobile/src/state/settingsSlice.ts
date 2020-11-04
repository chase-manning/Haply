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
  nextNotification: string;
  tagOptions: string[];
  colorPrimary: string;
  colorSecondary: string;
  mode: Mode;
  timezone: string;
}

const initialState: SettingsState = {
  remindersEnabled: true,
  randomReminders: false,
  frequencyMinutesMin: 7 * 60,
  frequencyMinutesMax: 7 * 60,
  nextNotification: new Date(2040, 1, 1).toString(),
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
  colorSecondary: "#ff6584",
  mode: Mode.Default,
  timezone: "Asia/Shanghai",
};

/* SLICE */
export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<SettingsState>) => {
      if (action.payload.remindersEnabled)
        state.remindersEnabled = action.payload.remindersEnabled;
      if (action.payload.randomReminders)
        state.randomReminders = action.payload.randomReminders;
      if (action.payload.frequencyMinutesMin)
        state.frequencyMinutesMin = action.payload.frequencyMinutesMin;
      if (action.payload.frequencyMinutesMax)
        state.frequencyMinutesMax = action.payload.frequencyMinutesMax;
      if (action.payload.nextNotification)
        state.nextNotification = action.payload.nextNotification;
      if (action.payload.tagOptions)
        state.tagOptions = action.payload.tagOptions;
      if (action.payload.colorPrimary)
        state.colorPrimary = action.payload.colorPrimary;
      if (action.payload.mode) state.mode = action.payload.mode;
      if (action.payload.timezone) state.timezone = action.payload.timezone;
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
      state.nextNotification = new Date(
        now.getTime() + minutesAdded * 60000
      ).toString();
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
    setColorSecondary: (state, action: PayloadAction<string>) => {
      state.colorSecondary = action.payload;
    },
    toggleMode: (state) => {
      if (state.mode === Mode.Dark) state.mode = Mode.Light;
      else state.mode = Mode.Dark;
    },
    setTimezone: (state) => {
      let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone && timezone.length > 1) state.timezone = timezone;
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
  setColorSecondary,
  toggleMode,
  setTimezone,
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
export const selectColorSecondary = (state: RootState) =>
  state.settings.colorSecondary;
export const selectMode = (state: RootState) => state.settings.mode;
export const selectBlockTags = (state: RootState) =>
  !state.premium.isPremium && state.settings.tagOptions.length >= 15;

export default settingsSlice.reducer;
