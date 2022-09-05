import OrderStatus from "../namespace/OrderStatus";
import { DetailedOrderProduct, OrderStatusTimeStamp } from "../types";
import UserAddress from "./UserAddress";

export default interface Order {
  id: string;
  total: number;
  subtotal: number;
  discount: number;
  orderNumber: string;
  deliveryAddress: UserAddress;
  createdAt: string;
  products: Array<DetailedOrderProduct>;
  status: OrderStatus.Status;
  statusTimeStamps: Array<OrderStatusTimeStamp>;
}
