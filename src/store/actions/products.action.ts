import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import API from "../../constants/api";
import Product from "../../models/Product";
// import { requestActions } from '../slices/request.slice';

const index = createAsyncThunk("countries/get", async (_, thunkApi) => {
  // thunkApi.dispatch(requestActions.started(index.typePrefix));
  try {
    const response = await API.client.get<any, AxiosResponse<Array<Product>>>(
      "/products"
    );

    // console.log({ d: response.data[0] });
    // thunkApi.dispatch(requestActions.beforeFulfilled(index.typePrefix));
    return response.data;
  } catch (error) {
    console.log({ error });
    // thunkApi.dispatch(requestActions.beforeRejected(index.typePrefix));
    return thunkApi.rejectWithValue({ error });
  }
});

const productsAsyncActions = {
  index,
};

export default productsAsyncActions;
