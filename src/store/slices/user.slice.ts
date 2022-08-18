import {
  createSlice,
  PayloadAction as PA,
  PayloadAction,
} from "@reduxjs/toolkit";
import User from "../../models/User";

const initialState: User = {
  id: "",
  email: "",
  firstname: "",
  lastname: "",
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<{ user: User }>) => {
      state.id = action.payload.user.id;
      state.email = action.payload.user.email;
      state.firstname = action.payload.user.firstname;
      state.lastname = action.payload.user.lastname;
    },
    signOut: () => initialState,
  },
});

export const userActions = slice.actions;

export default slice.reducer;
