import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import Header from "../../components/Header";
import RadioButton from "../../components/RadioButton";
import { cedi } from "../../constants";
import CreateOrderRequest from "../../network/requests/CreateOrderRequest";
import ordersAsyncActions from "../../store/actions/orders.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import classes from "./index.module.scss";

const CheckoutPage = () => {
  const { userAddress, cart, request, orders, authentication } =
    useSelectState();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(ordersAsyncActions.createOrder.typePrefix)) {
      RM.consume(ordersAsyncActions.createOrder.typePrefix);
      setIsLoading(false);
      navigate(`/orders/${orders.list[0].id}`);
      // props.navigation.navigate('OrderScreen', {orderId: orders.list[0].id});

      return;
    }

    if (RM.isRejected(ordersAsyncActions.createOrder.typePrefix)) {
      RM.consume(ordersAsyncActions.createOrder.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  const activeAddress = React.useMemo(
    () => userAddress.list.find(({ id }) => id === userAddress.activeAddressId),
    [userAddress.activeAddressId, userAddress.list]
  );

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

  const canProceed = React.useMemo(() => {
    if (!activeAddress?.id) return false;
    if (cart.products.length === 0) return false;
    return activeAddress.id.length > 0;
  }, [userAddress]);

  const handleSubmit = () => {
    if (!canProceed || isLoading) {
      return;
    }
    setIsLoading(true);

    const payload: CreateOrderRequest = {
      discount: cart.discountPercentage,
      products: cart.products,
      subtotal: cart.subtotal,
      total: cart.total,
      userAddressId: userAddress.activeAddressId,
    };

    dispatch(ordersAsyncActions.createOrder(payload));
  };

  return (
    <div className={classes["container"]}>
      <Header />
      <div className={classes["left-container"]}>
        <p className={classes["title"]}>Checkout</p>
        <p className={classes["label"]}>
          Few steps more to complete your order
        </p>
        <div className={classes["section"]}>
          <p className={classes["section-title"]}>Cart details</p>
          <div className={classes["products"]}>
            {cart.products.map(({ count, name, images, total }, index) => (
              <div className={classes["product"]} key={index}>
                <img
                  src={images[0]}
                  alt={name}
                  className={classes["product-image"]}
                />
                <div className={classes["content"]}>
                  <p>{name}</p>
                  <p>{`${cedi} ${total.toFixed(2)}`}</p>
                  <p>x {count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={classes["right-container"]}>
        <div className={classes["section"]}>
          <p className={classes["section-title"]}>Cart summary</p>
          {summary.map(({ label, value }, index) => (
            <div className={classes["row-item"]} key={index}>
              <p>{label}</p>
              <p>{value}</p>
            </div>
          ))}
          <div className={classes["row-item"]}>
            <p>Total</p>
            <p>{`${cedi} ${cart.total.toFixed(2)}`}</p>
          </div>
        </div>
        {authentication.isAuthenticated ? (
          <div className={classes["section"]}>
            <p className={classes["section-title"]}>Delivery details</p>
            {activeAddress ? (
              <>
                <div className={classes["address"]}>
                  <div className={classes["content"]}>
                    <p>{activeAddress.name}</p>
                    <p>{activeAddress.addressLine}</p>
                    <p>{activeAddress.postalCode}</p>
                  </div>
                  <RadioButton isChecked onClick={() => {}} />
                </div>
                <button
                  className={classes["change"]}
                  onClick={() => navigate("/profile/address-book")}
                >
                  <p>Change</p>
                </button>
              </>
            ) : (
              <>
                <p className={classes["no-address"]}>No address set</p>
                <Button
                  label="Add one"
                  onClick={() => navigate("/profile/address-book")}
                />
              </>
            )}
          </div>
        ) : (
          <>
            <p className={classes["login"]}>You have to login to continue</p>
            <Button label="Sign in" onClick={() => navigate("/sign-in")} />
          </>
        )}
        {authentication.isAuthenticated ? (
          <Button
            label="Confirm"
            isDisabled={!canProceed || isLoading}
            isLoading={isLoading}
            onClick={handleSubmit}
            className={classes["confirm-button"]}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
