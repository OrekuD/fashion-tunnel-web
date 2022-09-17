import { CPA, OrderState } from "../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import Order from "../../models/Order";
import ErrorResponse from "../../network/responses/ErrorResponse";
import ordersAsyncActions from "../actions/orders.action";
import OrderStatusChangeResponse from "../../network/responses/OrderStatusChangeResponse";

const initialState: OrderState = {
  order: null,
};

const slice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clear: () => initialState,
    updateOrderStatus: (
      state,
      action: PayloadAction<OrderStatusChangeResponse>
    ) => {
      if (!state?.order) return;
      if (state.order.id !== action.payload.orderId) return;

      const statusTimeStamps = state.order.statusTimeStamps;
      const timeStampIndex = statusTimeStamps.findIndex(
        ({ status }) => status === action.payload.status
      );
      if (timeStampIndex < 0) {
        statusTimeStamps.unshift({
          status: action.payload.status,
          time: action.payload.timeStamp,
        });
      } else {
        statusTimeStamps.splice(timeStampIndex, 1, {
          status: action.payload.status,
          time: action.payload.timeStamp,
        });
      }

      state.order.status = action.payload.status;
      state.order.statusTimeStamps = statusTimeStamps;
    },
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
