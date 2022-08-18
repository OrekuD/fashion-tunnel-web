import { calculateCart } from "./../../utils/calculateCart";
import { CartProduct } from "./../../types";
import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { CartState } from "../types";

const initialState: CartState = {
  discount: 0,
  products: [],
  total: 0,
  subtotal: 0,
  discountPercentage: 0,
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<{ product: CartProduct }>) => {
      state.products.unshift(action.payload.product);
    },
    increaseProductCount: (
      state,
      action: PayloadAction<{ productId: string }>
    ) => {
      const productIndex = state.products.findIndex(
        ({ id }) => id === action.payload.productId
      );
      if (productIndex < 0) {
        return;
      }
      const product = state.products[productIndex];
      if (product.count >= product.productQuantity) {
        return;
      }
      const updatedCount = product.count + 1;
      product.count = updatedCount;
      product.total = updatedCount * product.price;
      const { discount, subtotal, total } = calculateCart(
        state.products,
        state.discountPercentage
      );
      state.discount = discount;
      state.subtotal = subtotal;
      state.total = total;
    },
    decreaseProductCount: (
      state,
      action: PayloadAction<{ productId: string }>
    ) => {
      const productIndex = state.products.findIndex(
        ({ id }) => id === action.payload.productId
      );
      if (productIndex < 0) {
        return;
      }
      const product = state.products[productIndex];
      if (product.count === 1) {
        state.products = state.products.filter(
          ({ id }) => id !== action.payload.productId
        );
      } else {
        const updatedCount = product.count - 1;
        product.count = updatedCount;
        product.total = updatedCount * product.price;
        state.products.splice(productIndex, 1, product);
      }
      const { discount, subtotal, total } = calculateCart(
        state.products,
        state.discountPercentage
      );
      state.discount = discount;
      state.subtotal = subtotal;
      state.total = total;
    },
    clearCart: () => initialState,
  },
});

export const cartActions = slice.actions;

export default slice.reducer;
