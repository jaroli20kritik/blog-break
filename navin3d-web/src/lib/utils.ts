/** Prefix a /public path with the deploy base (works on sub-folder hosting). */
export const asset = (path: string): string =>
  /^(https?:|data:|blob:)/.test(path) ? path : import.meta.env.BASE_URL + path.replace(/^\/+/, "");

/** Join class names, skipping falsy values. */
export const cn = (...parts: Array<string | false | null | undefined>): string => parts.filter(Boolean).join(" ");

/** Full absolute URL for a route, used in WhatsApp messages and SEO tags. */
export const pageUrl = (path: string, siteUrl: string): string => {
  // In the claude.ai preview there is no real page address to share.
  if (!siteUrl && import.meta.env.VITE_ARTIFACT === "1") return "";
  const base = siteUrl || (typeof window !== "undefined" ? window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, "") : "");
  return base.replace(/\/$/, "") + path;
};
