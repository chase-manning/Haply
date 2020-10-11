import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import AchievementModel from "../models/AchievementModel";
import Mood, { MoodResponse } from "../models/mood";
import { StatModel } from "../models/StatModel";
import AchievementService from "../services/AchievementService";
import MoodService from "../services/MoodService";
import StatService from "../services/StatService";
import { AppThunk, RootState } from "./store";
import { selectColorPrimary, selectMode } from "./tempSlice";
import { selectUser } from "./userSlice";

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
  },
});

export const { setMoods, setStats, setAchievements } = dataSlice.actions;

/* THUNKS */
export const updateMoods = (): AppThunk => async (dispatch) => {
  const user = useSelector(selectUser)!;
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

export const updateStats = (): AppThunk => (dispatch) => {
  const moods = useSelector(selectMoods);
  const stats = StatService.getStats(moods);

  dispatch(setStats(stats));
};

export const updateAchievements = (): AppThunk => (dispatch) => {
  const moods = useSelector(selectMoods);
  const colorPrimary = useSelector(selectColorPrimary);
  const mode = useSelector(selectMode);

  const achievements = AchievementService.getAchievements(
    moods,
    colorPrimary,
    mode
  );

  dispatch(setAchievements(achievements));
};

/* SELECTS */
export const selectMoods = (state: RootState) => state.data.moods;
export const selectStats = (state: RootState) => state.data.stats;
export const selectAchievements = (state: RootState) => state.data.achievements;

export default dataSlice.reducer;
