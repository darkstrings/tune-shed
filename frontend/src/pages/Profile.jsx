import { useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import OrderStatus from "../components/shop/OrderStatus";
import Alert from "../components/ui/Alert";
import Spinner from "../components/ui/Spinner";
import PageHeader from "../components/ui/PageHeader";
import { useProfileMutation } from "../store/usersApi";
import { useGetMyOrdersQuery } from "../store/ordersApi";
import { setCredentials } from "../store/authSlice";
import { errMsg, money, shortDate, shortId } from "../lib/format";

function ProfileForm({ user }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, password: "", confirm: "" });
  const [updateProfile, { isLoading }] = useProfileMutation();
  const dispatch = useDispatch();
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (form.password && form.password.length < 8) return toast.error("Password must be at least 8 characters.");
    if (form.password !== form.confirm) return toast.error("Passwords don't match.");
    try {
      const res = await updateProfile({ name: form.name, email: form.email, password: form.password || undefined }).unwrap();
      dispatch(setCredentials(res));
      setForm((f) => ({ ...f, password: "", confirm: "" }));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  return (
    <form onSubmit={submit} className="card flex flex-col gap-4 p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold">Your details</h2>
      {user.isDemo && <Alert tone="info">Demo accounts can't change their details.</Alert>}
      <Field label="Name">
        <input className="field" required value={form.name} onChange={update("name")} disabled={user.isDemo} />
      </Field>
      <Field label="Email">
        <input type="email" className="field" required value={form.email} onChange={update("email")} disabled={user.isDemo} />
      </Field>
      <Field label="New password" hint="Leave blank to keep your current password">
        <input type="password" autoComplete="new-password" className="field" value={form.password} onChange={update("password")} disabled={user.isDemo} />
      </Field>
      <Field label="Confirm new password">
        <input type="password" autoComplete="new-password" className="field" value={form.confirm} onChange={update("confirm")} disabled={user.isDemo} />
      </Field>
      <Button type="submit" loading={isLoading} disabled={user.isDemo} className="self-start">
        Save changes
      </Button>
    </form>
  );
}

export default function Profile() {
  const user = useSelector((s) => s.auth.userInfo);
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <>
      <title>Your account — Tune Shed Music</title>
      <PageHeader eyebrow="Account" title={`Hey, ${user.name.split(" ")[0]}`} />
      <div className="grid items-start gap-8 lg:grid-cols-[22rem_1fr]">
        <ProfileForm key={user._id + user.name + user.email} user={user} />

        <section className="card p-5 sm:p-6" aria-labelledby="orders-title">
          <h2 id="orders-title" className="font-display text-xl font-semibold">
            Your orders
          </h2>
          {isLoading ? (
            <div className="grid place-items-center py-10 text-muted">
              <Spinner />
            </div>
          ) : error ? (
            <Alert tone="error" className="mt-4">
              {errMsg(error)}
            </Alert>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center text-muted">
              <ShoppingBag className="size-8" aria-hidden="true" />
              <p>No orders yet.</p>
              <Button as={Link} to="/#shop" variant="secondary" size="sm">
                Start shopping
              </Button>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {orders.map((o) => (
                <li key={o._id}>
                  <Link to={`/order/${o._id}`} className="-mx-2 flex items-center gap-4 rounded-lg px-2 py-3 hover:bg-surface-2">
                    <div className="flex -space-x-3">
                      {o.orderItems.slice(0, 3).map((i) => (
                        <img key={i._id} src={i.image} alt="" className="size-11 rounded-lg border-2 border-surface object-cover" />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{shortId(o._id)}</p>
                      <p className="truncate text-xs text-muted">
                        {shortDate(o.createdAt)} · {o.orderItems.length} item{o.orderItems.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold tabular-nums">{money(o.totalPrice)}</span>
                      <OrderStatus order={o} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
