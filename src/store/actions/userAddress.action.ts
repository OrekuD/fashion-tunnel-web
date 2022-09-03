import {createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosResponse} from 'axios';
import API from '../../constants/api';
import Product from '../../models/Product';
import UserAddress from '../../models/UserAddress';
import AddNewAddressRequest from '../../network/requests/AddNewAddressRequest';
import UpdateAddressRequest from '../../network/requests/UpdateAddressRequest';
import OkResponse from '../../network/responses/OkResponse';
import {requestActions} from '../slices/request.slice';

const index = createAsyncThunk('user-address/index', async (_, thunkApi) => {
  thunkApi.dispatch(requestActions.started(index.typePrefix));
  try {
    const response = await API.client.get<
      any,
      AxiosResponse<Array<UserAddress>>
    >('/user-address');

    // console.log({address: response.data});
    thunkApi.dispatch(requestActions.beforeFulfilled(index.typePrefix));
    return response.data;
  } catch (error) {
    // console.log({error});
    thunkApi.dispatch(requestActions.beforeRejected(index.typePrefix));
    return thunkApi.rejectWithValue({error});
  }
});

const addNewAddress = createAsyncThunk(
  'user-address/add-new-address',
  async (payload: AddNewAddressRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(addNewAddress.typePrefix));
    try {
      const response = await API.client.post<
        AddNewAddressRequest,
        AxiosResponse<Product>
      >(`/user-address`, payload);
      // console.log({response: response.data});
      thunkApi.dispatch(
        requestActions.beforeFulfilled(addNewAddress.typePrefix),
      );

      return response.data;
    } catch (error) {
      // console.log({error: error});
      thunkApi.dispatch(
        requestActions.beforeRejected(addNewAddress.typePrefix),
      );
      return thunkApi.rejectWithValue({error});
    }
  },
);

const deleteAddress = createAsyncThunk(
  'user-address/delete-address',
  async (userAddressId: string, thunkApi) => {
    thunkApi.dispatch(requestActions.started(deleteAddress.typePrefix));
    try {
      const response = await API.client.delete<any, AxiosResponse<OkResponse>>(
        `/user-address/${userAddressId}`,
      );
      // console.log({response: response.data});
      thunkApi.dispatch(
        requestActions.beforeFulfilled(deleteAddress.typePrefix),
      );

      return {...response.data, id: userAddressId};
    } catch (error) {
      // console.log({error: error});
      thunkApi.dispatch(
        requestActions.beforeRejected(deleteAddress.typePrefix),
      );
      return thunkApi.rejectWithValue({error});
    }
  },
);

const updateAddress = createAsyncThunk(
  'user-address/update-address',
  async (payload: UpdateAddressRequest, thunkApi) => {
    const {id, ...body} = payload;
    thunkApi.dispatch(requestActions.started(updateAddress.typePrefix));
    try {
      const response = await API.client.put<any, AxiosResponse<UserAddress>>(
        `/user-address/${id}`,
        body,
      );
      // console.log({response: response.data});
      thunkApi.dispatch(
        requestActions.beforeFulfilled(updateAddress.typePrefix),
      );

      return response.data;
    } catch (error) {
      // console.log({error: error});
      thunkApi.dispatch(
        requestActions.beforeRejected(updateAddress.typePrefix),
      );
      return thunkApi.rejectWithValue({error});
    }
  },
);

const userAddressAsyncActions = {
  index,
  addNewAddress,
  deleteAddress,
  updateAddress,
};

export default userAddressAsyncActions;
