import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Loader2, SearchX } from "lucide-react";
import { cn } from "../lib/utils";

export function SectionHeading({
  eyebrow, title, description, align = "left", action,
}: { eyebrow?: string; title: ReactNode; description?: ReactNode; align?: "left" | "center"; action?: ReactNode }) {
  return (
    <div className={cn("mb-10 flex flex-col gap-6 md:mb-14", align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between")}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-[44px] lg:leading-[1.08]">{title}</h2>
        {description && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3 text-muted">
        <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden="true" />
        <span className="text-sm font-medium">Loading…</span>
      </div>
    </div>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="card mx-auto flex max-w-lg flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-50 text-accent">
        <SearchX className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-xl font-bold">{title}</h3>
      {children && <div className="text-sm leading-relaxed text-muted">{children}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description?: ReactNode; children?: ReactNode }) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
      <div className="container-x relative py-10 sm:py-20">
        <p className="eyebrow mb-3 animate-rise">{eyebrow}</p>
        <h1 className="max-w-3xl animate-rise text-4xl font-extrabold sm:text-5xl lg:text-6xl [animation-delay:60ms]">{title}</h1>
        {description && <p className="mt-5 max-w-2xl animate-rise text-base leading-relaxed text-muted sm:text-lg [animation-delay:120ms]">{description}</p>}
        {children}
      </div>
    </header>
  );
}

interface EBState { error: Error | null }
export class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { error: null };
  static getDerivedStateFromError(error: Error): EBState { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Page error:", error, info.componentStack); }
  render() {
    if (!this.state.error) return this.props.children;
    const chunk = /Loading chunk|dynamically imported module|Failed to fetch/i.test(this.state.error.message);
    return (
      <div className="container-x grid min-h-[60vh] place-items-center py-16">
        <div className="card flex max-w-md flex-col items-center gap-3 px-6 py-12 text-center">
          <AlertTriangle className="h-8 w-8 text-accent" aria-hidden="true" />
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-sm text-muted">
            {chunk ? "Part of the page couldn't load. Check your internet connection and reload." : "This page couldn't be shown. Please reload, or go back to the home page."}
          </p>
          <div className="mt-3 flex gap-3">
            <button className="btn btn-primary" onClick={() => window.location.reload()}>Reload</button>
            <Link className="btn btn-outline" to="/" onClick={() => this.setState({ error: null })}>Home</Link>
          </div>
        </div>
      </div>
    );
  }
}
