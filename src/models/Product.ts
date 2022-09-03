import ProductCategories from "../namespace/ProductCategories";
import ProductGender from "../namespace/ProductGender";
import { SizeType } from "../types";

export default interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  productQuantity: number;
  extraInfo: string;
  gender: ProductGender.Status;
  productCategory: ProductCategories.Status;
  sizeType: SizeType;
  images: Array<string>;
}
