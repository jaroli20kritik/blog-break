import { Link } from "react-router-dom";
import {
  ArrowRight, Boxes, Download, Gift, Layers, MapPin, MessageCircle, Palette, PenTool, Ruler, Truck, Wand2,
} from "lucide-react";
import { site } from "../config/site";
import { products } from "../data/products";
import { categories } from "../data/categories";
import { ProductCard } from "../components/ProductCard";
import { ProductImage } from "../components/ProductImage";
import { SectionHeading } from "../components/Common";
import { Reveal } from "../components/Reveal";
import { CatalogueBand } from "../components/CatalogueBand";
import { WhatsAppIcon } from "../components/BrandIcons";
import { usePageMeta } from "../lib/usePageMeta";
import { whatsappLink } from "../lib/contact";
import { asset } from "../lib/utils";

const featured = products.filter((p) => p.featured).slice(0, 8);

export default function Home() {
  usePageMeta("", site.description);
  const customWa = whatsappLink(
    `Hello ${site.name}! I'd like a custom / bulk order.\n\nWhat I need:\nQuantity:\nColours:\nNeeded by:`,
  );

  return (
    <>
      <Hero />

      {/* Featured */}
      <section className="container-x py-20 sm:py-24" aria-labelledby="featured-h">
        <SectionHeading
          eyebrow="Featured"
          title={<span id="featured-h">Pieces people ask about most</span>}
          description="Idols, festive décor and personalised keychains, crafted with fine, detailed 3D designs."
          action={<Link to="/products" className="btn btn-outline shrink-0">All products <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
        />
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 70}><ProductCard product={p} /></Reveal>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-line bg-white py-20 sm:py-24" aria-labelledby="cat-h">
        <div className="container-x">
          <SectionHeading eyebrow="Shop by category" title={<span id="cat-h">Find the right piece</span>} align="center" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {categories.map((c, i) => {
              const count = products.filter((p) => p.categories.includes(c.id)).length;
              return (
                <Reveal key={c.id} delay={(i % 3) * 70}>
                  <Link
                    to={`/products?category=${c.id}`}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] sm:aspect-[4/3]"
                  >
                    <ProductImage src={c.cover} alt="" className="absolute inset-0" imgClassName="group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" aria-hidden="true" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
                      <div>
                        <h3 className="text-base font-bold text-white sm:text-xl">{c.name}</h3>
                        <p className="mt-1 text-xs text-white/70 sm:text-sm">{count} {count === 1 ? "design" : "designs"}</p>
                      </div>
                      <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink transition group-hover:bg-accent group-hover:text-white sm:grid">
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="container-x py-20 sm:py-24" aria-labelledby="why-h">
        <SectionHeading
          eyebrow="Why Navin 3D"
          title={<span id="why-h">Made here, made for you</span>}
          description="A small studio in Udaipur that designs and prints every piece itself, so we can change the details you care about."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MapPin, title: "Designed & printed in Udaipur", text: "Every piece is modelled and printed by us, not resold from elsewhere." },
            { icon: Wand2, title: "Personal by design", text: "Names, initials, colours and profile links — printed for one person or a whole team." },
            { icon: Layers, title: "Fine, visible detail", text: "Crowns, jewellery, lettering and lattices captured in fine 3D detail." },
            { icon: Boxes, title: "Retail to wholesale", text: "Single gifts, return-gift sets and bulk orders for shops and events." },
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 70}>
              <div className="card h-full p-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-50 text-accent"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Customisation & bulk */}
      <section id="custom" className="bg-white py-20 sm:py-24" aria-labelledby="custom-h">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="grid grid-cols-2 gap-4">
              <ProductImage src="images/products/initial-name-keychain/1.webp" alt="Initial and name keychain printed to order" className="aspect-[4/5] rounded-[var(--radius-card)]" />
              <div className="grid gap-4">
                <ProductImage src="images/products/custom-name-keychain/1.webp" alt="Custom name keychains in two colours" className="aspect-square rounded-[var(--radius-card)]" />
                <ProductImage src="images/products/nfc-instagram-keychain/1.webp" alt="NFC Instagram keychain" className="aspect-square rounded-[var(--radius-card)]" />
              </div>
            </div>
          </Reveal>
          <div>
            <p className="eyebrow mb-3">Customisation & bulk orders</p>
            <h2 id="custom-h" className="text-3xl font-extrabold sm:text-4xl lg:text-[44px] lg:leading-[1.08]">Have an idea? We'll print it.</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Send us a name, a sketch, a photo or a reference product. We'll tell you what's possible, the colours we can do and a price.
            </p>
            <ol className="mt-8 space-y-5">
              {[
                { icon: MessageCircle, title: "Tell us what you need", text: "Share your idea, quantity and date on WhatsApp or the contact form." },
                { icon: PenTool, title: "We design it in 3D", text: "We model or adapt the design and confirm details with you." },
                { icon: Palette, title: "Printed in your colours", text: "Printed, finished by hand and checked before it leaves." },
                { icon: Truck, title: "Picked up or delivered", text: "Single pieces or bulk sets for gifting, events and shops." },
              ].map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-paper font-display text-sm font-bold text-ink">
                    <Icon className="h-4 w-4 text-accent" aria-hidden="true" /><span className="sr-only">Step {i + 1}</span>
                  </span>
                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-9 flex flex-wrap gap-3">
              {customWa && (
                <a href={customWa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  <WhatsAppIcon size={18} /> Request a custom order
                </a>
              )}
              <Link to="/contact" className="btn btn-outline">Use the enquiry form</Link>
            </div>
          </div>
        </div>
      </section>

      <CatalogueBand />

      {/* Enquiry CTA */}
      <section className="container-x pb-24" aria-labelledby="cta-h">
        <div className="card flex flex-col items-start gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 id="cta-h" className="text-2xl font-extrabold sm:text-3xl">Looking for something specific?</h2>
            <p className="mt-3 text-muted">Ask about prices, colours, gifting sets or a design you don't see here. We usually reply on WhatsApp.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {whatsappLink() && (
              <a href={whatsappLink(`Hello ${site.name}! I have an enquiry.`)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <WhatsAppIcon size={18} /> WhatsApp us
              </a>
            )}
            <Link to="/contact" className="btn btn-primary">Contact us <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Hero() {
  const heroImgs = ["images/products/ganesha-kumkum-chawal-dibbi/1.webp", "images/products/bal-krishna-flute-keychain/1.webp", "images/products/flexi-octopus-keychain/1.webp"];
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-accent/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 15px, rgb(23 23 26 / 0.05) 15px 16px)", maskImage: "linear-gradient(to bottom, black, transparent 85%)" }}
        />
      </div>
      <div className="container-x grid items-center gap-12 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28 lg:pt-20">
        <div>
          <p className="inline-flex animate-rise items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" /> 3D design studio · Udaipur, Rajasthan
          </p>
          <h1 className="mt-6 animate-rise text-[2.6rem] font-extrabold leading-[1.02] sm:text-6xl lg:text-[4.4rem] [animation-delay:60ms]">
            Bring Your Ideas to Life with <span className="relative whitespace-nowrap text-accent">3D Designs</span>
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-muted [animation-delay:120ms]">
            Idols, festive décor, planters, desk accessories and personalised keychains — designed and printed to order, from a single gift to a bulk set.
          </p>
          <div className="mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:180ms]">
            <Link to="/products" className="btn btn-primary px-6 py-3.5 text-[15px]">Explore products <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <a href={asset(site.catalogue.file)} download={site.catalogue.downloadName} className="btn btn-outline px-6 py-3.5 text-[15px]">
              <Download className="h-4 w-4" aria-hidden="true" /> Download catalogue
            </a>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6 animate-rise [animation-delay:240ms]">
            <div><dt className="text-xs text-muted">Designs</dt><dd className="font-display text-2xl font-extrabold">{products.length}</dd></div>
            <div><dt className="text-xs text-muted">Categories</dt><dd className="font-display text-2xl font-extrabold">{categories.length}</dd></div>
            <div><dt className="text-xs text-muted">Made in</dt><dd className="font-display text-2xl font-extrabold text-accent">Udaipur</dd></div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] animate-rise [animation-delay:150ms]">
          <div className="grid grid-cols-[1.25fr_1fr] gap-4">
            <ProductImage src={heroImgs[0]} alt="Ganesha Kumkum Chawal Dibbi in ivory" priority className="row-span-2 aspect-[3/4] rounded-[2rem] shadow-[var(--shadow-lift)]" />
            <ProductImage src={heroImgs[1]} alt="Bal Krishna flute keychain" priority className="aspect-square rounded-[1.6rem] shadow-[var(--shadow-soft)]" />
            <ProductImage src={heroImgs[2]} alt="Flexi octopus keychain" priority className="aspect-square rounded-[1.6rem] shadow-[var(--shadow-soft)]" />
          </div>
          <div className="absolute -left-3 bottom-10 flex animate-float items-center gap-3 rounded-2xl bg-white/95 p-3 pr-4 shadow-[var(--shadow-lift)] backdrop-blur sm:-left-8">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-white"><Gift className="h-5 w-5" aria-hidden="true" /></span>
            <span className="text-sm leading-tight"><b className="block font-display">Personalised gifts</b><span className="text-muted">Names, initials, colours</span></span>
          </div>
          <div className="absolute -right-2 -top-4 flex animate-float items-center gap-2 rounded-2xl bg-ink px-3.5 py-2.5 text-white shadow-[var(--shadow-lift)] [animation-delay:1.5s] sm:-right-6">
            <Ruler className="h-4 w-4 text-accent" aria-hidden="true" /><span className="text-xs font-semibold">Printed layer by layer</span>
          </div>
        </div>
      </div>
    </section>
  );
}
