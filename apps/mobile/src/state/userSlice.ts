import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase";
import { RootState } from "./store";

/* TYPES */
interface UserState {
  value?: User;
  pushNotificationToken?: string;
}

const initialState: UserState = {
  value: undefined,
  pushNotificationToken: undefined,
};

/* SLICE */
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.value = action.payload;
    },
    setPushNotificationToken: (state, action: PayloadAction<string>) => {
      state.pushNotificationToken = action.payload;
    },
  },
});

export const { setUser, setPushNotificationToken } = userSlice.actions;

/* SELECTS */
export const selectUser = (state: RootState) => state.user.value;
export const selectIsSignedIn = (state: RootState) => !!state.user.value;
export const selectPushNotificationToken = (state: RootState) =>
  state.user.pushNotificationToken;

export default userSlice.reducer;
