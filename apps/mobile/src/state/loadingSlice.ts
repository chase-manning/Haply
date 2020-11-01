import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

/* TYPES */
interface LoadingState {
  updatingMoods: boolean;
  updatingStats: boolean;
  updatingAchievements: boolean;
}

const initialState: LoadingState = {
  updatingMoods: false,
  updatingStats: false,
  updatingAchievements: false,
};

/* SLICE */
export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    updateData: (state) => {
      state.updatingMoods = true;
      state.updatingStats = true;
      state.updatingAchievements = true;
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
  },
});

export const {
  updateData,
  updateMoods,
  completeMoods,
  updateStats,
  completeStats,
  updateAchievements,
  completeAchievements,
} = loadingSlice.actions;

/* SELECTS */
export const selectMoodsLoading = (state: RootState) =>
  state.loading.updatingMoods;
export const selectStatsLoading = (state: RootState) =>
  state.loading.updatingStats;
export const selectAchievementsLoading = (state: RootState) =>
  state.loading.updatingAchievements;
export const selectDataLoading = (state: RootState) => {
  return state.data.achievements.length === 0 || state.data.stats.length === 0;
};

export const selectLoadingPercent = (state: RootState) => {
  if (state.data.achievements.length === 0 && state.data.stats.length === 0)
    return 0;
  let updates = [
    state.loading.updatingMoods,
    state.loading.updatingStats,
    state.loading.updatingAchievements,
  ];
  return updates.filter((update: boolean) => !update).length / updates.length;
};

export default loadingSlice.reducer;
