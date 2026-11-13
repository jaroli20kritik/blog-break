import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "../Logo";
import { site } from "../../config/site";
import { categories } from "../../data/categories";
import { emailLink, phoneLink, whatsappLink } from "../../lib/contact";
import { asset } from "../../lib/utils";
import { navItems } from "./Navbar";
import { SocialLinks } from "../SocialLinks";
import { WhatsAppIcon } from "../BrandIcons";

export function Footer() {
  const wa = whatsappLink(`Hello ${site.name}! I have an enquiry.`);
  return (
    <footer className="bg-ink text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="space-y-5">
          <Logo light />
          <p className="max-w-sm text-sm leading-relaxed">
            3D-designed idols, festive décor, planters, desk accessories, keychains and personalised gifts — designed and printed in Udaipur.
          </p>
          <SocialLinks variant="dark" />
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-bold text-white">Explore</h2>
          <ul className="space-y-2.5 text-sm">
            {navItems.map((n) => (
              <li key={n.to}><Link className="transition hover:text-accent" to={n.to}>{n.label}</Link></li>
            ))}
            <li><a className="transition hover:text-accent" href={asset(site.catalogue.file)} download={site.catalogue.downloadName}>Download catalogue</a></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-bold text-white">Categories</h2>
          <ul className="space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.id}><Link className="transition hover:text-accent" to={`/products?category=${c.id}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-sm font-bold text-white">Get in touch</h2>
          <ul className="space-y-3.5 text-sm">
            {site.contact.phone && (
              <li><a href={phoneLink()} className="flex items-center gap-3 transition hover:text-white"><Phone className="h-4 w-4 text-accent" aria-hidden="true" />{site.contact.phone}</a></li>
            )}
            {wa && (
              <li><a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition hover:text-white"><WhatsAppIcon size={16} className="text-accent" />WhatsApp us</a></li>
            )}
            {site.contact.email && (
              <li><a href={emailLink()} className="flex items-center gap-3 break-all transition hover:text-white"><Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />{site.contact.email}</a></li>
            )}
            {site.contact.location && (
              <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-accent" aria-hidden="true" />{site.contact.location}</li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Retail, wholesale and custom orders welcome.</p>
        </div>
      </div>
    </footer>
  );
}
