import { CPA, OrderState } from "../types";
import { createSlice } from "@reduxjs/toolkit";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import Order from "../../models/Order";
import ErrorResponse from "../../network/responses/ErrorResponse";
import ordersAsyncActions from "../actions/orders.action";

const initialState: OrderState = {
  order: null,
};

const slice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: {
    [ordersAsyncActions.getOrder.fulfilled.type]: (
      state,
      action: CPA<Order>
    ) => {
      state.order = action.payload;
      postRequest(action);
    },
    [ordersAsyncActions.getOrder.rejected.type]: (
      _,
      action: CPA<ErrorResponse>
    ) => {
      postErrorRequest(action, action, initialState);
    },
  },
});

export const orderActions = slice.actions;

export default slice.reducer;
