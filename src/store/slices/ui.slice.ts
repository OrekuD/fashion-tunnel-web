import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UIState } from "../types";

const initialState: UIState = {
  isCartVisible: false,
  isProfileVisible: false,
};

const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCartModalState: (
      state,
      action: PayloadAction<{ isVisible: boolean }>
    ) => {
      state.isCartVisible = action.payload.isVisible;
    },
    setProfileModalState: (
      state,
      action: PayloadAction<{ isVisible: boolean }>
    ) => {
      state.isProfileVisible = action.payload.isVisible;
    },
  },
});

export const uiActions = slice.actions;

export default slice.reducer;
