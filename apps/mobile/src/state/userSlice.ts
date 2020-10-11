import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase";
import { RootState } from "./store";

/* TYPES */
interface UserState {
  value?: User;
}

const initialState: UserState = {
  value: undefined,
};

/* SLICE */
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.value = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

/* SELECTS */
export const selectUser = (state: RootState) => state.user.value;

export const selectIsSignedIn = (state: RootState) => !!state.user.value;

export default userSlice.reducer;
