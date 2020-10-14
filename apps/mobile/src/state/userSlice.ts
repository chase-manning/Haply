import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase";
import { RootState } from "./store";

/* TYPES */
interface UserState {
  user?: string;
  pushNotificationToken?: string;
}

const initialState: UserState = {
  user: undefined,
  pushNotificationToken: undefined,
};

/* SLICE */
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = JSON.stringify(action.payload);
    },
    setPushNotificationToken: (state, action: PayloadAction<string>) => {
      state.pushNotificationToken = action.payload;
    },
  },
});

export const { setPushNotificationToken, setUser } = userSlice.actions;

/* SELECTS */
export const selectPushNotificationToken = (state: RootState) =>
  state.user.pushNotificationToken;
export const selectUser = (state: RootState) => {
  if (!state.user.user) return undefined;
  let user: User = JSON.parse(state.user.user!);
  return user;
};

export default userSlice.reducer;
