import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UIState } from "../types";

const initialState: UIState = {
  isCartVisible: false,
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
  },
});

export const uiActions = slice.actions;

export default slice.reducer;
