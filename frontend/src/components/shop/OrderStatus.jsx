import Badge from "../ui/Badge";

export default function OrderStatus({ order }) {
  if (order.isDelivered) return <Badge tone="green">Shipped</Badge>;
  if (order.isPaid) return <Badge tone="blue">Paid</Badge>;
  return <Badge tone="yellow">Awaiting payment</Badge>;
}
