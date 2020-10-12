import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

/* TYPES */
interface UserState {
  pushNotificationToken?: string;
}

const initialState: UserState = {
  pushNotificationToken: undefined,
};

/* SLICE */
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setPushNotificationToken: (state, action: PayloadAction<string>) => {
      state.pushNotificationToken = action.payload;
    },
  },
});

export const { setPushNotificationToken } = userSlice.actions;

/* SELECTS */
export const selectPushNotificationToken = (state: RootState) =>
  state.user.pushNotificationToken;

export default userSlice.reducer;
