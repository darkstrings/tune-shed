import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

export default function SearchBox({ className, onSearched }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [keyword, setKeyword] = useState(params.get("q") ?? "");

  function submit(e) {
    e.preventDefault();
    const q = keyword.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}#shop` : "/#shop");
    onSearched?.();
  }

  return (
    <form onSubmit={submit} role="search" className={cn("relative", className)}>
      <label htmlFor="site-search" className="sr-only">
        Search guitars
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        id="site-search"
        type="search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search guitars, brands…"
        className="field h-10 rounded-full pr-4 pl-9"
      />
    </form>
  );
}
