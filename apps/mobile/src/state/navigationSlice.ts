import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

/* TYPES */
export enum Tab {
  Profile,
  Entries,
  Stats,
  Settings,
}

export enum EntriesTab {
  Recent,
  Calander,
}

interface NavigationState {
  activeTab: Tab;
  moodShowing: boolean;
  loggingIn: boolean;
  premium: boolean;
  error: string;
  isAndroid: boolean;
  showWelcome: boolean;
  entriesTab: EntriesTab;
}

const initialState: NavigationState = {
  activeTab: Tab.Profile,
  moodShowing: false,
  loggingIn: false,
  premium: false,
  error: "",
  isAndroid: false,
  showWelcome: false,
  entriesTab: EntriesTab.Recent,
};

/* SLICE */
export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    showMood: (state) => {
      state.moodShowing = true;
    },
    hideMood: (state) => {
      state.moodShowing = false;
    },
    showLogin: (state) => {
      state.loggingIn = true;
    },
    hideLogin: (state) => {
      state.loggingIn = false;
    },
    showPremium: (state) => {
      state.premium = true;
    },
    hidePremium: (state) => {
      state.premium = false;
    },
    setActiveTab: (state, action: PayloadAction<Tab>) => {
      state.activeTab = action.payload;
    },
    showError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    hideError: (state) => {
      state.error = "";
    },
    setIsAndroid: (state, action: PayloadAction<boolean>) => {
      state.isAndroid = action.payload;
    },
    showWelcome: (state) => {
      state.showWelcome = true;
    },
    hideWelcome: (state) => {
      state.showWelcome = false;
    },
    setEntriesTab: (state, action: PayloadAction<EntriesTab>) => {
      state.entriesTab = action.payload;
    },
  },
});

export const {
  showMood,
  hideMood,
  showLogin,
  hideLogin,
  showPremium,
  hidePremium,
  setActiveTab,
  showError,
  hideError,
  setIsAndroid,
  showWelcome,
  hideWelcome,
  setEntriesTab,
} = navigationSlice.actions;

/* SELECTS */
export const selectMoodShowing = (state: RootState) =>
  state.navigation.moodShowing || state.data.moods.length === 0;
export const selectLoggingIn = (state: RootState) => state.navigation.loggingIn;

export const selectActiveTab = (state: RootState) => state.navigation.activeTab;
export const selectPremium = (state: RootState) => state.navigation.premium;

export const selectActiveTabText = (state: RootState) => {
  switch (state.navigation.activeTab) {
    case Tab.Profile:
      return "Achievements";
    case Tab.Entries:
      return "Moods";
    case Tab.Stats:
      return "Analytics";
    case Tab.Settings:
      return "More";
    default:
      return "Error";
  }
};

export const selectEntriesTab = (state: RootState) =>
  state.navigation.entriesTab;

export const selectError = (state: RootState) => state.navigation.error;
export const selectIsAndroid = (state: RootState) => state.navigation.isAndroid;
export const selectShowWelcome = (state: RootState) =>
  state.navigation.showWelcome;
export default navigationSlice.reducer;
