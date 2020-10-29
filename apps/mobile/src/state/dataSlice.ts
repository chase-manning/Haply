import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AchievementModel from "../models/AchievementModel";
import Mood from "../models/mood";
import { StatModel } from "../models/StatModel";
import { RootState } from "./store";
import dateFormat from "dateformat";

/* TYPES */
interface DataState {
  moods: Mood[];
  stats: StatModel[];
  achievements: AchievementModel[];
  updatingMoods: boolean;
  updatingStats: boolean;
  updatingAchievements: boolean;
}

const initialState: DataState = {
  moods: [],
  stats: [],
  achievements: [],
  updatingMoods: false,
  updatingStats: false,
  updatingAchievements: false,
};

/* SLICE */
export const dataSlice = createSlice({
  name: "data",
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
    setAchievementAsOld: (state, action: PayloadAction<number>) => {
      state.achievements[action.payload].isNew = false;
    },
    setStatAsOld: (state, action: PayloadAction<number>) => {
      state.stats[action.payload].isNew = false;
    },
    setMoods: (state, action: PayloadAction<Mood[]>) => {
      state.moods = action.payload;
    },
    setStats: (state, action: PayloadAction<StatModel[]>) => {
      state.stats = action.payload;
    },
    setAchievements: (state, action: PayloadAction<AchievementModel[]>) => {
      state.achievements = action.payload;
    },
    addMood: (state, action: PayloadAction<Mood>) => {
      state.moods.unshift(action.payload);
    },
    removeMood: (state, action: PayloadAction<Mood>) => {
      const index = state.moods.indexOf(action.payload);
      if (index > -1) state.moods.splice(index, 1);
    },
  },
});

export const {
  setMoods,
  setStats,
  setAchievements,
  addMood,
  removeMood,
  updateData,
  updateMoods,
  completeMoods,
  updateStats,
  completeStats,
  updateAchievements,
  completeAchievements,
  setAchievementAsOld,
  setStatAsOld,
} = dataSlice.actions;

/* SELECTS */
export const selectMoods = (state: RootState) => state.data.moods;
export const selectStats = (state: RootState) => state.data.stats;
export const selectAchievements = (state: RootState) => state.data.achievements;
export const selectDarkModeUnlocked = (state: RootState) =>
  state.data.achievements.some(
    (achievement: AchievementModel) =>
      achievement.unlocks.indexOf("Dark Mode") >= 0 &&
      achievement.percentComplete === 1
  );
export const selectMoodsLoading = (state: RootState) =>
  state.data.updatingMoods;
export const selectStatsLoading = (state: RootState) =>
  state.data.updatingStats;
export const selectAchievementsLoading = (state: RootState) =>
  state.data.updatingAchievements;
export const selectDataLoading = (state: RootState) => {
  return state.data.achievements.length === 0 || state.data.stats.length === 0;
};

export const selectLoadingPercent = (state: RootState) => {
  if (state.data.achievements.length === 0 && state.data.stats.length === 0)
    return 0;
  let updates = [
    state.data.updatingMoods,
    state.data.updatingStats,
    state.data.updatingAchievements,
  ];
  return updates.filter((update: boolean) => !update).length / updates.length;
};
export const selectBlockMoods = (state: RootState) => {
  const today = dateFormat(new Date(), "d/m/yyyy");
  const moodsToday = state.data.moods
    .slice(0, 10)
    .filter((mood: Mood) => dateFormat(mood.date, "d/m/yyyy") === today);
  return moodsToday.length >= 5;
};

export default dataSlice.reducer;
