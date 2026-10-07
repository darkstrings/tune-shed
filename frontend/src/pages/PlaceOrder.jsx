import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import Button from "../components/ui/Button";
import CheckoutSteps from "../components/shop/CheckoutSteps";
import OrderSummary from "../components/shop/OrderSummary";
import { useCreateOrderMutation } from "../store/ordersApi";
import { clearCartItems, selectCartPrices } from "../store/cartSlice";
import { errMsg, money } from "../lib/format";

export default function PlaceOrder() {
  const cart = useSelector((s) => s.cart);
  const prices = useSelector(selectCartPrices);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);

  // After placing, the cart empties; don't bounce back to /cart while we navigate away.
  if (cart.cartItems.length === 0 && !placed) return <Navigate to="/cart" replace />;
  if (!cart.shippingAddress.address) return <Navigate to="/shipping" replace />;

  async function place() {
    try {
      const order = await createOrder({
        orderItems: cart.cartItems.map(({ _id, qty }) => ({ _id, qty })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
      }).unwrap();
      setPlaced(true);
      navigate(`/order/${order._id}`, { replace: true });
      dispatch(clearCartItems());
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  const a = cart.shippingAddress;
  return (
    <>
      <title>Review order — Tune Shed Music</title>
      <CheckoutSteps current={3} />
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-4">
          <section className="card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Ship to</h2>
              <Link to="/shipping" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                <Pencil className="size-3.5" /> Edit
              </Link>
            </div>
            <p className="mt-2 text-sm text-muted">
              {a.address}, {a.city} {a.postalCode}, {a.country}
            </p>
          </section>
          <section className="card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Payment</h2>
              <Link to="/payment" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                <Pencil className="size-3.5" /> Edit
              </Link>
            </div>
            <p className="mt-2 text-sm text-muted">{cart.paymentMethod}</p>
          </section>
          <section className="card p-5 sm:p-6">
            <h2 className="font-semibold">Items</h2>
            <ul className="mt-3 divide-y divide-border">
              {cart.cartItems.map((item) => (
                <li key={item._id} className="flex items-center gap-4 py-3">
                  <img src={item.image} alt="" className="size-14 rounded-lg border border-border object-cover" />
                  <Link to={`/product/${item._id}`} className="min-w-0 flex-1 truncate text-sm font-medium hover:text-accent">
                    {item.name}
                  </Link>
                  <p className="text-sm whitespace-nowrap text-muted tabular-nums">
                    {item.qty} × {money(item.price)} = <span className="font-semibold text-fg">{money(item.qty * item.price)}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <OrderSummary prices={prices}>
          <Button size="lg" className="w-full rounded-full" onClick={place} loading={isLoading}>
            Place order
          </Button>
          <p className="text-center text-xs text-muted">Final prices are confirmed by the server when you place the order.</p>
        </OrderSummary>
      </div>
    </>
  );
}
