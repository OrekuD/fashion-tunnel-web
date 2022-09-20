import { images } from "./../constants/index";
import { PayloadAction } from "@reduxjs/toolkit";
import Order from "../models/Order";
import Product from "../models/Product";
import UserAddress from "../models/UserAddress";
import { CartProduct } from "../types";

export interface AuthenticationState {
  isAuthenticated: boolean;
  accessToken: string;
  expiryAt: number;
}

export interface UIState {
  isCartModalVisible: boolean;
  isProfileModalVisible: boolean;
}

export interface SearchState {
  list: Array<Product>;
  query: string;
}

export interface CartState {
  total: number;
  subtotal: number;
  discountPercentage: number;
  discount: number;
  products: Array<CartProduct>;
}

export interface ProductsState {
  list: Array<Product>;
}

export interface FavouritesState {
  list: Array<Product>;
}

export interface OrderState {
  order: Order | null;
}

export interface UserAddressState {
  list: Array<UserAddress>;
  activeAddressId: string;
}
export interface OrdersState {
  list: Array<Order>;
}

export interface UploadState {
  image: string;
}

export type CPA<T = any> = PayloadAction<T> & { dispatch: Function };
