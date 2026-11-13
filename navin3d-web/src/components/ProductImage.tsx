import { useState } from "react";
import { ImageOff } from "lucide-react";
import { asset, cn } from "../lib/utils";

interface Props {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Load immediately (above the fold) instead of lazily. */
  priority?: boolean;
  sizes?: string;
}

/**
 * Image with a shimmer while loading and a clearly labelled
 * "Photo coming soon" placeholder when the file is missing.
 */
export function ProductImage({ src, alt, className, imgClassName, priority, sizes }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(!src);

  return (
    <div className={cn("relative overflow-hidden bg-paper-2", className)}>
      {!loaded && !failed && <div className="skeleton absolute inset-0" aria-hidden="true" />}
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-line text-muted">
          <ImageOff className="h-7 w-7" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wider">Photo coming soon</span>
          <span className="sr-only">{alt}</span>
        </div>
      ) : (
        <img
          src={asset(src!)}
          alt={alt}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      )}
    </div>
  );
}
