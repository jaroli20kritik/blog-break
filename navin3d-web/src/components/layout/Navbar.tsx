import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Download, Menu, X } from "lucide-react";
import { Logo } from "../Logo";
import { site } from "../../config/site";
import { asset, cn } from "../../lib/utils";

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || open ? "border-line bg-paper/85 shadow-[0_8px_24px_-20px_rgb(0_0_0/0.4)] backdrop-blur-xl" : "border-transparent bg-paper/60 backdrop-blur",
      )}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Logo onClick={() => setOpen(false)} />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn("rounded-full px-4 py-2 text-sm font-medium transition", isActive ? "bg-ink text-white" : "text-ink-2 hover:bg-ink/5")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={asset(site.catalogue.file)} download={site.catalogue.downloadName} className="btn btn-accent hidden px-4 py-2.5 sm:inline-flex">
            <Download className="h-4 w-4" aria-hidden="true" /> Catalogue
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden border-t border-line bg-paper transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[80vh] opacity-100" : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="container-x flex flex-col py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              tabIndex={open ? 0 : -1}
              className={({ isActive }) =>
                cn("flex items-center justify-between border-b border-line py-4 font-display text-lg font-bold", isActive ? "text-accent" : "text-ink")
              }
            >
              {item.label}
            </NavLink>
          ))}
          <a href={asset(site.catalogue.file)} download={site.catalogue.downloadName} tabIndex={open ? 0 : -1} className="btn btn-accent mt-5 w-full">
            <Download className="h-4 w-4" aria-hidden="true" /> Download catalogue (PDF)
          </a>
        </nav>
      </div>
    </header>
  );
}
