export default interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  productQuantity: number;
  extraInfo: string;
  sizeType: "cloth" | "shoe";
}
