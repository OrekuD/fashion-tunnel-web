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
import { useLocation, useNavigate } from "react-router-dom";

interface Props {}

const Cart = (props: Props) => {
  const dispatch = useDispatch();
  const { ui, cart } = useSelectState();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(uiActions.setCartModalState({ isVisible: false }));
  }, [pathname]);

  const summary = React.useMemo(() => {
    const data = [
      { label: "Subtotal", value: `${cedi} ${cart.subtotal.toFixed(2)}` },
    ];

    if (cart.discountPercentage > 0) {
      data.push({
        label: "Discount %",
        value: `${cart.discountPercentage * 100} %`,
      });
      data.push({
        label: "Discount",
        value: `${cedi} ${cart.discount.toFixed(2)}`,
      });
    }

    return data;
  }, [cart.discount, cart.discountPercentage, cart.subtotal, cart.total]);

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
            <button
              onClick={() =>
                dispatch(uiActions.setCartModalState({ isVisible: false }))
              }
              className={classes["close-button"]}
            >
              <CancelIcon width={32} height={32} color={colors.deepgrey} />
            </button>
            <div className={classes["left-content"]}>
              <p className={classes["title"]}>Your cart</p>
              {cart.products.length === 0 ? (
                <p className={classes["no-items"]}>
                  You currently have no items in your cart.
                </p>
              ) : (
                <div className={classes["list"]}>
                  {cart.products.map((product, index) => (
                    <CartItem key={index} product={product} />
                  ))}
                </div>
              )}
            </div>
            {cart.products.length > 0 && (
              <div className={classes["right-content"]}>
                <p className={classes["summary-title"]}>Summary</p>
                {summary.map(({ label, value }, index) => (
                  <div className={classes["item"]} key={index}>
                    <p className={classes["key"]}>{label}</p>
                    <p className={classes["value"]}>{value}</p>
                  </div>
                ))}

                <div className={`${classes["item"]}`}>
                  <p className={classes["key"]}>Total</p>
                  <p className={classes["value"]}>{`${cedi}${cart.total.toFixed(
                    2
                  )}`}</p>
                </div>
                <Button
                  label="checkout"
                  onClick={() => {
                    navigate("/checkout");
                  }}
                  style={{ maxWidth: "100%", marginTop: 12 }}
                />
              </div>
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default Cart;
