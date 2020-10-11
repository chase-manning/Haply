import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "./store";

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
}

const initialState: NavigationState = {
  activeTab: Tab.Profile,
  moodShowing: false,
  loggingIn: false,
};

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
    setActiveTab: (state, action: PayloadAction<Tab>) => {
      state.activeTab = action.payload;
    },
  },
});

export const {
  showMood,
  hideMood,
  showLogin,
  hideLogin,
  setActiveTab,
} = navigationSlice.actions;

export const setActiveTabAsync = (tab: Tab): AppThunk => (dispatch) => {
  setTimeout(() => {
    dispatch(setActiveTab(tab));
  }, 1000);
};

export const selectMoodShowing = (state: RootState) =>
  state.navigation.moodShowing;

export const selectActiveTab = (state: RootState) => state.navigation.activeTab;

export const selectActiveTabText = (state: RootState) => {
  switch (state.navigation.activeTab) {
    case Tab.Profile:
      return "Profile";
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
