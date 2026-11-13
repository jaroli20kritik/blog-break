import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Wand2 } from "lucide-react";
import type { Product } from "../data/products";
import { categoryById } from "../data/categories";
import { site } from "../config/site";
import { productEnquiryMessage, whatsappLink } from "../lib/contact";
import { pageUrl } from "../lib/utils";
import { ProductImage } from "./ProductImage";
import { WhatsAppIcon } from "./BrandIcons";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const href = `/products/${product.slug}`;
  const category = categoryById(product.categories[0]);
  const wa = whatsappLink(productEnquiryMessage(product.name, pageUrl(href, site.url)));

  return (
    <article className="group card relative flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      <Link to={href} className="relative block aspect-square" aria-label={`View ${product.name}`}>
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          priority={priority}
          className="absolute inset-0"
          imgClassName="group-hover:scale-[1.04]"
        />
        {product.images[1] && (
          <ProductImage
            src={product.images[1]}
            alt=""
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 max-md:hidden"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.isNew && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              <Sparkles className="h-3 w-3" aria-hidden="true" /> New
            </span>
          )}
        </div>
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-muted">
          <span>{category?.short}</span>
          {product.customizable ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 font-semibold text-accent-600">
              <Wand2 className="h-3 w-3" aria-hidden="true" /> Customisable
            </span>
          ) : (
            <span className="text-muted/80">Ready design</span>
          )}
        </div>
        <div>
          <h3 className="text-[17px] font-bold leading-snug">
            <Link to={href} className="after:absolute after:inset-0 after:content-[''] focus:outline-none">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{product.shortDescription}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-sm font-bold text-ink">{product.price || site.priceOnRequest}</span>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp relative z-10 px-3.5 py-2 text-xs"
              aria-label={`Enquire about ${product.name} on WhatsApp`}
            >
              <WhatsAppIcon size={15} /> Enquire
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="skeleton aspect-square" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-8 w-full rounded-full" />
      </div>
    </div>
  );
}
