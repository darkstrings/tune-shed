import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { CreditCard } from "lucide-react";
import Button from "../components/ui/Button";
import CheckoutSteps from "../components/shop/CheckoutSteps";
import { savePaymentMethod } from "../store/cartSlice";

export default function Payment() {
  const { shippingAddress, paymentMethod: saved } = useSelector((s) => s.cart);
  const [method, setMethod] = useState(saved || "PayPal");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!shippingAddress.address) return <Navigate to="/shipping" replace />;

  function submit(e) {
    e.preventDefault();
    dispatch(savePaymentMethod(method));
    navigate("/placeorder");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <title>Payment — Tune Shed Music</title>
      <CheckoutSteps current={2} />
      <h1 className="font-display text-3xl font-semibold tracking-tight">How would you like to pay?</h1>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">Payment method</legend>
          <label className="card flex cursor-pointer items-center gap-4 p-5 has-checked:border-accent has-checked:bg-accent-soft">
            <input
              type="radio"
              name="method"
              value="PayPal"
              checked={method === "PayPal"}
              onChange={(e) => setMethod(e.target.value)}
              className="size-4 accent-[var(--accent)]"
            />
            <CreditCard className="size-6 text-accent" aria-hidden="true" />
            <span>
              <span className="block font-semibold">PayPal or credit card</span>
              <span className="block text-sm text-muted">You'll pay securely through PayPal after placing the order.</span>
            </span>
          </label>
        </fieldset>
        <Button type="submit" size="lg" className="mt-2 rounded-full sm:self-end">
          Review order
        </Button>
      </form>
    </div>
  );
}
