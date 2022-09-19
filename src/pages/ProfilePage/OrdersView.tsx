import React from "react";
import { useDispatch } from "react-redux";
import ordersAsyncActions from "../../store/actions/orders.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import formatOrderNumber from "../../utils/formatOrderNumber";
import { format } from "date-fns";
import classes from "./index.module.scss";
import OrderStatus from "../../namespace/OrderStatus";
import { cedi } from "../../constants";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import colors from "../../constants/colors";

const OrdersView = () => {
  const { request, orders } = useSelectState();
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
      {isLoading ? (
        <div>
          <Loader color={colors.deepgrey} />
        </div>
      ) : (
        <>
          {orders.list.length === 0 ? (
            <div>
              <p>You have no orders</p>
            </div>
          ) : (
            <>
              {orders.list.map(
                ({ id, orderNumber, status, createdAt, total }) => {
                  return (
                    <Link
                      key={id}
                      className={classes["order"]}
                      to={`/orders/${id}`}
                    >
                      <div>
                        <p>{`# ${formatOrderNumber(orderNumber, 4)}`}</p>
                        <p>{format(new Date(createdAt), "dd/MM/yyy")}</p>
                      </div>
                      <div>
                        <p>{`${cedi} ${total.toFixed(2)}`}</p>
                        <p>{OrderStatus.State.text(status)}</p>
                      </div>
                    </Link>
                  );
                }
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default OrdersView;
