import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import AchievementModel from "../models/AchievementModel";
import Mood, { MoodResponse } from "../models/mood";
import { StatModel } from "../models/StatModel";
import AchievementService from "../services/AchievementService";
import MoodService from "../services/MoodService";
import StatService from "../services/StatService";
import { AppThunk, RootState } from "./store";
import { Mode, selectColorPrimary, selectMode } from "./tempSlice";
import { User } from "firebase";

/* TYPES */
interface DataState {
  moods: Mood[];
  stats: StatModel[];
  achievements: AchievementModel[];
}

const initialState: DataState = {
  moods: [],
  stats: [],
  achievements: [],
};

/* SLICE */
export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
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
} = dataSlice.actions;

/* THUNKS */
export const updateMoods = (user: User): AppThunk => async (dispatch) => {
  const response: any = await MoodService.getMoods(user, "date");
  const moodResponses: MoodResponse[] = await response.json();

  let moods: Mood[] = [];
  moodResponses.forEach((moodResponse: MoodResponse) => {
    moods.push(
      new Mood(
        moodResponse.data.value,
        moodResponse.data.userId,
        moodResponse.data.note,
        moodResponse.data.tags,
        moodResponse.data.date,
        moodResponse.id
      )
    );
  });

  dispatch(setMoods(moods));
};

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

export default dataSlice.reducer;
