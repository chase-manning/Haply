import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import navigationReducer from "./navigationSlice";
import userReducer from "./userSlice";
import settingsReducer from "./settingsSlice";
import tempReducer from "./tempSlice";
import dataReducer from "./dataSlice";

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    user: userReducer,
    settings: settingsReducer,
    temp: tempReducer,
    data: dataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
