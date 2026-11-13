import { site } from "../config/site";
import { cn } from "../lib/utils";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "./BrandIcons";

const icons = { instagram: InstagramIcon, facebook: FacebookIcon, youtube: YouTubeIcon } as const;
const labels = { instagram: "Instagram", facebook: "Facebook", youtube: "YouTube" } as const;

/** Renders only the social profiles filled in site.ts. */
export function SocialLinks({ variant = "light" }: { variant?: "light" | "dark" }) {
  const entries = (Object.keys(icons) as Array<keyof typeof icons>).filter((k) => site.social[k]);
  if (!entries.length) return null;
  return (
    <ul className="flex gap-2">
      {entries.map((k) => {
        const Icon = icons[k];
        return (
          <li key={k}>
            <a
              href={site.social[k]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${site.name} on ${labels[k]}`}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full transition",
                variant === "dark" ? "bg-white/10 text-white hover:bg-accent" : "bg-ink/5 text-ink hover:bg-accent hover:text-white",
              )}
            >
              <Icon size={18} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
