import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import API from "../../constants/api";
import { requestActions } from "../slices/request.slice";
import OkResponse from "../../network/responses/OkResponse";
import ChangePasswordRequest from "../../network/requests/ChangePasswordRequest";
import UpdateUserRequest from "../../network/requests/UpdateUserRequest";
import UpdateUserProfileImageRequest from "../../network/requests/UpdateUserProfileImageRequest";

const changePassword = createAsyncThunk(
  "user/change-password",
  async (payload: ChangePasswordRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(changePassword.typePrefix));
    try {
      const response = await API.client.put<
        ChangePasswordRequest,
        AxiosResponse<OkResponse>
      >("/user/change-password", payload);

      // console.log({d: response.data});
      thunkApi.dispatch(
        requestActions.beforeFulfilled(changePassword.typePrefix)
      );
      return response.data;
    } catch (error) {
      // console.log({error});
      thunkApi.dispatch(
        requestActions.beforeRejected(changePassword.typePrefix)
      );
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const updateDetails = createAsyncThunk(
  "user/update-details",
  async (payload: UpdateUserRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(updateDetails.typePrefix));
    try {
      const response = await API.client.put<
        UpdateUserRequest,
        AxiosResponse<OkResponse>
      >("/user", payload);

      // console.log({d: response.data});
      thunkApi.dispatch(
        requestActions.beforeFulfilled(updateDetails.typePrefix)
      );
      return response.data;
    } catch (error) {
      // console.log({error});
      thunkApi.dispatch(
        requestActions.beforeRejected(updateDetails.typePrefix)
      );
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const updateProfilePicture = createAsyncThunk(
  "user/update-profile-picture",
  async (payload: UpdateUserProfileImageRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(updateProfilePicture.typePrefix));
    try {
      const response = await API.client.put<
        UpdateUserProfileImageRequest,
        AxiosResponse<OkResponse>
      >("/user/profile-image", payload);

      // console.log({d: response.data});
      thunkApi.dispatch(
        requestActions.beforeFulfilled(updateProfilePicture.typePrefix)
      );
      return response.data;
    } catch (error) {
      // console.log({error});
      thunkApi.dispatch(
        requestActions.beforeRejected(updateProfilePicture.typePrefix)
      );
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const userAsyncActions = {
  changePassword,
  updateDetails,
  updateProfilePicture,
};

export default userAsyncActions;
