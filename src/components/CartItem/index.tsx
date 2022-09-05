import React from "react";
import { useDispatch } from "react-redux";
import { cedi } from "../../constants";
import colors from "../../constants/colors";
import { cartActions } from "../../store/slices/cart.slice";
import { CartProduct } from "../../types";
import { wrapText } from "../../utils/wrapText";
import { CancelIcon, MinusIcon, PlusIcon, TrashIcon } from "../Icons";
import classes from "./index.module.scss";

interface Props {
  product: CartProduct;
}

const CartItem = (props: Props) => {
  const dispatch = useDispatch();
  return (
    <div className={classes["container"]}>
      <img src={props.product.images[0]} alt="" className={classes["image"]} />
      <div className={classes["details"]}>
        <p className={classes["name"]}>{props.product.name}</p>
        <div className={classes["row"]}>
          <div className={classes["quantity"]}>
            <button
              className={classes["icon-button"]}
              onClick={() => {
                dispatch(
                  cartActions.decreaseProductCount({
                    productId: props.product.id,
                  })
                );
              }}
            >
              <MinusIcon width={14} height={14} color={colors.deepgrey} />
            </button>
            <p className={classes["count"]}>{props.product.count}</p>
            <button
              className={classes["icon-button"]}
              onClick={() => {
                dispatch(
                  cartActions.increaseProductCount({
                    productId: props.product.id,
                  })
                );
              }}
            >
              <PlusIcon width={14} height={14} color={colors.deepgrey} />
            </button>
          </div>
          <p
            className={classes["price"]}
          >{`${cedi} ${props.product.total.toFixed(2)}`}</p>
          <button
            className={classes["remove-button"]}
            onClick={() => {
              dispatch(
                cartActions.removeProduct({ productId: props.product.id })
              );
            }}
          >
            <TrashIcon width={24} height={24} color={colors.error} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
