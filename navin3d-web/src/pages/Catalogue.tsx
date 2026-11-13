import { useState } from "react";
import { BookOpen, Download, ExternalLink, FileText, Share2 } from "lucide-react";
import { site } from "../config/site";
import { PageHeader } from "../components/Common";
import { ProductImage } from "../components/ProductImage";
import { WhatsAppIcon } from "../components/BrandIcons";
import { usePageMeta } from "../lib/usePageMeta";
import { whatsappLink } from "../lib/contact";
import { asset, cn, pageUrl } from "../lib/utils";

export default function Catalogue() {
  usePageMeta("Product catalogue (PDF)", `Download the ${site.name} product catalogue — ${site.catalogue.pages} pages of 3D-designed products with photos and highlights.`);
  const pdf = asset(site.catalogue.file);
  const [active, setActive] = useState(0);
  const pdfUrl = pageUrl("/" + site.catalogue.file, site.url);
  const shareWa = `https://wa.me/?text=${encodeURIComponent(`${site.name} — product catalogue (PDF):\n${pdfUrl}`)}`;
  const askWa = whatsappLink(`Hello ${site.name}! Please send me your latest product catalogue.`);

  return (
    <>
      <PageHeader
        eyebrow={site.catalogue.edition}
        title="Product catalogue"
        description={`All our designs in one PDF: ${site.catalogue.pages} pages with photos and highlights, ${site.catalogue.sizeLabel}. Download it, or open it in your browser.`}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={pdf} download={site.catalogue.downloadName} className="btn btn-accent px-6 py-3.5 text-[15px]">
            <Download className="h-4 w-4" aria-hidden="true" /> Download PDF
          </a>
          <a href={pdf} target="_blank" rel="noopener noreferrer" className="btn btn-outline px-6 py-3.5 text-[15px]">
            <ExternalLink className="h-4 w-4" aria-hidden="true" /> Open in browser
          </a>
        </div>
      </PageHeader>

      <section className="container-x grid grid-cols-1 gap-12 py-16 [&>*]:min-w-0 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div className="mx-auto w-full max-w-md">
          <div className="relative">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl bg-accent/20" aria-hidden="true" />
            <a href={pdf} target="_blank" rel="noopener noreferrer" className="relative block overflow-hidden rounded-2xl shadow-[var(--shadow-lift)] ring-1 ring-line" aria-label="Open the catalogue PDF">
              <ProductImage key={active} src={site.catalogue.previews[active]} alt={`Catalogue page ${active + 1} preview`} priority className="aspect-[210/297]" />
            </a>
          </div>
          <div className="mt-8 grid grid-cols-4 gap-3">
            {site.catalogue.previews.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Preview page ${i + 1}`}
                aria-current={i === active}
                className={cn("overflow-hidden rounded-lg ring-2 transition", i === active ? "ring-accent" : "ring-transparent opacity-70 hover:opacity-100")}
              >
                <ProductImage src={src} alt="" className="aspect-[210/297]" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-7">
            <FileText className="h-7 w-7 text-accent" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-extrabold">What's inside</h2>
            <ul className="mt-4 space-y-2.5 text-[15px] text-ink-2">
              <li>• A one-page overview of every design</li>
              <li>• A full page per product with large photos and highlights</li>
              <li>• Pooja essentials, idols, keychains, phone stands, décor and planters</li>
              <li>• Contact details for orders, pricing and bulk enquiries</li>
            </ul>
            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-5 text-sm">
              <div><dt className="text-muted">Pages</dt><dd className="font-display text-xl font-bold">{site.catalogue.pages}</dd></div>
              <div><dt className="text-muted">Format</dt><dd className="font-display text-xl font-bold">PDF</dd></div>
              <div><dt className="text-muted">Size</dt><dd className="font-display text-xl font-bold">{site.catalogue.sizeLabel.replace("about ", "~")}</dd></div>
            </dl>
          </div>

          <div className="card p-7">
            <Share2 className="h-7 w-7 text-accent" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-extrabold">Share or request it</h2>
            <p className="mt-2 text-[15px] text-muted">Send the catalogue link to a friend, or ask us to send the latest copy on WhatsApp.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {pdfUrl && <a href={shareWa} target="_blank" rel="noopener noreferrer" className="btn btn-outline"><Share2 className="h-4 w-4" aria-hidden="true" /> Share on WhatsApp</a>}
              {askWa && <a href={askWa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp"><WhatsAppIcon size={16} /> Ask us for it</a>}
            </div>
          </div>

          <p className="flex items-start gap-2 text-sm text-muted">
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            On phones, “Open in browser” shows the PDF in your phone's viewer, where you can also save or share it.
          </p>
        </div>
      </section>
    </>
  );
}
