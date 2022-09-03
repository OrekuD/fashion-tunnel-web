import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { combineReducers } from "redux";
import API from "../constants/api";
import authentication from "./slices/authentication.slice";
import user from "./slices/user.slice";
import ui from "./slices/ui.slice";
import cart from "./slices/cart.slice";
import products from "./slices/products.slice";
import request from "./slices/request.slice";
import favourites from "./slices/favourites.slice";
import orders from "./slices/orders.slice";
import userAddress from "./slices/userAddress.slice";

const reducers = {
  authentication,
  user,
  ui,
  cart,
  products,
  request,
  favourites,
  orders,
  userAddress,
};

const rootReducer = combineReducers(reducers);

// This middleware will just add the property "async dispatch" to all actions
// @ts-ignore
const asyncDispatchMiddleware = (store) => (next) => (action) => {
  let syncActivityFinished = false;
  let actionQueue: Array<any> = [];

  function flushQueue() {
    try {
      actionQueue.forEach((a) => store.dispatch(a));
    } catch (e) {
      // Ignore
    } // flush queue
    actionQueue = [];
  }

  function dispatch(asyncAction: any) {
    actionQueue = actionQueue.concat([asyncAction]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithAsyncDispatch = Object.assign({}, action, {
    dispatch,
  });

  const res = next(actionWithAsyncDispatch);

  syncActivityFinished = true;
  flushQueue();

  return res;
};

const initializeStore = async () => {
  let preloadedState: any = {};

  const state = localStorage.getItem("state");
  if (state) {
    preloadedState = JSON.parse(state);
    if (preloadedState && preloadedState.hasOwnProperty("authentication")) {
      API.addAccessToken(preloadedState.authentication.accessToken);
    }
  }

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(asyncDispatchMiddleware),
    devTools: process.env.NODE_ENV === "development",
    preloadedState,
  });

  store.subscribe(async () => {
    const state = store.getState();
    const { request, ...data } = state;

    localStorage.setItem("state", JSON.stringify(data));
  });

  return store;
};

export type RootState = ReturnType<typeof rootReducer>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export default initializeStore;
