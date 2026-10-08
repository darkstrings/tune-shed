import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../ui/Spinner";

const SLOW_AFTER_MS = 4000;

/**
 * Shows a friendly note when requests are slow — usually the free-tier API server
 * waking up after being idle (it can take ~30–60 seconds).
 */
export default function WakeBanner() {
  const queries = useSelector((s) => s.api.queries);
  const [now, setNow] = useState(() => Date.now());

  const pending = Object.values(queries).filter((q) => q?.status === "pending");
  const oldest = Math.min(...pending.map((q) => q.startedTimeStamp ?? Infinity));

  useEffect(() => {
    if (!pending.length) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [pending.length]);

  if (!pending.length || now - oldest < SLOW_AFTER_MS) return null;

  return (
    <div role="status" className="container-x pt-4">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm shadow-card">
        <Spinner className="size-4 shrink-0 text-accent" />
        <p>
          <span className="font-semibold">Warming up the amps…</span>{" "}
          <span className="text-muted">
            The store's server naps when nobody's around. It's waking up now — this can take up to a minute the first time.
          </span>
        </p>
      </div>
    </div>
  );
}
