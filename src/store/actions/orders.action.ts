import {createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosResponse} from 'axios';
import API from '../../constants/api';
import Order from '../../models/Order';
import Product from '../../models/Product';
import CreateOrderRequest from '../../network/requests/CreateOrderRequest';
import {requestActions} from '../slices/request.slice';

const index = createAsyncThunk('orders/index', async (_, thunkApi) => {
  thunkApi.dispatch(requestActions.started(index.typePrefix));
  try {
    const response = await API.client.get<any, AxiosResponse<Array<Order>>>(
      '/orders',
    );

    // console.log({ d: response.data[0] });
    thunkApi.dispatch(requestActions.beforeFulfilled(index.typePrefix));
    return response.data;
  } catch (error) {
    console.log({error});
    thunkApi.dispatch(requestActions.beforeRejected(index.typePrefix));
    return thunkApi.rejectWithValue({error});
  }
});

const createOrder = createAsyncThunk(
  'orders/create',
  async (payload: CreateOrderRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(createOrder.typePrefix));
    try {
      const response = await API.client.post<
        CreateOrderRequest,
        AxiosResponse<Product>
      >('/orders', payload);
      // console.log({ response: response.data });
      thunkApi.dispatch(requestActions.beforeFulfilled(createOrder.typePrefix));

      return response.data;
    } catch (error) {
      // console.log({error: error});
      thunkApi.dispatch(requestActions.beforeRejected(createOrder.typePrefix));
      return thunkApi.rejectWithValue({error});
    }
  },
);

const ordersAsyncActions = {
  index,
  createOrder,
};

export default ordersAsyncActions;
