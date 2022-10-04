import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { ease } from "../../constants";
import colors from "../../constants/colors";
import Product from "../../models/Product";
import { wrapText } from "../../utils/wrapText";
import { CancelIcon } from "../Icons";
import classes from "./index.module.scss";

interface Props {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  product: Product;
}

const SizeGuideModal = (props: Props) => {
  const sizes = React.useMemo(
    () => [
      { label: "42", value: "xxs" },
      { label: "44", value: "xs" },
      { label: "46", value: "s" },
      { label: "48", value: "m" },
      { label: "50", value: "l" },
      { label: "52", value: "xl" },
      { label: "54", value: "xxl" },
      { label: "56", value: "xxl" },
      { label: "58", value: "4xl" },
      { label: "60", value: "5xl" },
      { label: "62", value: "6xl" },
    ],
    []
  );

  return (
    <AnimatePresence initial={false}>
      {props.isVisible ? (
        <>
          <motion.div
            className={classes["modal-backdrop"]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => props.setIsVisible(false)}
          />
          <motion.div
            className={classes["modal-content"]}
            initial={{ translateY: "100vh" }}
            animate={{
              translateY: 0,
              transition: {
                ease: ease,
              },
            }}
            exit={{ translateY: "100vh" }}
            // drag="y"
            // dragConstraints={{ left: 0, right: 0, top: 0 }}
            // dragSnapToOrigin
            // dragElastic={{ left: 0, right: 0, top: 0, bottom: 0.2 }}
            // onDragEnd={(_, info) => {
            //   if (info.offset.y > 80) {
            //     props.setIsVisible(false);
            //   }
            // }}
          >
            <button
              className={classes["close-button"]}
              onClick={() => props.setIsVisible(false)}
            >
              <CancelIcon width={24} height={24} color={colors.deepgrey} />
            </button>
            <div className={classes["content"]}>
              <div className={classes["row"]}>
                <div className={classes["left-section"]}>
                  <p className={classes["name"]}>{props.product.name}</p>
                  <p className={classes["description"]}>
                    {wrapText(props.product.description, 45)}
                  </p>
                </div>
                <img
                  src={props.product.images[0]}
                  alt={props.product.name}
                  className={classes["product-image"]}
                />
              </div>
              {sizes.map(({ label, value }, index) => (
                <div
                  key={label}
                  className={classes["item"]}
                  style={{
                    //   ...styles.item,
                    backgroundColor: index % 2 === 0 ? "#F5F5F5" : colors.white,
                  }}
                >
                  <div className={classes["section"]}>
                    <p>{label}</p>
                  </div>
                  <div className={classes["section"]}>
                    <p>{value}</p>
                  </div>
                </div>
              ))}
              <p className={classes["disclaimer"]}>
                * Please note that the measurement may vary slightly according
                to different brands and styles
              </p>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default SizeGuideModal;
