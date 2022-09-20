import {createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosResponse} from 'axios';
import API from '../../constants/api';
import Product from '../../models/Product';
import SearchProductRequest from '../../network/requests/SearchProductRequest';
import {requestActions} from '../slices/request.slice';

const index = createAsyncThunk(
  'search/index',
  async (payload: SearchProductRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(index.typePrefix));
    try {
      const response = await API.client.post<
        any,
        AxiosResponse<Array<Product>>
      >('/search', payload);

      // console.log({d: response.data});
      thunkApi.dispatch(requestActions.beforeFulfilled(index.typePrefix));
      return response.data;
    } catch (error) {
      console.log({_error: (error as any)?.list[0]});
      thunkApi.dispatch(requestActions.beforeRejected(index.typePrefix));
      return thunkApi.rejectWithValue({error});
    }
  },
);
const searchAsyncActions = {
  index,
};

export default searchAsyncActions;
