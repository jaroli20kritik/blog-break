import { useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { site } from "../config/site";
import { products } from "../data/products";
import { PageHeader } from "../components/Common";
import { InstagramIcon, WhatsAppIcon } from "../components/BrandIcons";
import { SocialLinks } from "../components/SocialLinks";
import { emailLink, phoneLink, whatsappLink } from "../lib/contact";
import { usePageMeta } from "../lib/usePageMeta";
import { cn } from "../lib/utils";
import { openExternal } from "../lib/runtime";

interface Form { name: string; phone: string; email: string; product: string; message: string }
type Errors = Partial<Record<keyof Form, string>>;

const OTHER = "Custom / something else";

function validate(f: Form): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  const digits = f.phone.replace(/\D/g, "");
  if (!digits) e.phone = "Please enter your phone number so we can reply.";
  else if (digits.length < 10 || digits.length > 13) e.phone = "Enter a valid phone number, e.g. 98765 43210.";
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "This email address doesn't look right.";
  if (f.message.trim().length < 5) e.message = "Tell us a little about what you need.";
  return e;
}

function compose(f: Form) {
  const lines = [`Hello ${site.name}! I have an enquiry.`, "", `Name: ${f.name.trim()}`, `Phone: ${f.phone.trim()}`];
  if (f.email.trim()) lines.push(`Email: ${f.email.trim()}`);
  if (f.product) lines.push(`Interested in: ${f.product}`);
  lines.push("", f.message.trim());
  return lines.join("\n");
}

