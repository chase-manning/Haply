import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AchievementModel from "../models/AchievementModel";
import Mood from "../models/mood";
import { StatModel } from "../models/StatModel";
import { RootState } from "./store";
import dateFormat from "dateformat";

/* TYPES */
export interface DayAverage {
  date: Date;
  average: number;
}

interface DataState {
  moods: Mood[];
  stats: StatModel[];
  achievements: AchievementModel[];
  dayAverages: DayAverage[];
}

const initialState: DataState = {
  moods: [],
  stats: [],
  achievements: [],
  dayAverages: [],
};

/* SLICE */
export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
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
    setDayAverages: (state, action: PayloadAction<DayAverage[]>) => {
      state.dayAverages = action.payload;
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
  setDayAverages,
  addMood,
  removeMood,
  setAchievementAsOld,
  setStatAsOld,
} = dataSlice.actions;

/* SELECTS */
export const selectMoods = (state: RootState) => state.data.moods;
export const selectStats = (state: RootState) => state.data.stats;
export const selectAchievements = (state: RootState) => state.data.achievements;
export const selectDayAverages = (state: RootState) => state.data.dayAverages;
export const selectDarkModeUnlocked = (state: RootState) =>
  state.data.achievements.some(
    (achievement: AchievementModel) =>
      achievement.unlocks.indexOf("Dark Mode") >= 0 &&
      achievement.percentComplete === 1
  );
export const selectBlockMoods = (state: RootState) => {
  if (state.premium.isPremium) return false;
  const today = dateFormat(new Date(), "d/m/yyyy");
  const moodsToday = state.data.moods
    .slice(0, 10)
    .filter((mood: Mood) => dateFormat(mood.date, "d/m/yyyy") === today);
  return moodsToday.length >= 5;
};

export default dataSlice.reducer;
