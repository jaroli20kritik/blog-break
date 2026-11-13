/**
 * claude.ai preview only: pages there can't start downloads with a plain
 * <a download> link, so catalogue downloads go through the viewer's save prompt.
 * The PDF is fetched once in the background so the prompt opens right away.
 */
interface Saver { save(o: { filename: string; data: Blob }): Promise<unknown> }
interface ClaudeRuntime { use(name: string): Promise<unknown> }

export function setupArtifactDownloads(toast: (msg: string) => void) {
  const claude = (window as unknown as { claude?: ClaudeRuntime }).claude;
  if (!claude || typeof claude.use !== "function") return;
  const saverP = claude.use("downloads").then((d) => d as Saver | null).catch(() => null);
  const blobs = new Map<string, Promise<Blob>>();
  const load = (href: string) => {
    if (!blobs.has(href)) {
      const p = fetch(href).then((r) => { if (!r.ok) throw new Error("fetch"); return r.blob(); });
      p.catch(() => blobs.delete(href));
      blobs.set(href, p);
    }
    return blobs.get(href)!;
  };
  const preload = () => setTimeout(() => {
    const first = document.querySelector<HTMLAnchorElement>("a[download]");
    if (first) load(first.href).catch(() => {});
  }, 800);
  if (document.readyState === "complete") preload();
  else window.addEventListener("load", preload, { once: true });
  let busy = false;
  document.addEventListener("click", async (e) => {
    const a = (e.target as Element | null)?.closest?.("a[download]") as HTMLAnchorElement | null;
    if (!a) return;
    e.preventDefault();
    if (busy) return;
    busy = true;
    toast("Getting the catalogue ready…");
    try {
      const [saver, blob] = await Promise.all([saverP, load(a.href)]);
      if (!saver) throw { code: "unavailable" };
      await saver.save({ filename: a.getAttribute("download") || "catalogue.pdf", data: blob });
      toast("Catalogue saved");
    } catch (err) {
      const code = (err as { code?: string })?.code;
      toast(code === "declined" ? "Download cancelled" : "This viewer can't save files. Use “Open in browser” instead.");
    } finally {
      busy = false;
    }
  }, true);
}
