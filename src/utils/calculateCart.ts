import { CartProduct } from "./../types";
export const calculateCart = (
  products: Array<CartProduct>,
  discountPercentage: number
): { total: number; subtotal: number; discount: number } => {
  if (products.length === 0) return { total: 0, discount: 0, subtotal: 0 };

  const subtotal = products.reduce(
    (sum, item) => sum + item.count * item.count,
    0
  );
  const discount = subtotal * discountPercentage;
  const total = subtotal - discount;

  return { total, discount, subtotal };
};
