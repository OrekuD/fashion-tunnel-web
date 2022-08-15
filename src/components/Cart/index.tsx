import React from "react";
import classes from "./index.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/slices/ui.slice";
import { useSelectState } from "../../store/selectors";
import { cedi, ease } from "../../constants";
import { CancelIcon } from "../Icons";
import colors from "../../constants/colors";
import Button from "../Button";
import CartItem from "../CartItem";

interface Props {}

const Cart = (props: Props) => {
  const dispatch = useDispatch();
  const { ui } = useSelectState();

  const summary = [
    { label: "Subtotal", value: 134.99 },
    { label: "Shipping", value: 10.99 },
    { label: "Tax", value: 2.99 },
  ];

  const total = React.useMemo(() => 149, []);

  return (
    <AnimatePresence initial={false}>
      {ui.isCartVisible ? (
        <>
          <motion.div
            className={classes["modal-backdrop"]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={classes["modal-content"]}
            initial={{ translateX: "75vw" }}
            animate={{
              translateX: 0,
              transition: {
                ease: ease,
              },
            }}
            exit={{ translateX: "75vw" }}
          >
            <div className={classes["left-content"]}>
              <p className={classes["title"]}>Your cart</p>
              <div className={classes["list"]}>
                {Array(20)
                  .fill("9")
                  .map((_, index) => (
                    <CartItem key={index} />
                  ))}
              </div>
            </div>
            <div className={classes["right-content"]}>
              <button
                onClick={() =>
                  dispatch(uiActions.setCartModalState({ isVisible: false }))
                }
                className={classes["close-button"]}
              >
                <CancelIcon width={32} height={32} color={colors.deepgrey} />
              </button>
              <p className={classes["summary-title"]}>Summary</p>
              {summary.map(({ label, value }, index) => (
                <div className={classes["item"]} key={index}>
                  <p className={classes["key"]}>{label}</p>
                  <p className={classes["value"]}>{`${cedi}${value.toFixed(
                    2
                  )}`}</p>
                </div>
              ))}
              <div className={`${classes["item"]} ${classes["total"]}`}>
                <p className={classes["key"]}>Total</p>
                <p className={classes["value"]}>{`${cedi}${total.toFixed(
                  2
                )}`}</p>
              </div>
              <Button
                label="checkout"
                onClick={() => {}}
                style={{ maxWidth: "100%" }}
              />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default Cart;
