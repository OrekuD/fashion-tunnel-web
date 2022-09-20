import { createSlice } from "@reduxjs/toolkit";
import ErrorResponse from "../../network/responses/ErrorResponse";
import ImageUploadResponse from "../../network/responses/ImageUploadResponse";
import uploadAsyncActions from "../actions/upload.action";
import userAsyncActions from "../actions/user.action";
import postErrorRequest from "../postErrorRequest";
import postRequest from "../postRequest";
import { CPA, UploadState } from "../types";

const initialState: UploadState = {
  image: "",
};

const slice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: {
    [uploadAsyncActions.index.fulfilled.type]: (
      state,
      action: CPA<ImageUploadResponse>
    ) => {
      if (action.payload.images.length > 0) {
        state.image = action.payload.images[0];
      }
      postRequest(action);
    },
    [uploadAsyncActions.index.rejected.type]: (
      state,
      action: CPA<ErrorResponse>
    ) => {
      postErrorRequest(state, action, initialState);
    },
    [userAsyncActions.updateProfilePicture.fulfilled.type]: () => initialState,
    [userAsyncActions.updateProfilePicture.rejected.type]: () => initialState,
  },
});

export const uiActions = slice.actions;

export default slice.reducer;
