const round2 = (n) => Math.round(n * 100) / 100;

/** Server-side price calculation. Works in cents to avoid floating point drift. */
export function calcPrices(orderItems) {
  const itemsCents = orderItems.reduce((acc, item) => acc + Math.round(item.price * 100) * item.qty, 0);
  const itemsPrice = itemsCents / 100;
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice: round2(itemsPrice), shippingPrice, taxPrice, totalPrice };
}
