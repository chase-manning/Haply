import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "./store";

/* TYPES */
export enum Mode {
  Default,
  Dark,
  Light,
}

interface TempState {
  tagOptions: string[];
  colorPrimary: string;
  mode: Mode;
}

const initialState: TempState = {
  tagOptions: [
    "With Friends",
    "With Family",
    "Tired",
    "Well Rested",
    "In Pain",
    "Sick",
    "Working",
    "At Home",
    "On Holiday",
    "Eating Well",
    "Eating Poorly",
    "Exercising",
  ],
  colorPrimary: "#4071fe",
  mode: Mode.Default,
};

/* SLICE */
export const tempSlice = createSlice({
  name: "temp",
  initialState,
  reducers: {
    setTagOptions: (state, action: PayloadAction<string[]>) => {
      state.tagOptions = action.payload;
    },
    addTagOption: (state, action: PayloadAction<string>) => {
      state.tagOptions.push(action.payload);
    },
    removeTagOption: (state, action: PayloadAction<string>) => {
      const index = state.tagOptions.indexOf(action.payload);
      if (index > -1) state.tagOptions.splice(index, 1);
    },
    setColorPrimary: (state, action: PayloadAction<string>) => {
      state.colorPrimary = action.payload;
    },
    toggleMode: (state) => {
      if (state.mode === Mode.Dark) state.mode = Mode.Light;
      else state.mode = Mode.Dark;
    },
  },
});

export const {
  setTagOptions,
  addTagOption,
  removeTagOption,
  setColorPrimary,
  toggleMode,
} = tempSlice.actions;

/* SELECTS */
export const selectTagOptions = (state: RootState) => state.temp.tagOptions;
export const selectColorPrimary = (state: RootState) => state.temp.colorPrimary;
export const selectMode = (state: RootState) => state.temp.mode;

export default tempSlice.reducer;
