import { CPA, ProductsState } from "./../types";
import { createSlice } from "@reduxjs/toolkit";
import { CartState } from "../types";
import productsAsyncActions from "../actions/products.action";
import Product from "../../models/Product";

const initialState: ProductsState = {
  list: [],
};

const slice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: {
    [productsAsyncActions.index.fulfilled.type]: (
      state,
      action: CPA<Array<Product>>
    ) => {
      state.list = action.payload;
      // console.log("async works?");
    },
  },
});

export const cartActions = slice.actions;

export default slice.reducer;
