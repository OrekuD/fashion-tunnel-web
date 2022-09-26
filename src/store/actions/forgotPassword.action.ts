import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import API from "../../constants/api";
import { requestActions } from "../slices/request.slice";
import AuthenticationResponse from "../../network/responses/AuthenticationResponse";
import OkResponse from "../../network/responses/OkResponse";
import ForgotPasswordRequest from "../../network/requests/ForgotPasswordRequest";
import ResetPasswordRequest from "../../network/requests/ResetPasswordRequest";

const forgotPassword = createAsyncThunk(
  "forgot-password/request-code",
  async (payload: ForgotPasswordRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(forgotPassword.typePrefix));
    try {
      const response = await API.client.post<
        ForgotPasswordRequest,
        AxiosResponse<OkResponse>
      >("/user/forgot-password", payload);

      console.log({ d: response.data });
      thunkApi.dispatch(
        requestActions.beforeFulfilled(forgotPassword.typePrefix)
      );
      return response.data;
    } catch (error) {
      console.log({ error });
      thunkApi.dispatch(
        requestActions.beforeRejected(forgotPassword.typePrefix)
      );
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const resetPassword = createAsyncThunk(
  "forgot-password/reset",
  async (payload: ResetPasswordRequest, thunkApi) => {
    console.log({ payload });
    thunkApi.dispatch(requestActions.started(resetPassword.typePrefix));
    try {
      const response = await API.client.post<
        ResetPasswordRequest,
        AxiosResponse<AuthenticationResponse>
      >("/user/reset-password", payload);

      console.log({ d: response.data });
      thunkApi.dispatch(
        requestActions.beforeFulfilled(resetPassword.typePrefix)
      );
      return response.data;
    } catch (error) {
      console.log({ error });
      thunkApi.dispatch(
        requestActions.beforeRejected(resetPassword.typePrefix)
      );
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const forgotPasswordAsyncActions = {
  forgotPassword,
  resetPassword,
};

export default forgotPasswordAsyncActions;
