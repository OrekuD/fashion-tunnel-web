namespace ProductGender {
  export enum Status {
    WOMEN = 0,
    MEN = 1,
    UNISEX = 2,
  }

  export class State {
    private static TEXT: Record<Status, string> = {
      [Status.WOMEN]: "Women",
      [Status.MEN]: "Men",
      [Status.UNISEX]: "Unisex",
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

export default ProductGender;
