import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

/* TYPES */
interface LoadingState {
  initialising: boolean;
  updatingMoods: boolean;
  updatingStats: boolean;
  updatingAchievements: boolean;
  updatingDayAverages: boolean;
  updatingDateSearchMoods: boolean;
  updatingSettings: boolean;
}

const initialState: LoadingState = {
  initialising: true,
  updatingMoods: true,
  updatingStats: true,
  updatingAchievements: true,
  updatingDayAverages: true,
  updatingDateSearchMoods: false,
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
    updateMoodDependencies: (state) => {
      state.updatingStats = true;
      state.updatingAchievements = true;
      state.updatingDayAverages = true;
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
    updateDateSearchMoods: (state) => {
      state.updatingDateSearchMoods = true;
    },
    completeDateSearchMoods: (state) => {
      state.updatingDateSearchMoods = false;
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
  updateMoodDependencies,
  updateMoods,
  completeMoods,
  updateStats,
  completeStats,
  updateAchievements,
  completeAchievements,
  updateDayAverages,
  completeDayAverages,
  updateDateSearchMoods,
  completeDateSearchMoods,
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

export const selectLoadingSteps = (state: RootState) => {
  return [
    state.loading.updatingMoods,
    state.loading.updatingStats,
    state.loading.updatingAchievements,
    state.loading.updatingDayAverages,
    state.loading.updatingSettings,
  ];
};

export const selectDateSearchMoodsLoading = (state: RootState) =>
  state.loading.updatingDateSearchMoods;

export default loadingSlice.reducer;
