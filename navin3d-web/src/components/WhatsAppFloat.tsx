import { site } from "../config/site";
import { whatsappLink } from "../lib/contact";
import { WhatsAppIcon } from "./BrandIcons";

export function WhatsAppFloat() {
  const href = whatsappLink(`Hello ${site.name}! I'd like to know more about your 3D-printed products.`);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-whatsapp p-3.5 text-white shadow-[0_14px_30px_-10px_rgb(31_168_85/0.7)] transition hover:scale-105 sm:bottom-7 sm:right-7"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40 [animation-duration:2.4s]" aria-hidden="true" />
      <WhatsAppIcon size={28} />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-40 group-hover:pr-1 sm:inline">
        Chat with us
      </span>
    </a>
  );
}
