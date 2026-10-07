import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ArrowLeft, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Stars, { StarInput } from "../components/ui/Stars";
import { ConditionBadge } from "../components/ui/Badge";
import { PageSpinner } from "../components/ui/Spinner";
import { useCreateReviewMutation, useGetProductDetailsQuery } from "../store/productsApi";
import { addToCart } from "../store/cartSlice";
import { errMsg, money, shortDate } from "../lib/format";

function QtyStepper({ value, max, onChange }) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-surface">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="grid size-10 place-items-center rounded-full text-muted hover:text-fg disabled:opacity-40"
        aria-label="Decrease quantity">
        <Minus className="size-4" />
      </button>
      <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="grid size-10 place-items-center rounded-full text-muted hover:text-fg disabled:opacity-40"
        aria-label="Increase quantity">
        <Plus className="size-4" />
      </button>
    </div>
  );
}

function Reviews({ product }) {
  const user = useSelector((s) => s.auth.userInfo);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const alreadyReviewed = user && product.reviews.some((r) => r.user === user._id);

  async function submit(e) {
    e.preventDefault();
    if (!rating) return toast.error("Pick a star rating first.");
    try {
      await createReview({ productId: product._id, rating, comment }).unwrap();
      toast.success("Thanks for the review!");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  return (
    <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr]" aria-labelledby="reviews-title">
      <div>
        <h2 id="reviews-title" className="font-display text-2xl font-semibold">
          Player reviews
        </h2>
        <div className="mt-3 flex items-center gap-3">
          <span className="font-display text-5xl font-semibold">{product.rating.toFixed(1)}</span>
          <Stars value={product.rating} count={product.numReviews} />
        </div>

        <div className="card mt-6 p-5">
          <h3 className="font-semibold">Write a review</h3>
          {!user ? (
            <p className="mt-2 text-sm text-muted">
              <Link to={`/login?redirect=/product/${product._id}`} className="font-semibold text-accent hover:underline">
                Sign in
              </Link>{" "}
              to share your thoughts.
            </p>
          ) : alreadyReviewed ? (
            <p className="mt-2 text-sm text-muted">You've already reviewed this one. Thanks!</p>
          ) : (
            <form onSubmit={submit} className="mt-3 flex flex-col gap-3">
              <StarInput value={rating} onChange={setRating} />
              <label className="flex flex-col gap-1.5">
                <span className="label">Your review</span>
                <textarea
                  required
                  rows={4}
                  maxLength={2000}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="field"
                  placeholder="How does it play? How's the tone?"
                />
              </label>
              <Button type="submit" loading={isLoading} className="self-start">
                Post review
              </Button>
            </form>
          )}
        </div>
      </div>

      <div>
        {product.reviews.length === 0 ? (
          <p className="text-muted">No reviews yet — be the first.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {product.reviews
              .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
              .map((r) => (
                <li key={r._id} className="py-5 first:pt-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{r.name}</p>
                    <time className="text-xs text-muted" dateTime={r.createdAt}>
                      {shortDate(r.createdAt)}
                    </time>
                  </div>
                  <Stars value={r.rating} size="size-3.5" className="mt-1" />
                  <p className="mt-2 text-sm leading-relaxed text-muted">{r.comment}</p>
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function Product() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetProductDetailsQuery(id);
  const [qty, setQty] = useState(1);

  if (isLoading) return <PageSpinner />;
  if (error)
    return (
      <Alert tone="error">
        {errMsg(error)}{" "}
        <Link to="/" className="font-semibold underline">
          Back to the shop
        </Link>
      </Alert>
    );

  const inStock = product.countInStock > 0;

  function add(goToCart) {
    dispatch(addToCart({ ...product, qty }));
    if (goToCart) navigate("/cart");
    else toast.success(`${product.name} added to your cart`, { action: { label: "View cart", onClick: () => navigate("/cart") } });
  }

  return (
    <>
      <title>{`${product.name} — Tune Shed Music`}</title>
      <meta name="description" content={product.description.slice(0, 155)} />
      <Link to="/#shop" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Back to the shop
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="overflow-hidden rounded-card border border-border bg-surface-2 lg:sticky lg:top-24 lg:self-start">
          <img src={product.image} alt={product.name} className="max-h-[78vh] w-full object-contain" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-muted uppercase">{product.brand}</span>
            <span className="text-subtle">·</span>
            <span className="text-xs font-semibold tracking-wider text-muted uppercase">{product.category}</span>
          </div>
          <h1 className="mt-2 font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
          <a href="#reviews-title" className="mt-3 inline-block">
            <Stars value={product.rating} count={product.numReviews} />
          </a>

          <div className="mt-6 flex items-center gap-4">
            <p className="font-display text-4xl font-semibold tabular-nums">{money(product.price)}</p>
            <ConditionBadge condition={product.condition} className="text-sm" />
          </div>

          <div className="card mt-6 flex flex-col gap-5 p-5">
            <p className={inStock ? "text-sm font-medium text-ok" : "text-sm font-medium text-danger"}>
              {inStock
                ? product.countInStock === 1
                  ? "Only one left — it's a one-off."
                  : `In stock · ${product.countInStock} available`
                : "Sold out"}
            </p>
            {inStock && (
              <div className="flex flex-wrap items-center gap-3">
                {product.countInStock > 1 && <QtyStepper value={qty} max={product.countInStock} onChange={setQty} />}
                <Button size="lg" className="flex-1 rounded-full" onClick={() => add(false)}>
                  <ShoppingCart /> Add to cart
                </Button>
                <Button size="lg" variant="secondary" className="rounded-full" onClick={() => add(true)}>
                  Buy now
                </Button>
              </div>
            )}
            <ul className="grid gap-2 border-t border-border pt-4 text-sm text-muted sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-accent" aria-hidden="true" /> Free shipping over $100
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-accent" aria-hidden="true" /> Secure PayPal checkout
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="font-semibold">About this instrument</h2>
            <p className="mt-2 leading-relaxed whitespace-pre-line text-muted">{product.description}</p>
          </div>
        </div>
      </div>

      <Reviews product={product} />
    </>
  );
}
