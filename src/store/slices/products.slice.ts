import { CPA, ProductsState } from "./../types";
import { createSlice } from "@reduxjs/toolkit";
import { CartState } from "../types";
import productsAsyncActions from "../actions/products.action";
import Product from "../../models/Product";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";

const initialState: ProductsState = {
  list: [],
};

const slice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: {
    [productsAsyncActions.index.fulfilled.type]: (
      state,
      action: CPA<Array<Product>>
    ) => {
      state.list = action.payload;
      postRequest(action);
    },
    [productsAsyncActions.index.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
    [productsAsyncActions.getProduct.fulfilled.type]: (
      state,
      action: CPA<Product>
    ) => {
      state.list.unshift(action.payload);
      postRequest(action);
    },
    [productsAsyncActions.getProduct.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
  },
});

export const productActions = slice.actions;

export default slice.reducer;
