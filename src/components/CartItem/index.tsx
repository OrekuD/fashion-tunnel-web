import React from "react";
import { cedi, images } from "../../constants";
import colors from "../../constants/colors";
import { wrapText } from "../../utils/wrapText";
import { CancelIcon, MinusIcon, PlusIcon } from "../Icons";
import classes from "./index.module.scss";

interface Props {}

const CartItem = (props: Props) => {
  return (
    <div className={classes["container"]}>
      <img src={images[1]} alt="" className={classes["image"]} />
      <div className={classes["details"]}>
        <p className={classes["name"]}>Suilven Quilted Jacket</p>
        <p className={classes["description"]}>
          {wrapText(
            "Exercitation laboris incididunt dolor in voluptate consequat nisi. Cupidatat sit dolor culpa laboris veniam pariatur aliqua ullamco labore non. Culpa occaecat consectetur irure occaecat.",
            50
          )}
        </p>
      </div>
      <div className={classes["extra-detail"]}>size</div>
      <div className={classes["quantity"]}>
        <button className={classes["icon-button"]}>
          <MinusIcon width={14} height={14} color={colors.deepgrey} />
        </button>
        <p className={classes["count"]}>3</p>
        <button className={classes["icon-button"]}>
          <PlusIcon width={14} height={14} color={colors.deepgrey} />
        </button>
      </div>
      <div className={classes["price"]}>{`${cedi}14.99`}</div>
      <button className={classes["remove-button"]}>
        <CancelIcon width={24} height={24} color={colors.error} />
      </button>
    </div>
  );
};

export default CartItem;
