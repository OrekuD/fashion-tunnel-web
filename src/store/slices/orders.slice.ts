import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Order from "../../models/Order";
import ErrorResponse from "../../network/responses/ErrorResponse";
import OrderStatusChangeResponse from "../../network/responses/OrderStatusChangeResponse";
import ordersAsyncActions from "../actions/orders.action";
import postErrorRequest from "../postErrorRequest";
import postRequest from "../postRequest";
import { CPA, OrdersState } from "../types";

const initialState: OrdersState = {
  list: [],
};

const slice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    updateOrderStatus: (
      state,
      action: PayloadAction<OrderStatusChangeResponse>
    ) => {
      const orderIndex = state.list.findIndex(
        ({ id }) => id === action.payload.orderId
      );
      if (orderIndex < 0) {
        return;
      }
      const statusTimeStamps = state.list[orderIndex].statusTimeStamps;
      const timeStampIndex = statusTimeStamps.findIndex(
        ({ status }) => status === action.payload.status
      );
      if (timeStampIndex < 0) {
        statusTimeStamps.unshift({
          status: action.payload.status,
          time: action.payload.time,
        });
      } else {
        statusTimeStamps.splice(timeStampIndex, 1, {
          status: action.payload.status,
          time: action.payload.time,
        });
      }
      state.list.splice(orderIndex, 1, {
        ...state.list[orderIndex],
        status: action.payload.status,
        statusTimeStamps,
      });
    },
    addNewOrder: (state, action: PayloadAction<Order>) => {
      const orderIndex = state.list.findIndex(
        ({ id }) => id === action.payload.id
      );
      if (orderIndex < 0) {
        state.list.unshift(action.payload);
      }
    },
  },
  extraReducers: {
    [ordersAsyncActions.index.fulfilled.type]: (
      state,
      action: CPA<Array<Order>>
    ) => {
      state.list = action.payload;
      postRequest(action);
    },
    [ordersAsyncActions.index.rejected.type]: (
      state,
      action: CPA<ErrorResponse>
    ) => {
      postErrorRequest(state, action, initialState);
    },
    [ordersAsyncActions.createOrder.fulfilled.type]: (
      state,
      action: CPA<Order>
    ) => {
      state.list.unshift(action.payload);
      postRequest(action);
    },
    [ordersAsyncActions.createOrder.rejected.type]: (
      state,
      action: CPA<ErrorResponse>
    ) => {
      postErrorRequest(state, action, initialState);
    },
    // [ordersAsyncActions.getOrder.fulfilled.type]: (
    //   state,
    //   action: CPA<Order>
    // ) => {
    //   const orderIndex = state.list.findIndex(
    //     ({ id }) => id === action.payload.id
    //   );
    //   if (orderIndex < 0) {
    //     state.list.unshift(action.payload);
    //   } else {
    //     state.list.splice(orderIndex, 1, action.payload);
    //   }
    //   postRequest(action);
    // },
    // [ordersAsyncActions.getOrder.rejected.type]: (
    //   state,
    //   action: CPA<ErrorResponse>
    // ) => {
    //   postErrorRequest(state, action, initialState);
    // },
  },
});

export const ordersActions = slice.actions;

export default slice.reducer;
