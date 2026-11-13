import { Link } from "react-router-dom";
import { site } from "../config/site";
import { cn } from "../lib/utils";

/** Brand mark: stacked print layers forming an "N". */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-10 w-10", className)} aria-hidden="true">
      <rect width="40" height="40" rx="11" className="fill-ink" />
      <g className="fill-accent">
        <rect x="9" y="11" width="5" height="18" rx="1.5" />
        <rect x="26" y="11" width="5" height="18" rx="1.5" />
        <path d="M12.2 11.6c.9-.8 2.3-.7 3.1.2l12.1 14.6c.8.9.7 2.3-.2 3.1-.9.8-2.3.7-3.1-.2L12 14.7c-.8-.9-.7-2.3.2-3.1Z" />
      </g>
      <g className="fill-white/25">
        <rect x="8" y="31.5" width="24" height="1.4" rx=".7" />
        <rect x="11" y="34" width="18" height="1.4" rx=".7" />
      </g>
    </svg>
  );
}

export function Logo({ light = false, onClick }: { light?: boolean; onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
      <LogoMark className="transition-transform duration-500 group-hover:-rotate-6" />
      <span className="leading-none">
        <span className={cn("block font-display text-[17px] font-extrabold tracking-tight", light ? "text-white" : "text-ink")}>
          Navin <span className="text-accent">3D</span>
        </span>
        <span className={cn("mt-1 block text-[11px] font-medium tracking-wide", light ? "text-white/60" : "text-muted")}>
          Design and Creations
        </span>
      </span>
    </Link>
  );
}
