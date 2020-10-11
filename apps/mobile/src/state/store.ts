import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import navigationReducer from "./navigationSlice";

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
