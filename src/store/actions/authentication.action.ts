import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import API from "../../constants/api";
import Product from "../../models/Product";
import SignInRequest from "../../network/requests/SignInRequest";
import SignUpRequest from "../../network/requests/SignUpRequest";
import { requestActions } from "../slices/request.slice";
import AuthenticationResponse from "../../network/responses/AuthenticationResponse";
import OkResponse from "../../network/responses/OkResponse";

const signin = createAsyncThunk(
  "authentication/signin",
  async (payload: SignInRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(signin.typePrefix));
    try {
      const response = await API.client.post<
        SignInRequest,
        AxiosResponse<AuthenticationResponse>
      >("/user/sign-in", payload);

      // console.log({ d: response.data });
      thunkApi.dispatch(requestActions.beforeFulfilled(signin.typePrefix));
      return response.data;
    } catch (error) {
      // console.log({ error });
      thunkApi.dispatch(requestActions.beforeRejected(signin.typePrefix));
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const signup = createAsyncThunk(
  "authentication/sign-up",
  async (payload: SignUpRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(signup.typePrefix));
    try {
      const response = await API.client.post<
        SignUpRequest,
        AxiosResponse<AuthenticationResponse>
      >("/user/sign-up", payload);
      // console.log({ response: response.data });
      thunkApi.dispatch(requestActions.beforeFulfilled(signup.typePrefix));

      return response.data;
    } catch (error) {
      // console.log({ error: error });
      thunkApi.dispatch(requestActions.beforeRejected(signup.typePrefix));
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const signout = createAsyncThunk(
  "authentication/sign-out",
  async (_, thunkApi) => {
    thunkApi.dispatch(requestActions.started(signup.typePrefix));
    try {
      const response = await API.client.get<any, AxiosResponse<OkResponse>>(
        "/user/sign-out"
      );
      console.log({ response: response.data });
      thunkApi.dispatch(requestActions.beforeFulfilled(signup.typePrefix));

      return response.data;
    } catch (error) {
      console.log({ error: error });
      thunkApi.dispatch(requestActions.beforeRejected(signup.typePrefix));
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const authenticationAsyncActions = {
  signin,
  signup,
  signout,
};

export default authenticationAsyncActions;
