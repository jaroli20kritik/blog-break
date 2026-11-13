import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/usePageMeta";

export default function NotFound() {
  usePageMeta("Page not found");
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="font-display text-8xl font-extrabold text-accent">404</p>
        <h1 className="mt-4 text-3xl font-extrabold">This page doesn't exist</h1>
        <p className="mt-3 text-muted">The link may be old or mistyped.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="btn btn-primary">Go home</Link>
          <Link to="/products" className="btn btn-outline">Browse products</Link>
        </div>
      </div>
    </section>
  );
}
