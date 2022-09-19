import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import API from "../../constants/api";
import Product from "../../models/Product";
import ImageUploadResponse from "../../network/responses/ImageUploadResponse";
import { requestActions } from "../slices/request.slice";

const index = createAsyncThunk(
  "upload/index",
  async (images: FormData, thunkApi) => {
    thunkApi.dispatch(requestActions.started(index.typePrefix));
    try {
      const response = await API.client.post<
        any,
        AxiosResponse<ImageUploadResponse>
      >("/upload/images", images, {
        transformRequest: () => {
          // !!! override data to return formData
          // since axios converts that to string
          return images;
        },
      });

      console.log({ d: response.data });
      thunkApi.dispatch(requestActions.beforeFulfilled(index.typePrefix));
      return response.data;
    } catch (error) {
      console.log({ error });
      thunkApi.dispatch(requestActions.beforeRejected(index.typePrefix));
      return thunkApi.rejectWithValue({ error });
    }
  }
);
const uploadAsyncActions = {
  index,
};

export default uploadAsyncActions;
