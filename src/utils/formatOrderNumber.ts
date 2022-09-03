const formatOrderNumber = (order: string, width: number) =>
  order.length >= width
    ? order
    : (new Array(width).join('0') + order).slice(-width);

export default formatOrderNumber;
