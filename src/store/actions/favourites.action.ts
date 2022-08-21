import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import API from "../../constants/api";
import Product from "../../models/Product";
import { requestActions } from "../slices/request.slice";

const index = createAsyncThunk("favourites/index", async (_, thunkApi) => {
  thunkApi.dispatch(requestActions.started(index.typePrefix));
  try {
    const response = await API.client.get<any, AxiosResponse<Array<Product>>>(
      "/favourites"
    );

    // console.log({ d: response.data[0] });
    thunkApi.dispatch(requestActions.beforeFulfilled(index.typePrefix));
    return response.data;
  } catch (error) {
    console.log({ error });
    thunkApi.dispatch(requestActions.beforeRejected(index.typePrefix));
    return thunkApi.rejectWithValue({ error });
  }
});

const updateFavourites = createAsyncThunk(
  "favourites/update",
  async (productId: string, thunkApi) => {
    thunkApi.dispatch(requestActions.started(updateFavourites.typePrefix));
    try {
      const response = await API.client.post<any, AxiosResponse<Product>>(
        "/favourites",
        { productId }
      );
      console.log({ response: response.data });
      thunkApi.dispatch(
        requestActions.beforeFulfilled(updateFavourites.typePrefix)
      );

      return response.data;
    } catch (error) {
      console.log({ error: error });
      thunkApi.dispatch(
        requestActions.beforeRejected(updateFavourites.typePrefix)
      );
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const favouritesAsyncActions = {
  index,
  updateFavourites,
};

export default favouritesAsyncActions;
