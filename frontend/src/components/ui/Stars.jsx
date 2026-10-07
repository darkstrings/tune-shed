import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

/** Read-only star rating with partial fill. */
export default function Stars({ value = 0, count, size = "size-4", className }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        <div className="flex text-border-strong">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className={cn(size, "fill-current")} />
          ))}
        </div>
        <div className="absolute inset-0 flex overflow-hidden text-brass" style={{ width: `${(value / 5) * 100}%` }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className={cn(size, "shrink-0 fill-current")} />
          ))}
        </div>
      </div>
      {count !== undefined && (
        <span className="text-xs text-muted">
          {count} review{count === 1 ? "" : "s"}
        </span>
      )}
    </div>
  );
}

/** Interactive 1–5 star picker (radio group). */
export function StarInput({ value, onChange, name = "rating" }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <label key={n} className="cursor-pointer">
          <input
            type="radio"
            name={name}
            value={n}
            checked={value === n}
            onChange={() => onChange(n)}
            className="peer sr-only"
          />
          <Star
            className={cn(
              "size-7 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-accent",
              n <= value ? "fill-brass text-brass" : "text-border-strong hover:text-brass",
            )}
            aria-hidden="true"
          />
          <span className="sr-only">{n} star{n > 1 ? "s" : ""}</span>
        </label>
      ))}
    </div>
  );
}
