import { useDeferredValue, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { products } from "../data/products";
import { categories, categoryById } from "../data/categories";
import { ProductCard } from "../components/ProductCard";
import { EmptyState, PageHeader } from "../components/Common";
import { usePageMeta } from "../lib/usePageMeta";
import { cn } from "../lib/utils";

type Sort = "featured" | "new" | "az";

export default function Products() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "all";
  const q = params.get("q") ?? "";
  const sort = (params.get("sort") as Sort) || "featured";
  const deferredQ = useDeferredValue(q);
  const activeCat = categoryById(category);

  usePageMeta(
    activeCat ? activeCat.name : "Products",
    activeCat ? activeCat.description : "Browse 3D-designed idols, festive décor, planters, keychains, phone stands and personalised gifts. Search and filter by category.",
  );

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || (key === "sort" && value === "featured")) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const terms = deferredQ.toLowerCase().split(/\s+/).filter(Boolean);
    let list = products.filter((p) => category === "all" || p.categories.includes(category as never));
    if (terms.length) {
      list = list.filter((p) => {
        const hay = [p.name, p.shortDescription, p.description, ...p.highlights, ...p.colors, ...p.categories.map((c) => categoryById(c)?.name ?? "")]
          .join(" ")
          .toLowerCase();
        return terms.every((t) => hay.includes(t));
      });
    }
    if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "new") list = [...list].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    if (sort === "featured") list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return list;
  }, [category, deferredQ, sort]);

  const stale = q !== deferredQ;
  const counts = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, products.filter((p) => p.categories.includes(c.id)).length])),
    [],
  );

  return (
    <>
      <PageHeader
        eyebrow="Products"
        title={activeCat ? activeCat.name : "All products"}
        description={activeCat ? activeCat.description : "Every design we make, with photos, details and a quick WhatsApp enquiry on each one."}
      />

      <div className="border-b border-line bg-paper/90 backdrop-blur-xl sm:sticky sm:top-[72px] sm:z-30">
        <div className="container-x flex flex-col gap-3 py-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                type="search"
                value={q}
                onChange={(e) => update("q", e.target.value)}
                placeholder="Search keychains, idols, planters…"
                className="field rounded-full pl-11 pr-10"
              />
              {q && (
                <button type="button" onClick={() => update("q", "")} className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-ink/5" aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
            <label className="relative sm:w-52">
              <span className="sr-only">Sort products</span>
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <select value={sort} onChange={(e) => update("sort", e.target.value)} className="field cursor-pointer appearance-none rounded-full pl-11">
                <option value="featured">Featured first</option>
                <option value="new">New arrivals first</option>
                <option value="az">Name A–Z</option>
              </select>
            </label>
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
            {[{ id: "all", short: "All", name: "All products" }, ...categories].map((c) => {
              const active = category === c.id;
              const n = c.id === "all" ? products.length : counts[c.id];
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => update("category", c.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
                    active ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-2 hover:border-ink/30",
                  )}
                >
                  {c.id === "all" ? "All" : c.name}
                  <span className={cn("ml-1.5 text-xs", active ? "text-white/60" : "text-muted")}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="container-x py-10 sm:py-14" aria-live="polite">
        <p className="mb-6 text-sm text-muted">
          Showing <b className="text-ink">{results.length}</b> of {products.length} designs
          {activeCat && <> in <b className="text-ink">{activeCat.name}</b></>}
          {q && <> matching “<b className="text-ink">{q}</b>”</>}
        </p>
        {results.length ? (
          <div className={cn("grid grid-cols-1 gap-5 transition-opacity min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", stale && "opacity-60")}>
            {results.map((p, i) => <ProductCard key={p.slug} product={p} priority={i < 4} />)}
          </div>
        ) : (
          <EmptyState
            title="No designs found"
            action={<button type="button" className="btn btn-primary" onClick={() => setParams({}, { replace: true })}>Clear filters</button>}
          >
            Nothing matches your search yet. Try another word, or ask us for a custom design — we print to order.
          </EmptyState>
        )}
      </section>
    </>
  );
}
