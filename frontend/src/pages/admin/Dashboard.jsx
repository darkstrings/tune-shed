import { Link } from "react-router";
import { AlertTriangle, DollarSign, Package, ShoppingBag, Truck, Users } from "lucide-react";
import AdminNav from "../../components/layout/AdminNav";
import PageHeader from "../../components/ui/PageHeader";
import Alert from "../../components/ui/Alert";
import { PageSpinner } from "../../components/ui/Spinner";
import { useGetOrdersQuery, useGetSummaryQuery } from "../../store/ordersApi";
import OrderStatus from "../../components/shop/OrderStatus";
import { errMsg, money, shortDate, shortId } from "../../lib/format";

function Stat({ icon: Icon, label, value, hint, to }) {
  const body = (
    <>
      <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold tracking-wider text-muted uppercase">{label}</span>
        <span className="block font-display text-3xl font-semibold tabular-nums">{value}</span>
        {hint && <span className="block truncate text-xs text-subtle">{hint}</span>}
      </span>
    </>
  );
  const cls = "card flex items-center gap-4 p-5";
  return to ? (
    <Link to={to} className={`${cls} transition-colors hover:border-border-strong`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export default function Dashboard() {
  const { data: s, isLoading, error } = useGetSummaryQuery();
  const { data: orders = [] } = useGetOrdersQuery();

  return (
    <>
      <title>Admin — Tune Shed Music</title>
      <AdminNav />
      <PageHeader eyebrow="Admin" title="Store overview" />
      {isLoading ? (
        <PageSpinner />
      ) : error ? (
        <Alert tone="error">{errMsg(error)}</Alert>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat icon={DollarSign} label="Revenue" value={money(s.revenue)} hint={`from ${s.paidOrders} paid orders`} />
            <Stat icon={Truck} label="To ship" value={s.toShip} hint="paid, not yet shipped" to="/admin/orders?status=to-ship" />
            <Stat icon={Package} label="Products" value={s.products} hint={`${s.lowStock.length} low on stock`} to="/admin/products" />
            <Stat icon={Users} label="Accounts" value={s.users} to="/admin/users" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <section className="card p-5 sm:p-6" aria-labelledby="recent-title">
              <div className="flex items-center justify-between">
                <h2 id="recent-title" className="font-display text-xl font-semibold">
                  Recent orders
                </h2>
                <Link to="/admin/orders" className="text-sm font-medium text-accent hover:underline">
                  View all
                </Link>
              </div>
              {orders.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted">
                  <ShoppingBag className="mx-auto mb-2 size-6" aria-hidden="true" />
                  No orders yet.
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-border">
                  {orders.slice(0, 6).map((o) => (
                    <li key={o._id}>
                      <Link to={`/order/${o._id}`} className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 hover:bg-surface-2">
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold">
                            {shortId(o._id)} · {o.user?.name ?? "Deleted user"}
                          </span>
                          <span className="block text-xs text-muted">{shortDate(o.createdAt)}</span>
                        </span>
                        <span className="text-sm font-semibold tabular-nums">{money(o.totalPrice)}</span>
                        <OrderStatus order={o} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card p-5 sm:p-6" aria-labelledby="stock-title">
              <h2 id="stock-title" className="flex items-center gap-2 font-display text-xl font-semibold">
                <AlertTriangle className="size-5 text-warn" aria-hidden="true" /> Low stock
              </h2>
              {s.lowStock.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted">Everything's well stocked.</p>
              ) : (
                <ul className="mt-3 divide-y divide-border">
                  {s.lowStock.map((p) => (
                    <li key={p._id}>
                      <Link to={`/admin/product/${p._id}/edit`} className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-surface-2">
                        <img src={p.image} alt="" className="size-10 rounded-lg border border-border object-cover" />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.name}</span>
                        <span className={p.countInStock === 0 ? "text-sm font-semibold text-danger" : "text-sm font-semibold text-warn"}>
                          {p.countInStock === 0 ? "Sold out" : `${p.countInStock} left`}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
