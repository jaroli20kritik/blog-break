import { Link } from "react-router-dom";
import { BookOpen, Download } from "lucide-react";
import { site } from "../config/site";
import { asset } from "../lib/utils";

export function CatalogueBand() {
  const [a, b, c] = site.catalogue.previews;
  return (
    <section className="container-x py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-white sm:px-12 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:py-16">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <p className="eyebrow mb-3">Digital catalogue</p>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Every design in one PDF.</h2>
          <p className="mt-4 max-w-md leading-relaxed text-white/70">
            {site.catalogue.pages} pages of photos and highlights ({site.catalogue.sizeLabel}). Save it, share it with family, or send it to your shop.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={asset(site.catalogue.file)} download={site.catalogue.downloadName} className="btn btn-accent">
              <Download className="h-4 w-4" aria-hidden="true" /> Download catalogue
            </a>
            <Link to="/catalogue" className="btn border border-white/20 text-white hover:bg-white/10">
              <BookOpen className="h-4 w-4" aria-hidden="true" /> Preview pages
            </Link>
          </div>
        </div>
        <div className="relative mt-12 flex h-64 items-center justify-center sm:h-80 lg:mt-0" aria-hidden="true">
          {[c, b, a].filter(Boolean).map((src, i) => (
            <img
              key={src}
              src={asset(src)}
              alt=""
              loading="lazy"
              className="absolute h-full w-auto rounded-xl shadow-2xl ring-1 ring-white/10 transition-transform duration-500"
              style={{ transform: `translateX(${(i - 1) * 26}%) rotate(${(i - 1) * 6}deg) scale(${i === 2 ? 1 : 0.9})`, zIndex: i }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
