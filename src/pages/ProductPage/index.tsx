import React from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components";
import Header from "../../components/Header";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  HeartFilledIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
} from "../../components/Icons";
import { cedi } from "../../constants";
import colors from "../../constants/colors";
import ClothSizes from "../../namespace/ClothSizes";
import classes from "./index.module.scss";
import { useAnimation, motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import useKeyPress from "../../hooks/useKeyPress";
import { useSelectState } from "../../store/selectors";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/slices/cart.slice";
import Product from "../../models/Product";
import ProductCategories from "../../namespace/ProductCategories";
import productsAsyncActions from "../../store/actions/products.action";
import RequestManager from "../../store/request-manager";
import { productActions } from "../../store/slices/products.slice";
import { favouritesActions } from "../../store/slices/favourites.slice";
import favouritesAsyncActions from "../../store/actions/favourites.action";

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
  const params = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = React.useState<ClothSizes.Status>(-1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const { cart, products, request, favourites } = useSelectState();
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [product, setProduct] = React.useState<Product>();
  const dispatch = useDispatch();

  const isItemInCart = React.useMemo(
    () => cart.products.findIndex(({ id }) => id === params.id) >= 0,
    [cart.products, params.id]
  );

  const isItemInFavourites = React.useMemo(
    () => favourites.list.findIndex(({ id }) => id === params.id) >= 0,
    [favourites.list, params.id]
  );

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(productsAsyncActions.getProduct.typePrefix)) {
      RM.consume(productsAsyncActions.getProduct.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(productsAsyncActions.getProduct.typePrefix)) {
      RM.consume(productsAsyncActions.getProduct.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  React.useEffect(() => {
    if (!params.id) return;
    const _product = products.list.find(({ id }) => id === params.id);
    if (!_product) {
      dispatch(productsAsyncActions.getProduct(params.id));
      return;
    }
    setProduct(_product);
    setIsLoading(false);
  }, [products.list, params.id]);

  // const product = React.useMemo(
  //   () => cart.products.find(({ id }) => id === params.id),
  //   [cart, params.id]
  // );

  const imageIndex = React.useMemo(
    () => wrap(0, product?.images.length || 0, page),
    [page, product?.images]
  );

  const changeImage = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const isArrowUpPressed = useKeyPress("ArrowUp");
  const isArrowDownPressed = useKeyPress("ArrowDown");
  const isArrowLeftPressed = useKeyPress("ArrowLeft");
  const isArrowRightPressed = useKeyPress("ArrowRight");

  React.useEffect(() => {
    if (isArrowUpPressed || isArrowLeftPressed) {
      changeImage(-1);
    }
    if (isArrowDownPressed || isArrowRightPressed) {
      changeImage(1);
    }
  }, [
    isArrowUpPressed,
    isArrowLeftPressed,
    isArrowDownPressed,
    isArrowRightPressed,
  ]);

  const imageSection = (
    <>
      <div className={classes["middle-section"]}>
        <button
          className={classes["previous-button"]}
          onClick={() => changeImage(-1)}
        >
          <ChevronRightIcon
            width={24}
            height={24}
            color={colors.deepgrey}
            style={{ transform: "rotate(180deg" }}
          />
        </button>
        <button
          className={classes["next-button"]}
          onClick={() => changeImage(1)}
        >
          <ChevronRightIcon width={24} height={24} color={colors.deepgrey} />
        </button>
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={product?.images[imageIndex]}
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
                changeImage(1);
              } else if (swipe > swipeConfidenceThreshold) {
                changeImage(-1);
              }
            }}
          />
        </AnimatePresence>
        <div className={classes["pagination"]}>
          {product?.images.map((_, index) => {
            const active = index === page % product?.images.length;
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
    </>
  );

  if (isLoading)
    return (
      <>
        <p>
          fetching your product ..... loading .... will add loading shimmer
          animation later :)
        </p>
      </>
    );

  if (!product) return <>product not found</>;

  return (
    <div className={classes["container"]}>
      <Header />
      <div className={classes["content"]}>
        <div className={classes["left-section"]}>
          <p className={classes["category"]}>
            Home / Category /{" "}
            {ProductCategories.State.text(product.productCategory)}
          </p>
          <p className={classes["name"]}>{product.name}</p>
          <p className={classes["price"]}>{`${cedi} ${product.price?.toFixed(
            2
          )}`}</p>
          <div className={classes["image-slider"]}>{imageSection}</div>
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
              <p className={classes["title"]}>{product.description}</p>
            </div>
          </div>
        </div>
        {imageSection}
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
          <div
            className={`${classes["section"]} ${classes["quantity-section"]}`}
            style={{ paddingBottom: "0.5rem" }}
          >
            <div className={classes["section-title"]}>
              <p className={classes["title"]}>quantity</p>
              <ChevronRightIcon
                width={24}
                height={24}
                color={colors.deepgrey}
                style={{
                  transform: "rotate(90deg)",
                }}
              />
            </div>
            <div className={classes["quantity"]}>
              <button
                className={classes["size"]}
                onClick={() => {
                  setQuantity((prevValue) =>
                    prevValue === 1 ? prevValue : prevValue - 1
                  );
                  if (isItemInCart && params.id) {
                    dispatch(
                      cartActions.decreaseProductCount({ productId: params.id })
                    );
                  }
                }}
                style={{
                  opacity: quantity === 1 ? 0.5 : 1,
                }}
              >
                <MinusIcon
                  width={16}
                  height={16}
                  color={colors.deepgrey}
                  strokeWidth={3}
                />
              </button>
              <div className={classes["count"]}>
                <p>{quantity}</p>
              </div>
              <button
                className={classes["size"]}
                onClick={() => {
                  setQuantity((prevValue) => prevValue + 1);
                  if (isItemInCart && params.id) {
                    dispatch(
                      cartActions.increaseProductCount({ productId: params.id })
                    );
                  }
                }}
                style={{}}
              >
                <PlusIcon
                  width={16}
                  height={16}
                  strokeWidth={3}
                  color={colors.deepgrey}
                />
              </button>
            </div>
          </div>
          <div className={classes["footer"]}>
            <button
              className={classes["like-button"]}
              onClick={() => {
                dispatch(favouritesActions.updateFavourites({ product }));
                dispatch(favouritesAsyncActions.updateFavourites(product.id));
              }}
            >
              {isItemInFavourites ? (
                <HeartFilledIcon width={18} height={18} color={colors.error} />
              ) : (
                <HeartIcon width={18} height={18} color={colors.deepgrey} />
              )}
            </button>
            <div className={classes["button"]}>
              <Button
                label={isItemInCart ? "remove to cart" : "add to cart"}
                onClick={() => {
                  if (isItemInCart) {
                    dispatch(
                      cartActions.removeProduct({ productId: product.id })
                    );
                  } else {
                    dispatch(
                      cartActions.addProduct({
                        product: {
                          ...product,
                          count: quantity,
                          total: product.price * quantity,
                          size: selectedSize,
                        },
                      })
                    );
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
