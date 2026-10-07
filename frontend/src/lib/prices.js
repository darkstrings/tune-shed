// Mirrors backend/utils/calcPrices.js so the cart shows the same totals the server will charge.
const round2 = (n) => Math.round(n * 100) / 100;

export const FREE_SHIPPING_OVER = 100;
export const TAX_RATE = 0.15;

export function calcPrices(items) {
  const itemsPrice = items.reduce((acc, i) => acc + Math.round(i.price * 100) * i.qty, 0) / 100;
  const shippingPrice = items.length === 0 || itemsPrice > FREE_SHIPPING_OVER ? 0 : 10;
  const taxPrice = round2(TAX_RATE * itemsPrice);
  return { itemsPrice: round2(itemsPrice), shippingPrice, taxPrice, totalPrice: round2(itemsPrice + shippingPrice + taxPrice) };
}
