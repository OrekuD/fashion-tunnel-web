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
