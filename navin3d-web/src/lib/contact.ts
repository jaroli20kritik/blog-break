import { site } from "../config/site";

const digits = (s: string) => s.replace(/\D/g, "");

/** wa.me link with an optional pre-filled message. "" when no number is configured. */
export const whatsappLink = (message?: string): string => {
  const n = digits(site.contact.whatsapp);
  if (!n) return "";
  return `https://wa.me/${n}` + (message ? `?text=${encodeURIComponent(message)}` : "");
};

export const phoneLink = (): string => (site.contact.phone ? `tel:${site.contact.phone.replace(/[^\d+]/g, "")}` : "");

export const emailLink = (subject?: string, body?: string): string => {
  if (!site.contact.email) return "";
  const q = new URLSearchParams();
  if (subject) q.set("subject", subject);
  if (body) q.set("body", body);
  const qs = q.toString().replace(/\+/g, "%20");
  return `mailto:${site.contact.email}${qs ? `?${qs}` : ""}`;
};

export const productEnquiryMessage = (name: string, url?: string): string =>
  `Hello ${site.name}! I'm interested in the *${name}*.` +
  (url ? `\n${url}` : "") +
  `\n\nCould you please share the price, available colours and delivery details?`;
