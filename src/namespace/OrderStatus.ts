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

    public static text = (status: Status) => State.TEXT[status];

    public static list = () =>
      Object.values(Status).filter(
        (item) => typeof item === "number"
      ) as Array<Status>;
  }
}

export default OrderStatus;
