import moment from "moment";
import Product from "./models/Product";
import ClothSizes from "./namespace/ClothSizes";
import OrderStatus from "./namespace/OrderStatus";
import ProductCategories from "./namespace/ProductCategories";
import ProductGender from "./namespace/ProductGender";
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

export interface DetailedOrderProduct {
  id: string;
  price: number;
  count: number;
  total: number;
  name: string;
  description: string;
  extraInfo: string;
  gender: ProductGender.Status;
  productQuantity: number;
  images: Array<string>;
  sizeType: SizeType;
  productCategory: ProductCategories.Status;
}

export interface OrderProduct {
  id: string;
  price: number;
  count: number;
  total: number;
}

export enum Events {
  USER_ADDRESS_CREATE = "user:address:create",
  USER_ORDER_CREATE = "user:order:create",
  USER_PROFILE_UPDATE = "user:profile:update",
  USER_FAVOURITE_ITEM = "user:favourite:item",
  ORDER_STATUS_CHANGE = "order:status:change",
}

export interface OrderStatusTimeStamp {
  status: OrderStatus.Status;
  time: string;
}
