import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Trash2 } from "lucide-react";
import Button from "../components/ui/Button";
import Empty from "../components/ui/Empty";
import PageHeader from "../components/ui/PageHeader";
import OrderSummary from "../components/shop/OrderSummary";
import { addToCart, removeFromCart, selectCartPrices } from "../store/cartSlice";
import { money } from "../lib/format";

export default function Cart() {
  const { cartItems } = useSelector((s) => s.cart);
  const prices = useSelector(selectCartPrices);
  const user = useSelector((s) => s.auth.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (cartItems.length === 0)
    return (
      <>
        <title>Your cart — Tune Shed Music</title>
        <Empty
          icon={ShoppingCart}
          title="Your cart is empty"
          message="The perfect guitar is out there. Let's go find it."
          action={
            <Button as={Link} to="/#shop">
              Browse guitars
            </Button>
          }
        />
      </>
    );

  return (
    <>
      <title>Your cart — Tune Shed Music</title>
      <PageHeader eyebrow="Checkout" title="Your cart" />
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        <ul className="card divide-y divide-border">
          {cartItems.map((item) => (
            <li key={item._id} className="flex gap-4 p-4 sm:p-5">
              <Link to={`/product/${item._id}`} className="shrink-0">
                <img src={item.image} alt="" className="size-20 rounded-xl border border-border object-cover sm:size-24" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-wider text-muted uppercase">{item.brand}</p>
                  <Link to={`/product/${item._id}`} className="line-clamp-2 font-medium hover:text-accent">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{money(item.price)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="sr-only" htmlFor={`qty-${item._id}`}>
                    Quantity
                  </label>
                  <select
                    id={`qty-${item._id}`}
                    value={item.qty}
                    onChange={(e) => dispatch(addToCart({ ...item, qty: Number(e.target.value) }))}
                    className="field h-9 w-20 py-0">
                    {Array.from({ length: Math.max(1, item.countInStock) }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <p className="w-24 text-right font-semibold tabular-nums">{money(item.price * item.qty)}</p>
                  <button
                    type="button"
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="rounded-lg p-2 text-muted hover:bg-danger-soft hover:text-danger"
                    aria-label={`Remove ${item.name}`}>
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <OrderSummary prices={prices}>
          <Button size="lg" className="w-full rounded-full" onClick={() => navigate(user ? "/shipping" : "/login?redirect=/shipping")}>
            Checkout
          </Button>
          <Link to="/#shop" className="text-center text-sm font-medium text-muted hover:text-fg">
            Keep shopping
          </Link>
        </OrderSummary>
      </div>
    </>
  );
}
