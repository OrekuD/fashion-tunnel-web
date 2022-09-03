import { CPA, FavouritesState } from "./../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Product from "../../models/Product";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import favouritesAsyncActions from "../actions/favourites.action";
import authenticationAsyncActions from "../actions/authentication.action";

const initialState: FavouritesState = {
  list: [],
};

const slice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    clear: () => initialState,
    updateFavourites: (state, action: PayloadAction<{ product: Product }>) => {
      const productIndex = state.list.findIndex(
        ({ id }) => action.payload.product.id === id
      );
      if (productIndex < 0) {
        state.list.unshift(action.payload.product);
      } else {
        state.list.splice(productIndex, 1);
      }
    },
  },
  extraReducers: {
    [favouritesAsyncActions.index.fulfilled.type]: (
      state,
      action: CPA<Array<Product>>
    ) => {
      state.list = action.payload;
      postRequest(action);
    },
    [favouritesAsyncActions.index.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
    [favouritesAsyncActions.updateFavourites.fulfilled.type]: (
      state,
      action: CPA<Product>
    ) => {
      // state.list.unshift(action.payload);
      postRequest(action);
    },
    [favouritesAsyncActions.updateFavourites.rejected.type]: (
      _,
      action: CPA<any>
    ) => {
      postErrorRequest(action, action, initialState);
    },
    [authenticationAsyncActions.signout.fulfilled.type]: () => initialState,
    [authenticationAsyncActions.signout.rejected.type]: () => initialState,
  },
});

export const favouritesActions = slice.actions;

export default slice.reducer;
