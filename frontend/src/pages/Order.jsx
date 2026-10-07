import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  DISPATCH_ACTION,
  PayPalButtons,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { CheckCircle2, Clock, PackageCheck, Truck } from "lucide-react";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Spinner, { PageSpinner } from "../components/ui/Spinner";
import OrderSummary from "../components/shop/OrderSummary";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../store/ordersApi";
import { errMsg, money, shortDate, shortId } from "../lib/format";
import { cn } from "../lib/utils";

function Timeline({ order }) {
  const steps = [
    { label: "Order placed", date: order.createdAt, done: true, icon: CheckCircle2 },
    { label: "Paid", date: order.paidAt, done: order.isPaid, icon: Clock },
    { label: "Shipped", date: order.deliveredAt, done: order.isDelivered, icon: Truck },
  ];
  return (
    <ol className="grid grid-cols-3 gap-2">
      {steps.map(({ label, date, done, icon: Icon }) => (
        <li key={label} className="flex flex-col items-center gap-1.5 text-center">
          <span
            className={cn(
              "grid size-10 place-items-center rounded-full border-2",
              done ? "border-ok bg-ok-soft text-ok" : "border-border text-subtle",
            )}>
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span className={cn("text-sm font-semibold", !done && "text-muted")}>{label}</span>
          <span className="text-xs text-muted">{done ? shortDate(date) : "Pending"}</span>
        </li>
      ))}
    </ol>
  );
}

function PayPalCheckout({ order }) {
  const { data: config, isLoading } = useGetPaypalClientIdQuery();
  const [{ isPending, isRejected }, paypalDispatch] = usePayPalScriptReducer();
  const [payOrder, { isLoading: paying }] = usePayOrderMutation();

  useEffect(() => {
    if (!config?.clientId) return;
    paypalDispatch({ type: DISPATCH_ACTION.RESET_OPTIONS, value: { clientId: config.clientId, currency: "USD" } });
    paypalDispatch({ type: DISPATCH_ACTION.LOADING_STATUS, value: SCRIPT_LOADING_STATE.PENDING });
  }, [config?.clientId, paypalDispatch]);

  if (isLoading) return <Spinner className="mx-auto" />;
  if (!config?.clientId) return <Alert tone="warning">PayPal isn't configured on this server yet.</Alert>;
  if (isRejected) return <Alert tone="error">Couldn't load PayPal. Check your connection and refresh.</Alert>;

  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-lg bg-surface-2 px-3 py-2 text-xs text-muted">
        This shop runs in PayPal's <strong>sandbox</strong>: use a PayPal sandbox test account — no real money moves.
      </p>
      {isPending || paying ? (
        <div className="grid place-items-center py-6 text-muted">
          <Spinner />
        </div>
      ) : (
        <PayPalButtons
          style={{ layout: "vertical", shape: "pill" }}
          createOrder={(data, actions) =>
            actions.order.create({ purchase_units: [{ amount: { value: order.totalPrice.toFixed(2), currency_code: "USD" } }] })
          }
          onApprove={async (data, actions) => {
            const details = await actions.order.capture();
            try {
              await payOrder({ orderId: order._id, details }).unwrap();
              toast.success("Payment received — thank you!");
            } catch (err) {
              toast.error(errMsg(err));
            }
          }}
          onError={(err) => toast.error(err?.message ?? "PayPal error")}
        />
      )}
    </div>
  );
}

export default function Order() {
  const { id } = useParams();
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(id);
  const user = useSelector((s) => s.auth.userInfo);
  const [deliver, { isLoading: delivering }] = useDeliverOrderMutation();

  if (isLoading) return <PageSpinner />;
  if (error) return <Alert tone="error">{errMsg(error)}</Alert>;

  const a = order.shippingAddress;
  return (
    <>
      <title>{`Order ${shortId(order._id)} — Tune Shed Music`}</title>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-1.5">Order {shortId(order._id)}</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {order.isDelivered ? "On its way to you" : order.isPaid ? "Thanks for your order!" : "Almost there — time to pay"}
          </h1>
          <p className="mt-1 text-sm text-muted">Placed {shortDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-4">
          <section className="card p-5 sm:p-6">
            <Timeline order={order} />
          </section>

          <section className="card grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <h2 className="font-semibold">Shipping to</h2>
              <p className="mt-2 text-sm text-muted">
                {order.user.name}
                <br />
                {a.address}
                <br />
                {a.city} {a.postalCode}, {a.country}
              </p>
            </div>
            <div>
              <h2 className="font-semibold">Payment</h2>
              <p className="mt-2 text-sm text-muted">{order.paymentMethod}</p>
              {order.isPaid ? (
                <p className="mt-1 text-sm font-medium text-ok">Paid {shortDate(order.paidAt)}</p>
              ) : (
                <p className="mt-1 text-sm font-medium text-warn">Awaiting payment</p>
              )}
            </div>
          </section>

          <section className="card p-5 sm:p-6">
            <h2 className="font-semibold">Items</h2>
            <ul className="mt-3 divide-y divide-border">
              {order.orderItems.map((item) => (
                <li key={item._id} className="flex items-center gap-4 py-3">
                  <img src={item.image} alt="" className="size-14 rounded-lg border border-border object-cover" />
                  <Link to={`/product/${item.product}`} className="min-w-0 flex-1 truncate text-sm font-medium hover:text-accent">
                    {item.name}
                  </Link>
                  <p className="text-sm whitespace-nowrap text-muted tabular-nums">
                    {item.qty} × {money(item.price)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <OrderSummary prices={order} title="Summary">
          {!order.isPaid && String(order.user._id) === String(user._id) && <PayPalCheckout order={order} />}
          {user.isAdmin && order.isPaid && !order.isDelivered && (
            <Button className="w-full rounded-full" onClick={() => deliver(order._id).unwrap().catch((e) => toast.error(errMsg(e)))} loading={delivering}>
              <PackageCheck /> Mark as shipped
            </Button>
          )}
        </OrderSummary>
      </div>
    </>
  );
}
