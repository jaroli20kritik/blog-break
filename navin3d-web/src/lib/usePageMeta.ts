import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { site } from "../config/site";
import { pageUrl } from "./utils";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Sets the page <title>, description and social-sharing tags for SEO. */
export function usePageMeta(title: string, description: string = site.description, image?: string) {
  const { pathname } = useLocation();
  useEffect(() => {
    const full = title ? `${title} | ${site.name}` : `${site.name} — ${site.tagline}`;
    document.title = full;
    setMeta("name", "description", description);
    setMeta("property", "og:title", full);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", pageUrl(pathname, site.url));
    const img = image || "images/products/shubh-labh-lotus-decor/1.webp";
    setMeta("property", "og:image", pageUrl("/" + img.replace(/^\/+/, ""), site.url));
    let canon = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = pageUrl(pathname, site.url);
  }, [title, description, image, pathname]);
}
