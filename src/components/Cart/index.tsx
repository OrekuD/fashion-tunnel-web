import React from "react";
import classes from "./index.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/slices/ui.slice";
import { useSelectState } from "../../store/selectors";
import { ease } from "../../constants";

interface Props {}

const Cart = (props: Props) => {
  const dispatch = useDispatch();
  const { ui } = useSelectState();

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
            >
              close
            </button>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default Cart;
