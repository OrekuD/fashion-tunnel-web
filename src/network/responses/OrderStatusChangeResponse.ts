import OrderStatus from "../../namespace/OrderStatus";

export default interface OrderStatusChangeResponse {
  orderId: string;
  status: OrderStatus.Status;
  timeStamp: string;
}
