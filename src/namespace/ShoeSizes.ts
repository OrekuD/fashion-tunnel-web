namespace ShoeSize {
  export enum Status {
    XXS = 0,
    XS = 1,
    S = 2,
    M = 3,
    L = 4,
    XL = 5,
    XXL = 6,
  }

  export class State {
    private static TEXT: Record<Status, string> = {
      [Status.XXS]: "Extra extra small",
      [Status.XS]: "Extra small",
      [Status.S]: "Small",
      [Status.M]: "Medium",
      [Status.L]: "Large",
      [Status.XL]: "Extra large",
      [Status.XXL]: "Extra extra large",
    };

    public static list = () =>
      Object.values(Status).filter(
        (item) => typeof item === "number"
      ) as Array<Status>;

    public static text = (status: Status) => {
      return State.TEXT[status];
    };
  }
}

export default ShoeSize;
