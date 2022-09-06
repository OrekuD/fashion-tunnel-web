import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UIState } from "../types";

const initialState: UIState = {
  isCartModalVisible: false,
  isProfileModalVisible: false,
};

const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCartModalState: (
      state,
      action: PayloadAction<{ isVisible: boolean }>
    ) => {
      state.isCartModalVisible = action.payload.isVisible;
    },
    setProfileModalState: (
      state,
      action: PayloadAction<{ isVisible: boolean }>
    ) => {
      state.isProfileModalVisible = action.payload.isVisible;
    },
  },
});

export const uiActions = slice.actions;

export default slice.reducer;
