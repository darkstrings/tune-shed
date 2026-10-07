import { Link } from "react-router";
import { ArrowRight, ShieldCheck, Truck, Wrench } from "lucide-react";
import { useGetTopProductsQuery } from "../../store/productsApi";
import { money } from "../../lib/format";
import Stars from "../ui/Stars";

export default function Hero() {
  const { data: top = [] } = useGetTopProductsQuery();
  const [featured, ...rest] = top;

  return (
    <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
      <div>
        <p className="eyebrow">New · Used · Vintage</p>
        <h1 className="mt-3 font-display text-5xl leading-[1.02] font-semibold tracking-tight sm:text-6xl">
          Guitars with <em className="text-accent">stories</em> worth playing.
        </h1>
        <p className="mt-5 max-w-lg text-lg text-muted">
          From played-in vintage acoustics to fresh-off-the-line shredders — every instrument at Tune Shed is
          inspected, set up and ready to make noise.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#shop"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-fg shadow-lg shadow-accent/20 transition-colors hover:bg-accent-hover">
            Shop the wall <ArrowRight className="size-4" />
          </a>
          {featured && (
            <Link
              to={`/product/${featured._id}`}
              className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 font-semibold transition-colors hover:bg-surface-2">
              Staff pick
            </Link>
          )}
        </div>
        <ul className="mt-10 grid max-w-lg grid-cols-3 gap-4 text-xs text-muted">
          <li className="flex flex-col gap-1.5">
            <Truck className="size-5 text-accent" aria-hidden="true" /> Free shipping over $100
          </li>
          <li className="flex flex-col gap-1.5">
            <Wrench className="size-5 text-accent" aria-hidden="true" /> Pro setup on every guitar
          </li>
          <li className="flex flex-col gap-1.5">
            <ShieldCheck className="size-5 text-accent" aria-hidden="true" /> Secure PayPal checkout
          </li>
        </ul>
      </div>

      {featured ? (
        <div className="relative grid grid-cols-[2fr_1fr] gap-3 sm:gap-4">
          <Link
            to={`/product/${featured._id}`}
            className="group relative row-span-2 overflow-hidden rounded-card border border-border">
            <img src={featured.image} alt={featured.name} className="aspect-[4/5] size-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-5 pt-16 text-white">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#ffb4a8] uppercase">Top rated</p>
              <p className="mt-1 font-display text-xl leading-tight font-semibold">{featured.name}</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <Stars value={featured.rating} size="size-3.5" />
                <span className="font-display text-lg font-semibold">{money(featured.price)}</span>
              </div>
            </div>
          </Link>
          {rest.slice(0, 2).map((p) => (
            <Link key={p._id} to={`/product/${p._id}`} className="group overflow-hidden rounded-card border border-border">
              <img src={p.image} alt={p.name} className="aspect-square size-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="aspect-[5/4] animate-pulse rounded-card bg-surface-2" aria-hidden="true" />
      )}
    </section>
  );
}
