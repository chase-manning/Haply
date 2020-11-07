import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

/* TYPES */
interface LoadingState {
  initialising: boolean;
  updatingMoods: boolean;
  updatingStats: boolean;
  updatingAchievements: boolean;
  updatingDayAverages: boolean;
  updatingSettings: boolean;
}

const initialState: LoadingState = {
  initialising: true,
  updatingMoods: true,
  updatingStats: true,
  updatingAchievements: true,
  updatingDayAverages: true,
  updatingSettings: true,
};

/* SLICE */
export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    updateAll: (state) => {
      state.updatingMoods = true;
      state.updatingStats = true;
      state.updatingAchievements = true;
      state.updatingDayAverages = true;
      state.updatingSettings = true;
    },
    completeInitialisation: (state) => {
      state.initialising = false;
    },
    updateMoods: (state) => {
      state.updatingMoods = true;
    },
    completeMoods: (state) => {
      state.updatingMoods = false;
    },
    updateStats: (state) => {
      state.updatingStats = true;
    },
    completeStats: (state) => {
      state.updatingStats = false;
    },
    updateAchievements: (state) => {
      state.updatingAchievements = true;
    },
    completeAchievements: (state) => {
      state.updatingAchievements = false;
    },
    updateDayAverages: (state) => {
      state.updatingDayAverages = true;
    },
    completeDayAverages: (state) => {
      state.updatingDayAverages = false;
    },
    updateSettings: (state) => {
      state.updatingSettings = true;
    },
    completeSettings: (state) => {
      state.updatingSettings = false;
    },
  },
});

export const {
  updateAll,
  completeInitialisation,
  updateMoods,
  completeMoods,
  updateStats,
  completeStats,
  updateAchievements,
  completeAchievements,
  updateDayAverages,
  completeDayAverages,
  updateSettings,
  completeSettings,
} = loadingSlice.actions;

/* SELECTS */
export const selectMoodsLoading = (state: RootState) =>
  state.loading.updatingMoods;
export const selectStatsLoading = (state: RootState) =>
  state.loading.updatingStats;
export const selectAchievementsLoading = (state: RootState) =>
  state.loading.updatingAchievements;
export const selectDayAveragesLoading = (state: RootState) =>
  state.loading.updatingDayAverages;
export const selectSettingsLoading = (state: RootState) =>
  state.loading.updatingSettings;
export const selectDataLoading = (state: RootState) => {
  return state.loading.initialising;
};

export const selectLoadingPercent = (state: RootState) => {
  let updates = [
    state.loading.updatingMoods,
    state.loading.updatingStats,
    state.loading.updatingAchievements,
    state.loading.updatingDayAverages,
    state.loading.updatingSettings,
  ];
  return updates.filter((update: boolean) => !update).length / updates.length;
};

export default loadingSlice.reducer;
