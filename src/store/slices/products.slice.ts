import { ProductsState } from "./../types";
import { createSlice } from "@reduxjs/toolkit";
import { CartState } from "../types";

const initialState: ProductsState = {
  list: [],
};

const slice = createSlice({
  name: "products",
  initialState,
  reducers: {},
});

export const cartActions = slice.actions;

export default slice.reducer;
