import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Cpu, Gift, Layers, PenTool, ShieldCheck, Users } from "lucide-react";
import { site } from "../config/site";
import { PageHeader } from "../components/Common";
import { ProductImage } from "../components/ProductImage";
import { Reveal } from "../components/Reveal";
import { usePageMeta } from "../lib/usePageMeta";

const services = [
  { icon: PenTool, title: "3D design", text: "We model new designs and adapt existing ones — names, initials, sizes and details — before anything is printed." },
  { icon: Cpu, title: "3D printing", text: "Pieces are printed layer by layer in-house, which lets us reproduce fine relief, lettering and moving joints." },
  { icon: Gift, title: "Personalised gifts", text: "Name and initial keychains, NFC profile keychains and other pieces made for one person." },
  { icon: Users, title: "Bulk & wholesale", text: "Return gifts, festive sets, team and school orders, and stock for retail shops." },
];

const quality = [
  "Every design is test-printed before it goes into the collection.",
  "Each piece is cleaned up and checked by hand before it is packed.",
  "We confirm colours, names and quantities with you before printing a custom order.",
  "If something isn't right with your order, tell us and we'll make it right.",
];

export default function About() {
  usePageMeta("About us", `About ${site.name}: a 3D printing studio in Udaipur, Rajasthan, making idols, décor, keychains and personalised gifts.`);
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="A 3D printing studio from Udaipur."
        description={`${site.name} designs and prints décor, idols, planters, desk accessories, keychains and personalised gifts — for homes, festivals, gifting and businesses.`}
      />

      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2">
        <Reveal>
          <div className="grid grid-cols-2 gap-4">
            <ProductImage src="images/products/parshvanath-bhagwan-idol/1.webp" alt="Parshvanath Bhagwan idol printed in black" className="aspect-[3/4] rounded-[var(--radius-card)]" />
            <ProductImage src="images/products/voronoi-planter/1.webp" alt="Voronoi planter with lattice base" className="mt-10 aspect-[3/4] rounded-[var(--radius-card)]" />
          </div>
        </Reveal>
        <div className="space-y-5 text-[17px] leading-relaxed text-ink-2">
          <p className="eyebrow">Our story</p>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Turning ideas into objects you can hold.</h2>
          <p>
            We started with a simple idea: the things people love to give and keep — a Ganesha for a new home, a name keychain for a friend, a planter for a desk —
            can be designed with more care and made to order, close to home.
          </p>
          <p>
            Today our collection spans devotional idols, festive décor, fidget and utility keychains, phone stands and planters. Alongside it, we take on custom work:
            if you can describe it, sketch it or show us a picture, we'll tell you how we can print it.
          </p>
          <Link to="/products" className="btn btn-primary mt-2">See the collection <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="border-y border-line bg-white py-20">
        <div className="container-x">
          <p className="eyebrow mb-3">What we do</p>
          <h2 className="max-w-2xl text-3xl font-extrabold sm:text-4xl">Our 3D printing services</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 70}>
                <div className="h-full rounded-[var(--radius-card)] border border-line p-6">
                  <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x grid gap-12 py-20 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">Customisation</p>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Make it yours</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">Most of what we print can be adjusted. Common requests:</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Names and initials", "Colour and colour pairs", "Bulk quantities for events", "Your own design or logo idea", "NFC profile links", "Festive gifting sets"].map((x) => (
              <li key={x} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[15px] font-medium shadow-sm ring-1 ring-line/70">
                <Layers className="h-4 w-4 text-accent" aria-hidden="true" />{x}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[2rem] bg-ink p-8 text-white sm:p-10">
          <ShieldCheck className="h-8 w-8 text-accent" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-extrabold text-white">Our commitment to quality</h2>
          <ul className="mt-6 space-y-4">
            {quality.map((q) => (
              <li key={q} className="flex gap-3 text-white/80"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />{q}</li>
            ))}
          </ul>
          <Link to="/contact" className="btn btn-accent mt-8">Talk to us <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