export default function Contact() {
  usePageMeta("Contact us", `Contact ${site.name} in Udaipur for orders, prices, custom designs and bulk 3D-designed gifts. WhatsApp, phone and email.`);
  const [params] = useSearchParams();
  const preset = params.get("product");
  const [form, setForm] = useState<Form>({
    name: "", phone: "", email: "",
    product: products.find((p) => p.slug === preset)?.name ?? "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<"" | "whatsapp" | "email">("");

  const set = (k: keyof Form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = (channel: "whatsapp" | "email") => (e?: FormEvent) => {
    e?.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    const text = compose(form);
    const href = channel === "whatsapp" ? whatsappLink(text) : emailLink(`Enquiry from ${form.name.trim()}`, text);
    if (!href) return;
    if (channel === "whatsapp") openExternal(href);
    else window.location.href = href;
    setSent(channel);
  };

  const wa = whatsappLink(`Hello ${site.name}! I have an enquiry.`);
  const cards = [
    site.contact.phone && { icon: Phone, label: "Mobile", value: site.contact.phone, href: phoneLink(), cta: "Call now" },
    wa && { icon: WhatsAppIcon, label: "WhatsApp", value: site.contact.phone || "Chat with us", href: wa, cta: "Open chat", external: true },
    site.contact.email && { icon: Mail, label: "Email", value: site.contact.email, href: emailLink(), cta: "Send an email" },
    site.social.instagram && { icon: InstagramIcon, label: "Instagram", value: site.social.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, ""), href: site.social.instagram, cta: "Follow us", external: true },
    site.contact.location && { icon: MapPin, label: "Location", value: site.contact.location, href: site.contact.mapsUrl, cta: site.contact.mapsUrl ? "View on map" : "", external: true },
  ].filter(Boolean) as Array<{ icon: typeof Phone; label: string; value: string; href: string; cta: string; external?: boolean }>;

  return (
    <>
      <PageHeader
        eyebrow="Contact us"
        title="Let's make something."
        description="Ask about prices, colours, custom designs or bulk orders. WhatsApp is usually the quickest way to reach us."
      />

      <section className="container-x grid grid-cols-1 gap-10 py-16 lg:grid-cols-[1fr_1.25fr] lg:gap-14 [&>*]:min-w-0">
        <div className="space-y-4">
          {cards.map(({ icon: Icon, label, value, href, cta, external }) => (
            <div key={label} className="card flex items-center gap-4 p-4 sm:p-5">
              <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl", label === "WhatsApp" ? "bg-whatsapp/10 text-whatsapp" : "bg-accent-50 text-accent")}>
                <Icon size={22} className="h-[22px] w-[22px]" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
                {href ? (
                  <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="block break-words font-display text-[17px] font-bold hover:text-accent">{value}</a>
                ) : (
                  <p className="break-words font-display text-[17px] font-bold">{value}</p>
                )}
              </div>
              {href && cta && (
                <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="btn btn-outline hidden shrink-0 px-4 py-2 text-xs sm:inline-flex" tabIndex={-1} aria-hidden="true">
                  {cta}
                </a>
              )}
            </div>
          ))}
          {site.contact.hours && (
            <p className="flex items-center gap-2 px-1 text-sm text-muted"><Clock className="h-4 w-4" aria-hidden="true" />{site.contact.hours}</p>
          )}
          <div className="px-1 pt-2"><SocialLinks /></div>
        </div>

        <div className="card p-6 sm:p-9">
          {sent ? (
            <div className="flex flex-col items-center py-10 text-center" role="status">
              <CheckCircle2 className="h-14 w-14 text-whatsapp" aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-extrabold">Almost done!</h2>
              <p className="mt-3 max-w-sm text-muted">
                {sent === "whatsapp"
                  ? "WhatsApp opened with your message filled in. Press send there and we'll reply soon."
                  : "Your email app opened with your message filled in. Press send there and we'll reply soon."}
              </p>
              <p className="mt-2 text-sm text-muted">Nothing opened? Use the buttons on the left to reach us directly.</p>
              <button type="button" className="btn btn-outline mt-7" onClick={() => setSent("")}>Write another enquiry</button>
            </div>
          ) : (
            <form noValidate onSubmit={submit("whatsapp")} aria-labelledby="form-h">
              <h2 id="form-h" className="text-2xl font-extrabold">Send an enquiry</h2>
              <p className="mt-2 text-sm text-muted">Fill this in and we'll open WhatsApp (or email) with your message ready to send. Fields marked * are required.</p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <Field id="f-name" label="Your name *" error={errors.name}>
                  <input id="f-name" className="field" autoComplete="name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "f-name-err" : undefined} />
                </Field>
                <Field id="f-phone" label="Phone number *" error={errors.phone}>
                  <input id="f-phone" className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" value={form.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "f-phone-err" : undefined} />
                </Field>
                <Field id="f-email" label="Email (optional)" error={errors.email}>
                  <input id="f-email" className="field" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "f-email-err" : undefined} />
                </Field>
                <Field id="f-product" label="Product interested in">
                  <select id="f-product" className="field cursor-pointer" value={form.product} onChange={set("product")}>
                    <option value="">Choose a product (optional)</option>
                    {products.map((p) => <option key={p.slug} value={p.name}>{p.name}</option>)}
                    <option value={OTHER}>{OTHER}</option>
                  </select>
                </Field>
                <Field id="f-message" label="Message *" error={errors.message} className="sm:col-span-2">
                  <textarea id="f-message" className="field min-h-36 resize-y" placeholder="Quantity, colours, name to print, date you need it…" value={form.message} onChange={set("message")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "f-message-err" : undefined} />
                </Field>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {whatsappLink() && (
                  <button type="submit" className="btn btn-whatsapp flex-1 py-4 text-[15px]"><WhatsAppIcon size={19} /> Send on WhatsApp</button>
                )}
                {site.contact.email && (
                  <button type="button" onClick={() => submit("email")()} className="btn btn-outline py-4 text-[15px]"><Send className="h-4 w-4" aria-hidden="true" /> Send by email</button>
                )}
              </div>
              <p className="mt-4 text-xs text-muted">We only use your details to reply to this enquiry. Nothing is stored on this website.</p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function Field({ id, label, error, children, className }: { id: string; label: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-2">{label}</label>
      {children}
      {error && <p id={`${id}-err`} className="mt-1.5 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
