import { Link } from "react-router";
import { ConditionBadge } from "../ui/Badge";
import Stars from "../ui/Stars";
import { money } from "../../lib/format";

export default function ProductCard({ product }) {
  const soldOut = product.countInStock === 0;
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-border bg-surface-2">
        <img
          src={product.image}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <ConditionBadge condition={product.condition} className="shadow-sm dark:bg-black/75" />
          {soldOut && <span className="rounded-full bg-fg px-2.5 py-0.5 text-xs font-semibold text-bg">Sold out</span>}
        </div>
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1 px-0.5">
        <p className="text-xs font-semibold tracking-wider text-muted uppercase">{product.brand}</p>
        <h3 className="line-clamp-2 font-medium">
          <Link to={`/product/${product._id}`} className="after:absolute after:inset-0 hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <Stars value={product.rating} count={product.numReviews} size="size-3.5" />
        <p className="mt-auto pt-1 font-display text-xl font-semibold tabular-nums">{money(product.price)}</p>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="aspect-[4/5] rounded-card bg-surface-2" />
      <div className="mt-3 h-3 w-1/3 rounded bg-surface-2" />
      <div className="mt-2 h-4 w-3/4 rounded bg-surface-2" />
      <div className="mt-3 h-5 w-1/4 rounded bg-surface-2" />
    </div>
  );
}
