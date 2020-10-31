import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

/* TYPES */
type Product = {
  price: string;
};

interface PremiumState {
  isPremium: boolean;
  product: Product;
}

const initialState: PremiumState = {
  isPremium: false,
  product: { price: "" },
};

/* SLICE */
export const premiumSlice = createSlice({
  name: "premium",
  initialState,
  reducers: {
    setPremium: (state) => {
      state.isPremium = true;
    },
    setFree: (state) => {
      state.isPremium = false;
    },
    setProductPrice: (state, action: PayloadAction<string>) => {
      state.product.price = action.payload;
    },
  },
});

export const { setPremium, setFree, setProductPrice } = premiumSlice.actions;

/* SELECTS */
export const selectIsPremium = (state: RootState) => state.premium.isPremium;
export const selectProductPrice = (state: RootState) =>
  state.premium.product.price;

export default premiumSlice.reducer;
