namespace ProductCategories {
  export enum Status {
    TSHIRT = 0,
    SHOES = 1,
    HOODIE = 2,
    DRESSES = 3,
    TROUSERS = 4,
    JACKET = 5,
  }

  export class State {
    private static TEXT: Record<Status, string> = {
      [Status.TSHIRT]: "T-Shirt",
      [Status.SHOES]: "Shoes",
      [Status.HOODIE]: "Hoodie",
      [Status.DRESSES]: "Dresses",
      [Status.TROUSERS]: "Trousers",
      [Status.JACKET]: "Jacket",
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

export default ProductCategories;
