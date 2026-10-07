import { useSearchParams } from "react-router";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import Hero from "../components/shop/Hero";
import ProductCard, { ProductCardSkeleton } from "../components/shop/ProductCard";
import Empty from "../components/ui/Empty";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { useGetFiltersQuery, useGetProductsQuery } from "../store/productsApi";
import { errMsg } from "../lib/format";
import { cn } from "../lib/utils";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
        active ? "border-fg bg-fg text-bg" : "border-border bg-surface text-muted hover:border-border-strong hover:text-fg",
      )}>
      {children}
    </button>
  );
}

export default function Home() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const condition = params.get("condition") ?? "";
  const sort = params.get("sort") ?? "newest";
  const page = Number(params.get("page")) || 1;

  const { data, isFetching, isLoading, error } = useGetProductsQuery({
    keyword: q || undefined,
    category: category || undefined,
    condition: condition || undefined,
    sort,
    pageNumber: page,
  });
  const { data: filters } = useGetFiltersQuery();

  function set(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next, { preventScrollReset: true });
  }

  const goToPage = (p) => {
    set("page", p > 1 ? String(p) : "");
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  const filtered = q || category || condition;

  return (
    <>
      <title>Tune Shed Music — new, used & vintage guitars</title>
      {!filtered && page === 1 && <Hero />}

      <section id="shop" className={cn("scroll-mt-24", !filtered && page === 1 && "mt-20")} aria-labelledby="shop-title">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-1.5">The wall</p>
            <h2 id="shop-title" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {q ? <>Results for “{q}”</> : category || "All guitars"}
            </h2>
            {data && (
              <p className="mt-1 text-sm text-muted">
                {data.count} instrument{data.count === 1 ? "" : "s"}
              </p>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select value={sort} onChange={(e) => set("sort", e.target.value === "newest" ? "" : e.target.value)} className="field h-10 w-auto py-0">
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-col gap-3">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Category">
            <Chip active={!category} onClick={() => set("category", "")}>
              All
            </Chip>
            {filters?.categories.map((c) => (
              <Chip key={c.name} active={category === c.name} onClick={() => set("category", c.name)}>
                {c.name} <span className="opacity-60">{c.count}</span>
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Condition">
            <span className="mr-1 text-xs font-semibold tracking-wider text-subtle uppercase">Condition</span>
            {filters?.conditions.map((c) => (
              <Chip key={c} active={condition === c} onClick={() => set("condition", condition === c ? "" : c)}>
                {c}
              </Chip>
            ))}
            {filtered && (
              <button
                type="button"
                onClick={() => setParams({}, { preventScrollReset: true })}
                className="ml-1 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                <X className="size-4" /> Clear all
              </button>
            )}
          </div>
        </div>

        <div className="mt-8">
          {error ? (
            <Alert tone="error">{errMsg(error)}</Alert>
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : data.products.length === 0 ? (
            <Empty
              title="Nothing on the wall matches"
              message="Try a different search or clear the filters."
              action={
                <Button variant="secondary" onClick={() => setParams({})}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <div
              className={cn(
                "grid grid-cols-2 gap-x-4 gap-y-10 transition-opacity sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4",
                isFetching && "opacity-60",
              )}>
              {data.products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>

        {data?.pages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
            <Button variant="secondary" size="icon" onClick={() => goToPage(page - 1)} disabled={page <= 1} aria-label="Previous page">
              <ChevronLeft />
            </Button>
            {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                size="icon"
                variant={p === page ? "primary" : "ghost"}
                onClick={() => goToPage(p)}
                aria-current={p === page ? "page" : undefined}>
                {p}
              </Button>
            ))}
            <Button variant="secondary" size="icon" onClick={() => goToPage(page + 1)} disabled={page >= data.pages} aria-label="Next page">
              <ChevronRight />
            </Button>
          </nav>
        )}
      </section>
    </>
  );
}
