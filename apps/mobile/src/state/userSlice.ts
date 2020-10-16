import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

/* TYPES */
interface UserState {
  token: string;
  isAnonymous: boolean;
  id: string;
  pushNotificationToken?: string;
}

const initialState: UserState = {
  token: "",
  isAnonymous: true,
  id: "",
  pushNotificationToken: undefined,
};

/* SLICE */
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setIsAnonymous: (state, action: PayloadAction<boolean>) => {
      state.isAnonymous = action.payload;
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setPushNotificationToken: (state, action: PayloadAction<string>) => {
      state.pushNotificationToken = action.payload;
    },
  },
});

export const {
  setPushNotificationToken,
  setToken,
  setIsAnonymous,
  setId,
} = userSlice.actions;

/* SELECTS */
export const selectUser = (state: RootState) => state.user;
export const selectPushNotificationToken = (state: RootState) =>
  state.user.pushNotificationToken;
export const selectToken = (state: RootState) => state.user.token;
export const selectIsAnonymous = (state: RootState) => state.user.isAnonymous;
export const selectId = (state: RootState) => state.user.id;

export default userSlice.reducer;
