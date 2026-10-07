import { useSearchParams } from "react-router";

/** Safe ?redirect= target: only same-site paths are allowed (no open redirects). */
export function useRedirectParam(fallback = "/") {
  const [params] = useSearchParams();
  const r = params.get("redirect") || fallback;
  return r.startsWith("/") && !r.startsWith("//") ? r : fallback;
}
