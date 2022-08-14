import React from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components";
import Header from "../../components/Header";
import {
  ChevronRightIcon,
  HeartFilledIcon,
  HeartIcon,
} from "../../components/Icons";
import { cedi, images } from "../../constants";
import colors from "../../constants/colors";
import ClothSizes from "../../namespace/ClothSizes";
import classes from "./index.module.scss";
import { useAnimation, motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";

const ease = [0.6, 0.05, -0.01, 0.9];
export const imageVariant = {
  enter: (direction: number) => {
    return {
      // x: direction > 0 ? 1000 : -1000,
      x: direction > 0 ? "40vw" : "-40vw",
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      // x: direction < 0 ? 1000 : -1000,
      x: direction < 0 ? "40vw" : "-40vw",
      opacity: 0,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const ProductPage = () => {
  const params = useParams();
  const [selectedSize, setSelectedSize] = React.useState<ClothSizes.Status>(-1);
  const animation = useAnimation();
  const [activeImageIndex, setActiveImageIndex] = React.useState<number>(0);
  const [[page, direction], setPage] = React.useState([0, 0]);

  const imageIndex = wrap(0, images.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const moveRight = () => {
    if (activeImageIndex === images.length - 1) {
      return;
    }
    animation.start("moveRight");
    setActiveImageIndex(activeImageIndex + 1);
  };

  const moveLeft = () => {
    if (activeImageIndex === 0) {
      return;
    }
    animation.start("moveLeft");
    setActiveImageIndex(activeImageIndex - 1);
  };

  React.useEffect(() => {
    console.log({ params });
  }, []);
  return (
    <div className={classes["container"]}>
      <Header />
      <div className={classes["content"]}>
        <div className={classes["left-section"]}>
          <p className={classes["category"]}>Home / Category / Jacket</p>
          <p className={classes["name"]}>Suilven Quilted Jacket</p>
          <p className={classes["price"]}>{`${cedi}123.99`}</p>
          <div className={classes["sections"]}>
            <div className={classes["section"]}>
              <div className={classes["section-title"]}>
                <p className={classes["title"]}>description</p>
                <ChevronRightIcon
                  width={24}
                  height={24}
                  color={colors.deepgrey}
                  style={{
                    transform: "rotate(90deg)",
                  }}
                />
              </div>
              <p className={classes["title"]}>
                Dolore amet ipsum do cillum anim. Do Lorem id do aute. Duis qui
                incididunt sunt laboris aute exercitation occaecat consectetur.
              </p>
            </div>
          </div>
        </div>
        <div className={classes["middle-section"]}>
          {/* {images.map((uri, index) => (
            <motion.img
              src={uri}
              variants={imageVariant}
              animate={animation}
              key={index}
              custom={activeImageIndex}
              className={classes["product-image"]}
            />
          ))} */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={page}
              src={images[imageIndex]}
              custom={direction}
              variants={imageVariant}
              className={classes["product-image"]}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
            />
          </AnimatePresence>
          <div className={classes["pagination"]}>
            {images.map((_, index) => {
              const active = index === page;
              return (
                <div
                  className={classes["dot"]}
                  key={index}
                  style={{ opacity: active ? 1 : 0.5 }}
                />
              );
            })}
          </div>
        </div>
        <div className={classes["right-section"]}>
          <div
            className={classes["section"]}
            style={{ paddingBottom: "0.5rem" }}
          >
            <div className={classes["section-title"]}>
              <p className={classes["title"]}>sizes</p>
              <ChevronRightIcon
                width={24}
                height={24}
                color={colors.deepgrey}
                style={{
                  transform: "rotate(90deg)",
                }}
              />
            </div>
            <div className={classes["sizes"]}>
              {ClothSizes.State.list().map((size, index) => {
                const isSelected = index === selectedSize;
                return (
                  <button
                    className={classes["size"]}
                    onClick={() => setSelectedSize(isSelected ? -1 : size)}
                    style={{
                      borderColor: isSelected
                        ? colors.deepgrey
                        : "rgba(41, 37, 37, 0.2)",
                    }}
                    key={size}
                  >
                    <p>{ClothSizes.State.text(size)}</p>
                  </button>
                );
              })}
            </div>
            <Link to="#" className={classes["size-guide"]}>
              <p>View size guide</p>
              <ChevronRightIcon
                width={24}
                height={24}
                color={colors.deepgrey}
              />
            </Link>
          </div>
          <div className={classes["footer"]}>
            <button
              className={classes["like-button"]}
              onClick={() => paginate(-1)}
            >
              {false ? (
                <HeartFilledIcon width={18} height={18} color={colors.error} />
              ) : (
                <HeartIcon width={18} height={18} color={colors.deepgrey} />
              )}
            </button>
            <Button label="add to cart" onClick={() => paginate(1)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
