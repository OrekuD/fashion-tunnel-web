import React from "react";
import { useDispatch } from "react-redux";
import ordersAsyncActions from "../../store/actions/orders.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import classes from "./index.module.scss";

const OrdersView = () => {
  const { request } = useSelectState();
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    dispatch(ordersAsyncActions.index());
  }, []);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(ordersAsyncActions.index.typePrefix)) {
      RM.consume(ordersAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(ordersAsyncActions.index.typePrefix)) {
      RM.consume(ordersAsyncActions.index.typePrefix);
      setIsLoading(false);

      return;
    }
  }, [updatedAt, request.updatedAt]);

  return (
    <>
      <p className={classes["section-title"]}>Orders</p>
      {Array(10)
        .fill("0")
        .map((_, index) => (
          <div
            key={index}
            style={{
              width: 200,
              height: 200,
              marginBottom: 10,
              background: "red",
            }}
          />
        ))}
    </>
  );
};

export default OrdersView;
