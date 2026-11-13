/**
 * true when built for the claude.ai preview (VITE_ARTIFACT=1).
 * The normal website build never sets this.
 */
export const isArtifact = import.meta.env.VITE_ARTIFACT === "1";

/** Open an external link (WhatsApp, maps…) in a new tab using a real link click. */
export function openExternal(href: string) {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
