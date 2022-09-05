namespace OrderStatus {
  export enum Status {
    PENDING = 0,
    ACCEPTED = 1,
    PROCESSING = 2,
    DISPATCHED = 3,
    DELIVERED = 4,
    REJECTED = 5,
    CANCELLED = 6,
  }
  export class State {
    private static TEXT: Record<Status, string> = {
      [Status.PENDING]: "Pending",
      [Status.ACCEPTED]: "Accepted",
      [Status.PROCESSING]: "Processing",
      [Status.DISPATCHED]: "Dispatched",
      [Status.DELIVERED]: "Delivered",
      [Status.REJECTED]: "Rejected",
      [Status.CANCELLED]: "Cancelled",
    };

    private static DESCRIPTION: Record<Status, string> = {
      [Status.PENDING]: "Your order is being confirmed",
      [Status.ACCEPTED]: "Your order has been accepted",
      [Status.PROCESSING]: "Your order is being processed",
      [Status.DISPATCHED]: "Your order has been dispatched",
      [Status.DELIVERED]: "Your order has been delivered",
      [Status.REJECTED]: "Your order has been rejected",
      [Status.CANCELLED]: "Your order has been cancelled",
    };

    public static text = (status: Status) => State.TEXT[status];

    public static description = (status: Status) => State.DESCRIPTION[status];

    public static list = () =>
      Object.values(Status).filter(
        (item) => typeof item === "number"
      ) as Array<Status>;
  }
}

export default OrderStatus;
