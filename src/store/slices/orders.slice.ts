import {createSlice} from '@reduxjs/toolkit';
import Order from '../../models/Order';
import ErrorResponse from '../../network/responses/ErrorResponse';
import ordersAsyncActions from '../actions/orders.action';
import postErrorRequest from '../postErrorRequest';
import postRequest from '../postRequest';
import {CPA, OrdersState} from '../types';

const initialState: OrdersState = {
  list: [],
};

const slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: {
    [ordersAsyncActions.index.fulfilled.type]: (
      state,
      action: CPA<Array<Order>>,
    ) => {
      state.list = action.payload;
      postRequest(action);
    },
    [ordersAsyncActions.index.rejected.type]: (
      state,
      action: CPA<ErrorResponse>,
    ) => {
      postErrorRequest(state, action, initialState);
    },
    [ordersAsyncActions.createOrder.fulfilled.type]: (
      state,
      action: CPA<Order>,
    ) => {
      state.list.unshift(action.payload);
      postRequest(action);
    },
    [ordersAsyncActions.createOrder.rejected.type]: (
      state,
      action: CPA<ErrorResponse>,
    ) => {
      postErrorRequest(state, action, initialState);
    },
  },
});

export const ordersActions = slice.actions;

export default slice.reducer;
