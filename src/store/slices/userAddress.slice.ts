import { CPA, UserAddressState } from "../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import userAddressAsyncActions from "../actions/userAddress.action";
import UserAddress from "../../models/UserAddress";
import OkResponse from "../../network/responses/OkResponse";
import authenticationAsyncActions from "../actions/authentication.action";
import AuthenticationResponse from "../../network/responses/AuthenticationResponse";

const initialState: UserAddressState = {
  list: [],
  activeAddressId: "",
};

const slice = createSlice({
  name: "user-address",
  initialState,
  reducers: {
    clear: () => initialState,
    setActiveAddress: (
      state,
      action: PayloadAction<{ userAddressId: string }>
    ) => {
      state.activeAddressId = action.payload.userAddressId;
    },
  },
  extraReducers: {
    [userAddressAsyncActions.index.fulfilled.type]: (
      state,
      action: CPA<Array<UserAddress>>
    ) => {
      state.list = action.payload;
      if (!state.activeAddressId && action.payload.length > 0) {
        state.activeAddressId = action.payload[0].id;
      }
      postRequest(action);
    },
    [userAddressAsyncActions.index.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
    [userAddressAsyncActions.addNewAddress.fulfilled.type]: (
      state,
      action: CPA<UserAddress>
    ) => {
      if (state.list.length === 0) {
        state.activeAddressId = action.payload.id;
      }
      state.list.unshift(action.payload);
      postRequest(action);
    },
    [userAddressAsyncActions.addNewAddress.rejected.type]: (
      _,
      action: CPA<any>
    ) => {
      postErrorRequest(action, action, initialState);
    },
    [userAddressAsyncActions.updateAddress.fulfilled.type]: (
      state,
      action: CPA<UserAddress>
    ) => {
      const index = state.list.findIndex(({ id }) => id === action.payload.id);
      if (index >= 0) {
        state.list.splice(index, 1, action.payload);
      }
      // state.list.unshift(action.payload);
      postRequest(action);
    },
    [userAddressAsyncActions.updateAddress.rejected.type]: (
      _,
      action: CPA<any>
    ) => {
      postErrorRequest(action, action, initialState);
    },
    [userAddressAsyncActions.deleteAddress.fulfilled.type]: (
      state,
      action: CPA<OkResponse & { id: string }>
    ) => {
      const index = state.list.findIndex(({ id }) => id === action.payload.id);
      if (index >= 0) {
        state.list.splice(index, 1);
      }
      postRequest(action);
    },
    [userAddressAsyncActions.deleteAddress.rejected.type]: (
      _,
      action: CPA<any>
    ) => {
      postErrorRequest(action, action, initialState);
    },
    [authenticationAsyncActions.signout.fulfilled.type]: () => initialState,
    [authenticationAsyncActions.signout.rejected.type]: () => initialState,
    [authenticationAsyncActions.signin.fulfilled.type]: (
      state,
      action: CPA<AuthenticationResponse>
    ) => {
      state.activeAddressId = action.payload.user.activeAddressId;
    },
    [authenticationAsyncActions.signup.fulfilled.type]: (
      state,
      action: CPA<AuthenticationResponse>
    ) => {
      state.activeAddressId = action.payload.user.activeAddressId;
    },
  },
});

export const userAddressActions = slice.actions;

export default slice.reducer;
