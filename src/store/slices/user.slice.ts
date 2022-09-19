import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "../../models/User";
import AuthenticationResponse from "../../network/responses/AuthenticationResponse";
import ErrorResponse from "../../network/responses/ErrorResponse";
import OkResponse from "../../network/responses/OkResponse";
import authenticationAsyncActions from "../actions/authentication.action";
import userAsyncActions from "../actions/user.action";
import postErrorRequest from "../postErrorRequest";
import postRequest from "../postRequest";
import { CPA } from "../types";

const initialState: User = {
  email: "",
  firstname: "",
  lastname: "",
  activeAddressId: "",
  profilePicture: "",
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: {
    [userAsyncActions.updateDetails.fulfilled.type]: (
      state,
      action: CPA<User>
    ) => {
      state.email = action.payload.email;
      state.firstname = action.payload.firstname;
      state.lastname = action.payload.lastname;
      state.activeAddressId = action.payload.activeAddressId;
      // state.profilePicture = action.payload.profilePicture;
      postRequest(action);
    },
    [userAsyncActions.updateDetails.rejected.type]: (
      state,
      action: CPA<ErrorResponse>
    ) => {
      postErrorRequest(state, action, initialState);
    },
    [userAsyncActions.updateProfilePicture.fulfilled.type]: (
      state,
      action: CPA<User>
    ) => {
      state.profilePicture = action.payload.profilePicture;
      postRequest(action);
    },
    [userAsyncActions.updateProfilePicture.rejected.type]: (
      state,
      action: CPA<ErrorResponse>
    ) => {
      postErrorRequest(state, action, initialState);
    },
    [userAsyncActions.changePassword.fulfilled.type]: (
      _,
      action: CPA<OkResponse>
    ) => {
      postRequest(action);
    },
    [userAsyncActions.changePassword.rejected.type]: (
      state,
      action: CPA<ErrorResponse>
    ) => {
      postErrorRequest(state, action, initialState);
    },
    [authenticationAsyncActions.signin.fulfilled.type]: (
      state,
      action: CPA<AuthenticationResponse>
    ) => {
      state.email = action.payload.user.email;
      state.firstname = action.payload.user.firstname;
      state.lastname = action.payload.user.lastname;
      state.activeAddressId = action.payload.user.activeAddressId;
      state.profilePicture = action.payload.user.profilePicture;
      postRequest(action);
    },
    [authenticationAsyncActions.signin.rejected.type]: (
      state,
      action: CPA<ErrorResponse>
    ) => {
      postErrorRequest(state, action, initialState);
    },
    [authenticationAsyncActions.signup.fulfilled.type]: (
      state,
      action: CPA<AuthenticationResponse>
    ) => {
      state.email = action.payload.user.email;
      state.firstname = action.payload.user.firstname;
      state.lastname = action.payload.user.lastname;
      state.activeAddressId = action.payload.user.activeAddressId;
      state.profilePicture = action.payload.user.profilePicture;
      postRequest(action);
    },
    [authenticationAsyncActions.signup.rejected.type]: (
      state,
      action: CPA<ErrorResponse>
    ) => {
      postErrorRequest(state, action, initialState);
    },
    [authenticationAsyncActions.signout.fulfilled.type]: () => initialState,
    [authenticationAsyncActions.signout.rejected.type]: () => initialState,
  },
});

export const userActions = slice.actions;

export default slice.reducer;
