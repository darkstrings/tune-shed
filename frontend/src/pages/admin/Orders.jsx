import { Link, useSearchParams } from "react-router";
import AdminNav from "../../components/layout/AdminNav";
import PageHeader from "../../components/ui/PageHeader";
import Alert from "../../components/ui/Alert";
import Empty from "../../components/ui/Empty";
import { PageSpinner } from "../../components/ui/Spinner";
import OrderStatus from "../../components/shop/OrderStatus";
import { useGetOrdersQuery } from "../../store/ordersApi";
import { errMsg, money, shortDate, shortId } from "../../lib/format";
import { cn } from "../../lib/utils";

const FILTERS = [
  { value: "all", label: "All", test: () => true },
  { value: "unpaid", label: "Awaiting payment", test: (o) => !o.isPaid },
  { value: "to-ship", label: "To ship", test: (o) => o.isPaid && !o.isDelivered },
  { value: "shipped", label: "Shipped", test: (o) => o.isDelivered },
];

export default function Orders() {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();
  const [params, setParams] = useSearchParams();
  const status = params.get("status") ?? "all";
  const filter = FILTERS.find((f) => f.value === status) ?? FILTERS[0];
  const visible = orders.filter(filter.test);

  return (
    <>
      <title>Orders — Admin — Tune Shed Music</title>
      <AdminNav />
      <PageHeader eyebrow="Admin" title="Orders" description={`${orders.length} orders in total`} />
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter orders">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={f.value === filter.value}
            onClick={() => setParams(f.value === "all" ? {} : { status: f.value })}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium",
              f.value === filter.value ? "border-fg bg-fg text-bg" : "border-border text-muted hover:text-fg",
            )}>
            {f.label} <span className="opacity-60">{orders.filter(f.test).length}</span>
          </button>
        ))}
      </div>
      {isLoading ? (
        <PageSpinner />
      ) : error ? (
        <Alert tone="error">{errMsg(error)}</Alert>
      ) : visible.length === 0 ? (
        <Empty title="No orders here" message="Nothing matches this filter." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-border text-xs tracking-wider text-muted uppercase">
              <tr>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 text-right font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((o) => (
                <tr key={o._id} className="hover:bg-surface-2/60">
                  <td className="px-5 py-3.5">
                    <Link to={`/order/${o._id}`} className="font-semibold hover:text-accent">
                      {shortId(o._id)}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">{o.user?.name ?? <span className="text-muted">Deleted user</span>}</td>
                  <td className="px-5 py-3.5 text-muted">{shortDate(o.createdAt)}</td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{money(o.totalPrice)}</td>
                  <td className="px-5 py-3.5">
                    <OrderStatus order={o} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
