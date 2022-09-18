import { format } from "date-fns";
import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import { cedi } from "../../constants";
import colors from "../../constants/colors";
import Order from "../../models/Order";
import OrderStatus from "../../namespace/OrderStatus";
import ordersAsyncActions from "../../store/actions/orders.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import formatOrderNumber from "../../utils/formatOrderNumber";
import classes from "./index.module.scss";

const OrderPage = () => {
  const {
    orders,
    request,
    order: { order },
  } = useSelectState();
  // const [order, setOrder] = React.useState<Order>();
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const [updatedAt] = React.useState(request.updatedAt);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(ordersAsyncActions.getOrder.typePrefix)) {
      RM.consume(ordersAsyncActions.getOrder.typePrefix);
      // setOrder(orders.list.find(({ id }) => id === params.id));
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(ordersAsyncActions.getOrder.typePrefix)) {
      RM.consume(ordersAsyncActions.getOrder.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isPending(ordersAsyncActions.getOrder.typePrefix)) {
      setIsLoading(true);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  // React.useEffect(() => {
  //   if (!params?.id) return;
  //   const _order = orders.list.find(({ id }) => id === params.id);
  //   if (!_order) {
  //     dispatch(ordersAsyncActions.getOrder(params.id));
  //     return;
  //   }
  //   setOrder(_order);
  //   setIsLoading(false);
  // }, [orders.list, params.id]);

  React.useEffect(() => {
    if (!params?.id) return;
    dispatch(ordersAsyncActions.getOrder(params.id));
  }, [params.id]);

  const summary = React.useMemo(() => {
    const data = [
      {
        label: "Subtotal",
        value: `${cedi} ${order?.subtotal?.toFixed(2)}`,
      },
      {
        label: "Total",
        value: `${cedi} ${order?.total?.toFixed(2)}`,
      },
    ];

    if (order?.discount && order.discount > 0) {
      data.unshift({
        label: "Discount",
        value: `-${cedi} ${order?.discount?.toFixed(2)}`,
      });
    }

    return data;
  }, [order?.subtotal]);

  const failedOrders = React.useMemo(
    () => [OrderStatus.Status.CANCELLED, OrderStatus.Status.REJECTED],
    []
  );

  const orderTracking = React.useMemo(
    () => [
      OrderStatus.Status.PENDING,
      OrderStatus.Status.ACCEPTED,
      OrderStatus.Status.PROCESSING,
      OrderStatus.Status.DISPATCHED,
      OrderStatus.Status.DELIVERED,
    ],
    []
  );

  if (isLoading)
    return (
      <>
        <p>
          fetching your order ..... loading .... will add loading shimmer
          animation later :)
        </p>
      </>
    );

  if (!order) return <>order not found</>;

  return (
    <div className={classes["container"]}>
      <Header />
      <div className={classes["left-container"]}>
        <p className={classes["title"]}>
          Order <span>#{formatOrderNumber(order.orderNumber, 4)}</span>{" "}
        </p>

        {failedOrders.includes(order.status) ? (
          <p className={classes["declined"]}>Your order has been declined</p>
        ) : (
          <>
            <p className={classes["status"]}>
              {order.status === OrderStatus.Status.DELIVERED
                ? "Your order is complete"
                : "Your order is in progress"}
            </p>
            <div className={classes["order-tracking"]}>
              {orderTracking.map((orderStatus, index) => {
                const timeStamp = order.statusTimeStamps.find(
                  ({ status }) => status === orderStatus
                );
                return (
                  <div key={index} className={classes["status-wrapper"]}>
                    <div className={classes["side-panel"]}>
                      {order.status === OrderStatus.Status.DELIVERED ? (
                        <div className={classes["indicator-wrapper"]}>
                          <div className={classes["completed-indicator"]} />
                        </div>
                      ) : (
                        <div className={classes["indicator-wrapper"]}>
                          {orderStatus < order.status ? (
                            <div className={classes["completed-indicator"]} />
                          ) : orderStatus === order.status ? (
                            <div className={classes["in-progress-indicator"]}>
                              <div className={classes["indicator"]} />
                            </div>
                          ) : (
                            <div className={classes["pending-indicator"]} />
                          )}
                        </div>
                      )}
                      <div
                        className={classes["line"]}
                        style={{
                          backgroundColor:
                            orderStatus <= order.status
                              ? colors.green
                              : colors.grey,
                          opacity: index === orderTracking.length - 1 ? 0 : 1,
                        }}
                      />
                    </div>
                    <p>{OrderStatus.State.description(orderStatus)}</p>
                    {timeStamp?.time ? (
                      <div className={classes["row"]}>
                        <p className={classes["time"]}>
                          {format(
                            new Date(timeStamp.time),
                            "hh:mm a, dd/MM/yyy"
                          )}
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div className={classes["right-container"]}>
        <div className={classes["section"]}>
          <p className={classes["section-title"]}>Order details</p>
          {order.products.map(({ count, name, total, images }, index) => (
            <div className={classes["product"]} key={index}>
              <img
                src={images[0]}
                alt={name}
                className={classes["product-image"]}
              />
              <div className={classes["content"]}>
                <p>{name}</p>
                <p>{`${cedi} ${total.toFixed(2)}`}</p>
              </div>
              <p>x {count}</p>
            </div>
          ))}
        </div>
        <div className={classes["section"]}>
          <p className={classes["section-title"]}>Order summary</p>
          {summary.map(({ label, value }, index) => (
            <div className={classes["item"]} key={index}>
              <p>{label}</p>
              <p>{value}</p>
            </div>
          ))}
        </div>
        <div className={classes["section"]}>
          <p className={classes["section-title"]}>Delivery address</p>
          <p>{order.deliveryAddress.name}</p>
          <p>{order.deliveryAddress.addressLine}</p>
          <p>{order.deliveryAddress.postalCode}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
