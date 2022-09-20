import {CPA, SearchState} from './../types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import Product from '../../models/Product';
import postRequest from '../postRequest';
import postErrorRequest from '../postErrorRequest';
import searchAsyncActions from '../actions/search.action';
import ErrorResponse from '../../network/responses/ErrorResponse';

const initialState: SearchState = {
  list: [],
  query: '',
};

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clear: () => initialState,
    addQuery: (state, action: PayloadAction<{query: string}>) => {
      state.query = action.payload.query;
    },
  },
  extraReducers: {
    [searchAsyncActions.index.fulfilled.type]: (
      state,
      action: CPA<Array<Product>>,
    ) => {
      state.list = action.payload;
      postRequest(action);
    },
    [searchAsyncActions.index.rejected.type]: (
      _,
      action: CPA<ErrorResponse>,
    ) => {
      postErrorRequest(action, action, initialState);
    },
  },
});

export const searchActions = slice.actions;

export default slice.reducer;
