import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import ErrorResponse from '../../network/responses/ErrorResponse';
import postErrorRequest from '../postErrorRequest';
import postRequest from '../postRequest';
import {CPA, ForgotPasswordState} from '../types';
import forgotPasswordAsyncActions from '../actions/forgotPassword.action';
import OkResponse from '../../network/responses/OkResponse';
import AuthenticationResponse from '../../network/responses/AuthenticationResponse';

const initialState: ForgotPasswordState = {
  code: '',
  email: '',
};

const slice = createSlice({
  name: 'forgot-password',
  initialState,
  reducers: {
    clear: () => initialState,
    addEmail: (state, action: PayloadAction<{email: string}>) => {
      state.email = action.payload.email;
    },
    addCode: (state, action: PayloadAction<{code: string}>) => {
      state.code = action.payload.code;
    },
  },
  extraReducers: {
    [forgotPasswordAsyncActions.forgotPassword.fulfilled.type]: (
      _,
      action: CPA<OkResponse>,
    ) => {
      postRequest(action);
    },
    [forgotPasswordAsyncActions.forgotPassword.rejected.type]: (
      state,
      action: CPA<ErrorResponse>,
    ) => {
      postErrorRequest(state, action, initialState);
    },
    [forgotPasswordAsyncActions.resetPassword.fulfilled.type]: (
      state,
      action: CPA<AuthenticationResponse>,
    ) => {
      state.code = '';
      state.email = '';
      postRequest(action);
    },
    [forgotPasswordAsyncActions.resetPassword.rejected.type]: (
      state,
      action: CPA<ErrorResponse>,
    ) => {
      postErrorRequest(state, action, initialState);
    },
  },
});

export const forgotPasswordActions = slice.actions;

export default slice.reducer;
