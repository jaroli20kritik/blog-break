import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, Link2, Mail, Package, Palette, Phone, Sparkles, Wand2 } from "lucide-react";
import { productBySlug, products } from "../data/products";
import { categoryById } from "../data/categories";
import { site } from "../config/site";
import { ProductImage } from "../components/ProductImage";
import { ProductCard } from "../components/ProductCard";
import { EmptyState } from "../components/Common";
import { WhatsAppIcon } from "../components/BrandIcons";
import { emailLink, phoneLink, productEnquiryMessage, whatsappLink } from "../lib/contact";
import { usePageMeta } from "../lib/usePageMeta";
import { cn, pageUrl } from "../lib/utils";

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const product = productBySlug(slug);
  usePageMeta(product ? product.name : "Product not found", product?.description, product?.images[0]);

  if (!product) {
    return (
      <div className="container-x py-24">
        <EmptyState title="We couldn't find that product" action={<Link to="/products" className="btn btn-primary">Browse all products</Link>}>
          It may have been renamed or removed from the collection.
        </EmptyState>
      </div>
    );
  }

  const url = pageUrl(`/products/${product.slug}`, site.url);
  const wa = whatsappLink(productEnquiryMessage(product.name, url));
  const mail = emailLink(`Enquiry: ${product.name}`, productEnquiryMessage(product.name, url).replace(/\*/g, ""));
  const cats = product.categories.map(categoryById).filter(Boolean);
  const related = products
    .filter((p) => p.slug !== product.slug && p.categories.some((c) => product.categories.includes(c)))
    .slice(0, 4);

  return (
    <>
      <div className="container-x pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link to="/" className="hover:text-ink">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/products" className="hover:text-ink">Products</Link></li>
            {cats[0] && (<><li aria-hidden="true">/</li><li><Link to={`/products?category=${cats[0].id}`} className="hover:text-ink">{cats[0].name}</Link></li></>)}
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-ink">{product.name}</li>
          </ol>
        </nav>
      </div>

      <section className="container-x grid grid-cols-1 gap-10 py-8 [&>*]:min-w-0 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-12">
        <Gallery images={product.images} name={product.name} key={product.slug} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-wrap items-center gap-2">
            {cats.map((c) => (
              <Link key={c!.id} to={`/products?category=${c!.id}`} className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink-2 hover:bg-ink/10">{c!.name}</Link>
            ))}
            {product.isNew && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"><Sparkles className="h-3 w-3" aria-hidden="true" />New</span>
            )}
          </div>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">{product.name}</h1>
          <p className="mt-4 font-display text-2xl font-bold">
            {product.price || site.priceOnRequest}
            {!product.price && <span className="ml-2 align-middle text-sm font-medium text-muted">· retail, wholesale & bulk</span>}
          </p>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-2">{product.description}</p>

          <div className="mt-8 space-y-6 border-t border-line pt-7">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted"><Palette className="h-4 w-4 text-accent" aria-hidden="true" />Colours</h2>
              {product.colors.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.colors.map((c) => <li key={c} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium">{c}</li>)}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">Ask us which colours are available.</p>
              )}
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted"><Wand2 className="h-4 w-4 text-accent" aria-hidden="true" />Customisation</h2>
              {product.customizable && product.customizationOptions.length ? (
                <ul className="mt-3 space-y-2">
                  {product.customizationOptions.map((o) => (
                    <li key={o} className="flex gap-2.5 text-[15px]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />{o}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">Ready design. Ask us about colour changes or bulk quantities.</p>
              )}
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted"><Package className="h-4 w-4 text-accent" aria-hidden="true" />Highlights</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5 text-[15px] leading-snug"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />{h}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp flex-1 py-4 text-[15px]">
                <WhatsAppIcon size={20} /> Enquire now on WhatsApp
              </a>
            )}
            {site.contact.phone && (
              <a href={phoneLink()} className="btn btn-outline py-4"><Phone className="h-4 w-4" aria-hidden="true" /> Call</a>
            )}
            {mail && (
              <a href={mail} className="btn btn-outline py-4"><Mail className="h-4 w-4" aria-hidden="true" /> Email</a>
            )}
          </div>
          <CopyLink url={url} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x border-t border-line py-16" aria-labelledby="related-h">
          <h2 id="related-h" className="mb-8 text-2xl font-extrabold sm:text-3xl">You may also like</h2>
          <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}
    </>
  );
}

function Gallery({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);
  const n = Math.max(images.length, 1);
  const go = (d: number) => setI((x) => (x + d + n) % n);

  useEffect(() => {
    // warm the browser cache so switching photos feels instant
    images.slice(1).forEach((src) => { const im = new Image(); im.src = import.meta.env.BASE_URL + src; });
  }, [images]);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative overflow-hidden rounded-[2rem] bg-white shadow-[var(--shadow-soft)] ring-1 ring-line/70"
        onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
        tabIndex={images.length > 1 ? 0 : -1}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name} photos`}
      >
        <ProductImage key={images[i]} src={images[i]} alt={`${name} — photo ${i + 1} of ${n}`} priority className="aspect-square" />
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:bg-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:bg-white">
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-white">{i + 1} / {n}</span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, k) => (
            <button
              key={src}
              type="button"
              onClick={() => setI(k)}
              aria-label={`Show photo ${k + 1}`}
              aria-current={k === i}
              className={cn("overflow-hidden rounded-2xl ring-2 transition", k === i ? "ring-accent" : "ring-transparent opacity-70 hover:opacity-100")}
            >
              <ProductImage src={src} alt="" className="aspect-square" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink"
      onClick={async () => {
        try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
        catch { window.prompt("Copy this link:", url); }
      }}
    >
      {copied ? <Check className="h-4 w-4 text-whatsapp" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
      {copied ? "Link copied" : "Copy link to share"}
    </button>
  );
}
