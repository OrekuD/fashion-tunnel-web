import moment from "moment";
import Product from "./models/Product";
import ClothSizes from "./namespace/ClothSizes";
import ShoeSize from "./namespace/ShoeSizes";

export class DeviceTypes {
  static readonly ANDROID = "android";
  static readonly IOS = "ios";
  static readonly WEB = "web";
}

export interface CartProduct extends Product {
  count: number;
  total: number;
  size: ClothSizes.Status | ShoeSize.Status;
}

export type SizeType = "cloth" | "shoe";

export namespace Request {
  export enum Status {
    PENDING = "pending",
    BEFORE_FULFILLED = "before-fulfilled",
    FULFILLED = "fulfilled",
    BEFORE_REJECTED = "before-rejected",
    REJECTED = "rejected",
  }

  export interface Payload {
    [key: string]: string | number | boolean | object;
  }

  export interface Info {
    name: string;
    status: Status;
    message: string;
    payload: Payload;
  }

  export interface State {
    updatedAt: number;
    list: Array<Info>;
  }
}

export class Timing {
  public static now = () => moment().valueOf();
}
