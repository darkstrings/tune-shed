import { money } from "../../lib/format";
import { FREE_SHIPPING_OVER } from "../../lib/prices";

export default function OrderSummary({ prices, children, title = "Order summary" }) {
  const row = "flex justify-between text-sm";
  const toFree = FREE_SHIPPING_OVER - prices.itemsPrice;
  return (
    <aside className="card flex flex-col gap-4 p-5 sm:p-6 lg:sticky lg:top-24" aria-label={title}>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <dl className="flex flex-col gap-2.5">
        <div className={row}>
          <dt className="text-muted">Items</dt>
          <dd className="tabular-nums">{money(prices.itemsPrice)}</dd>
        </div>
        <div className={row}>
          <dt className="text-muted">Shipping</dt>
          <dd className="tabular-nums">{prices.shippingPrice ? money(prices.shippingPrice) : "Free"}</dd>
        </div>
        <div className={row}>
          <dt className="text-muted">Tax (15%)</dt>
          <dd className="tabular-nums">{money(prices.taxPrice)}</dd>
        </div>
        <div className="mt-1 flex justify-between border-t border-border pt-3 text-lg font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">{money(prices.totalPrice)}</dd>
        </div>
      </dl>
      {prices.itemsPrice > 0 && toFree > 0 && (
        <p className="rounded-lg bg-surface-2 px-3 py-2 text-xs text-muted">
          Add {money(toFree)} more for free shipping.
        </p>
      )}
      {children}
    </aside>
  );
}
