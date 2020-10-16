import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

/* TYPES */
export enum Tab {
  Profile,
  Entries,
  Stats,
  Settings,
}

interface NavigationState {
  activeTab: Tab;
  moodShowing: boolean;
  loggingIn: boolean;
  AppInit: boolean;
}

const initialState: NavigationState = {
  activeTab: Tab.Profile,
  moodShowing: false,
  loggingIn: false,
  AppInit: false,
};

/* SLICE */
export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    initApp: (state) => {
      state.AppInit = true;
    },
    completeAppInit: (state) => {
      state.AppInit = false;
    },
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
    setActiveTab: (state, action: PayloadAction<Tab>) => {
      state.activeTab = action.payload;
    },
  },
});

export const {
  initApp,
  completeAppInit,
  showMood,
  hideMood,
  showLogin,
  hideLogin,
  setActiveTab,
} = navigationSlice.actions;

/* SELECTS */
export const selectAppInit = (state: RootState) => state.navigation.AppInit;
export const selectMoodShowing = (state: RootState) =>
  state.navigation.moodShowing;
export const selectLoggingIn = (state: RootState) => state.navigation.loggingIn;

export const selectActiveTab = (state: RootState) => state.navigation.activeTab;

export const selectActiveTabText = (state: RootState) => {
  switch (state.navigation.activeTab) {
    case Tab.Profile:
      return "Achievements";
    case Tab.Entries:
      return "Entries";
    case Tab.Stats:
      return "Analytics";
    case Tab.Settings:
      return "Settings";
    default:
      return "Error";
  }
};

export default navigationSlice.reducer;
