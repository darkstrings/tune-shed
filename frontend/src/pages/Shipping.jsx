import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import CheckoutSteps from "../components/shop/CheckoutSteps";
import { saveShippingAddress } from "../store/cartSlice";

export default function Shipping() {
  const { shippingAddress, cartItems } = useSelector((s) => s.cart);
  const [form, setForm] = useState({
    address: shippingAddress.address ?? "",
    city: shippingAddress.city ?? "",
    postalCode: shippingAddress.postalCode ?? "",
    country: shippingAddress.country ?? "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (cartItems.length === 0) return <Navigate to="/cart" replace />;

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    dispatch(saveShippingAddress(Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]))));
    navigate("/payment");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <title>Shipping — Tune Shed Music</title>
      <CheckoutSteps current={1} />
      <h1 className="font-display text-3xl font-semibold tracking-tight">Where should we ship it?</h1>
      <p className="mt-1 text-sm text-muted">Guitars ship in a hard case or a double-boxed gig bag.</p>
      <form onSubmit={submit} className="card mt-6 flex flex-col gap-4 p-5 sm:p-6">
        <Field label="Street address">
          <input className="field" autoComplete="street-address" required value={form.address} onChange={update("address")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City">
            <input className="field" autoComplete="address-level2" required value={form.city} onChange={update("city")} />
          </Field>
          <Field label="Postal code">
            <input className="field" autoComplete="postal-code" required value={form.postalCode} onChange={update("postalCode")} />
          </Field>
        </div>
        <Field label="Country">
          <input className="field" autoComplete="country-name" required value={form.country} onChange={update("country")} />
        </Field>
        <Button type="submit" size="lg" className="mt-2 rounded-full sm:self-end">
          Continue to payment
        </Button>
      </form>
    </div>
  );
}
