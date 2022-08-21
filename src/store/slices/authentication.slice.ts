import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthenticationState, CPA } from "../types";
import API from "../../constants/api";
import authenticationAsyncActions from "../actions/authentication.action";
import AuthenticationResponse from "../../network/responses/AuthenticationResponse";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import ErrorResponse from "../../network/responses/ErrorResponse";

const initialState: AuthenticationState = {
  isAuthenticated: false,
  accessToken: "",
  expiryAt: -1,
};

const slice = createSlice({
  name: "authentication",
  initialState,
  reducers: {},
  extraReducers: {
    [authenticationAsyncActions.signin.fulfilled.type]: (
      state,
      action: CPA<AuthenticationResponse>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      API.addAccessToken(action.payload.accessToken);
      localStorage.setItem("accessToken", action.payload.accessToken);
      postRequest(action);
    },
    [authenticationAsyncActions.signup.fulfilled.type]: (
      state,
      action: CPA<AuthenticationResponse>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      API.addAccessToken(action.payload.accessToken);
      localStorage.setItem("accessToken", action.payload.accessToken);
      postRequest(action);
    },
    [authenticationAsyncActions.signin.rejected.type]: (
      state,
      action: CPA<ErrorResponse>
    ) => {
      state.accessToken = "";
      state.isAuthenticated = false;
      postErrorRequest(state, action, initialState);
    },
    [authenticationAsyncActions.signup.rejected.type]: (
      state,
      action: CPA<ErrorResponse>
    ) => {
      state.accessToken = "";
      state.isAuthenticated = false;
      postErrorRequest(state, action, initialState);
    },
  },
});

export const authenticationActions = slice.actions;

export default slice.reducer;
