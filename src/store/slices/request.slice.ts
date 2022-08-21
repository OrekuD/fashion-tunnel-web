import { createSlice, PayloadAction as PA } from "@reduxjs/toolkit";
import { Request, Timing } from "../../types";

type Payload = Pick<Request.Info, "name" | "message" | "payload">;

const initialState: Request.State = {
  list: [],
  updatedAt: Timing.now(),
};

const sanitizePayloadName = (name: string): string => {
  if (
    name.includes("/fulfilled") ||
    name.includes("/rejected") ||
    name.includes("pending")
  ) {
    const parts = name.split("/");
    parts.pop();

    return parts.join("/");
  }

  return name;
};

const slice = createSlice({
  name: "request",
  initialState,
  reducers: {
    started: (state, { payload }: PA<string>) => {
      const payloadName = sanitizePayloadName(payload);

      const list = [...state.list];
      const index = list.findIndex(({ name }) => name === payloadName);

      if (index !== -1) {
        list.splice(index, 1);
      }

      list.push({
        name: payloadName,
        status: Request.Status.PENDING,
        message: "",
        payload: {},
      });

      state.list = list;
      state.updatedAt = Timing.now();
    },
    beforeFulfilled: (state, { payload }: PA<string>) => {
      const payloadName = sanitizePayloadName(payload);

      const list = [...state.list];
      const index = list.findIndex(({ name }) => name === payloadName);

      if (index !== -1) {
        list.splice(index, 1, {
          name: payloadName,
          status: Request.Status.BEFORE_FULFILLED,
          message: "",
          payload: {},
        });
      }

      state.list = list;
      state.updatedAt = Timing.now();
    },
    fulfilled: (state, { payload }: PA<Payload>) => {
      const payloadName = sanitizePayloadName(payload.name);

      const list = [...state.list];
      const index = list.findIndex(({ name }) => name === payloadName);

      if (index !== -1) {
        list.splice(index, 1, {
          name: payloadName,
          status: Request.Status.FULFILLED,
          message: payload.message || "",
          payload: payload.payload,
        });
      }

      state.list = list;
      state.updatedAt = Timing.now();
    },
    beforeRejected: (state, { payload }: PA<string>) => {
      const payloadName = sanitizePayloadName(payload);

      const list = [...state.list];
      const index = list.findIndex(({ name }) => name === payloadName);

      if (index !== -1) {
        list.splice(index, 1, {
          name: payloadName,
          status: Request.Status.BEFORE_REJECTED,
          message: "",
          payload: {},
        });
      }

      state.list = list;
      state.updatedAt = Timing.now();
    },
    rejected: (state, { payload }: PA<Payload>) => {
      const payloadName = sanitizePayloadName(payload.name);

      const list = [...state.list];
      const index = list.findIndex(({ name }) => name === payloadName);

      if (index !== -1) {
        list.splice(index, 1, {
          name: payloadName,
          status: Request.Status.REJECTED,
          message: payload.message || "",
          payload: payload.payload,
        });
      }

      state.list = list;
      state.updatedAt = Timing.now();
    },
    consumed: (state, { payload }: PA<string>) => {
      const payloadName = sanitizePayloadName(payload);

      const list = [...state.list];
      const index = list.findIndex(({ name }) => name === payloadName);

      if (index !== -1) {
        list.splice(index, 1);
      }

      state.list = list;
      state.updatedAt = Timing.now();
    },
  },
});

export const requestActions = slice.actions;

export default slice.reducer;
