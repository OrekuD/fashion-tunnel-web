import { PayloadAction } from "@reduxjs/toolkit";
import Product from "../models/Product";
import { CartProduct } from "../types";

export interface AuthenticationState {
  isAuthenticated: boolean;
  accessToken: string;
  expiryAt: number;
}

export interface UIState {
  isCartVisible: boolean;
  isProfileVisible: boolean;
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

export type CPA<T = any> = PayloadAction<T> & { dispatch: Function };
