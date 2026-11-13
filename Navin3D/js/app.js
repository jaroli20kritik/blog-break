/* Navin 3D Designs & Creations — site logic.
   Everything on the page is built from js/products.js, so adding a product
   there (or via admin.html) is all it takes to update the site. */
(() => {
  "use strict";

  const SITE = window.SITE || {};
  const PRODUCTS = (window.PRODUCTS || [])
    .filter(p => p && p.id && p.name)
    .map((p, i) => ({
      tags: [], highlights: [], images: [], price: "", description: "",
      ...p,
      num: String(i + 1).padStart(2, "0"),
      category: p.category || "Other",
    }));

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const categories = [...new Set(PRODUCTS.map(p => p.category))];
  const priceLabel = p => p.price ? esc(p.price) : "Price on request";
  const PLACEHOLDER = "data:image/svg+xml," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='#f1e9de'/><text x='50' y='56' font-family='Arial' font-size='14' fill='#c9b6a6' text-anchor='middle'>No photo</text></svg>");
  const cover = p => p.images[0] || PLACEHOLDER;

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const savedTheme = store.get("n3d-theme", null);
  if (savedTheme) root.dataset.theme = savedTheme;
  $("#themeToggle").addEventListener("click", () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    store.set("n3d-theme", root.dataset.theme);
  });

  /* ---------- Nav ---------- */
  const nav = $("#nav");
  addEventListener("scroll", () => nav.classList.toggle("is-scrolled", scrollY > 10), { passive: true });
  $("#menuBtn").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));
  $("#year").textContent = new Date().getFullYear();
  if (SITE.tagline) $("#heroTagline").textContent = SITE.tagline;

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- Hero showcase ---------- */
  const featured = PRODUCTS.filter(p => p.featured).length ? PRODUCTS.filter(p => p.featured) : PRODUCTS.slice(0, 6);
  const showcase = $("#heroShowcase"), dots = $("#heroDots");
  showcase.innerHTML = featured.map((p, i) => `
    <figure class="hero__card${i === 0 ? " active" : ""}" data-id="${esc(p.id)}" style="margin:0">
      <img src="${esc(cover(p))}" alt="${esc(p.name)}" ${i ? 'loading="lazy"' : ""}>
      <figcaption><span>${esc(p.name)}</span><small>${esc(p.category)}</small></figcaption>
    </figure>`).join("");
  dots.innerHTML = featured.map((_, i) => `<button aria-label="Show slide ${i + 1}"${i === 0 ? ' class="active"' : ""}></button>`).join("");
  let slide = 0, slideTimer;
  function goSlide(n) {
    const cards = $$(".hero__card", showcase), ds = $$("button", dots);
    if (!cards.length) return;
    cards[slide].classList.remove("active"); ds[slide].classList.remove("active");
    slide = (n + cards.length) % cards.length;
    cards[slide].classList.add("active"); ds[slide].classList.add("active");
  }
  const autoplay = () => { clearInterval(slideTimer); slideTimer = setInterval(() => goSlide(slide + 1), 3500); };
  autoplay();
  $$("button", dots).forEach((b, i) => b.addEventListener("click", () => { goSlide(i); autoplay(); }));
  showcase.addEventListener("click", e => { const c = e.target.closest(".hero__card"); if (c) openModal(c.dataset.id); });
  const stage = $("#heroStage");
  stage.addEventListener("mousemove", e => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    showcase.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg)`;
  });
  stage.addEventListener("mouseleave", () => (showcase.style.transform = ""));

  /* Marquee */
  const words = [...categories, "Custom orders", "Bulk gifting", ...PRODUCTS.slice(0, 6).map(p => p.name)];
  $("#marquee").innerHTML = [...words, ...words].map(w => `<span>${esc(w)}</span>`).join("");

  /* Stats */
  const statVals = { designs: PRODUCTS.length, categories: categories.length, new: PRODUCTS.filter(p => p.isNew).length };
  $$("[data-count]").forEach(el => {
    const target = statVals[el.dataset.count] || 0;
    const t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / 1400);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  /* ---------- Categories ---------- */
  $("#catGrid").innerHTML = categories.map(c => {
    const items = PRODUCTS.filter(p => p.category === c);
    return `<button class="cat reveal" data-cat="${esc(c)}">
      <img src="${esc(cover(items[0]))}" alt="" loading="lazy">
      <span class="cat__label"><strong>${esc(c)}</strong><span>${items.length} design${items.length > 1 ? "s" : ""}</span></span>
    </button>`;
  }).join("");
  $("#catGrid").addEventListener("click", e => {
    const b = e.target.closest(".cat"); if (!b) return;
    state.cat = b.dataset.cat; render();
    $("#collection").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- Collection: filter / search / sort ---------- */
  const state = { cat: "All", q: "", sort: "catalogue" };
  const chips = $("#chips");
  function renderChips() {
    const all = ["All", ...categories];
    chips.innerHTML = all.map(c => {
      const n = c === "All" ? PRODUCTS.length : PRODUCTS.filter(p => p.category === c).length;
      return `<button class="chip${state.cat === c ? " active" : ""}" role="tab" aria-selected="${state.cat === c}" data-cat="${esc(c)}">${esc(c)}<small>${n}</small></button>`;
    }).join("");
  }
  chips.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) { state.cat = b.dataset.cat; render(); } });
  let qT;
  $("#searchInput").addEventListener("input", e => { clearTimeout(qT); qT = setTimeout(() => { state.q = e.target.value.trim().toLowerCase(); render(); }, 120); });
  $("#sortSelect").addEventListener("change", e => { state.sort = e.target.value; render(); });

  function filtered() {
    let list = PRODUCTS.filter(p => state.cat === "All" || p.category === state.cat);
    if (state.q) {
      const terms = state.q.split(/\s+/);
      list = list.filter(p => {
        const hay = [p.name, p.category, ...p.tags, ...p.highlights, p.description].join(" ").toLowerCase();
        return terms.every(t => hay.includes(t));
      });
    }
    const s = state.sort;
    if (s === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (s === "za") list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    if (s === "new") list = [...list].sort((a, b) => (b.isNew === true) - (a.isNew === true));
    return list;
  }

  const plusIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  const checkIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>';

  function cardHTML(p, i) {
    const inBasket = !!basket[p.id];
    return `<article class="card" data-id="${esc(p.id)}" style="animation-delay:${Math.min(i, 12) * 45}ms" tabindex="0" aria-label="${esc(p.name)}">
      <div class="card__media">
        <img src="${esc(cover(p))}" alt="${esc(p.name)}" loading="lazy">
        ${p.images[1] ? `<img class="alt" src="${esc(p.images[1])}" alt="" loading="lazy">` : ""}
        <span class="card__num">${p.num}</span>
        ${p.isNew ? '<span class="tag-new">NEW</span>' : ""}
        <span class="card__shine"></span>
      </div>
      <div class="card__body">
        <h3>${esc(p.name)}</h3>
        <span class="card__tags">${esc((p.tags.length ? p.tags : [p.category]).join(" · "))}</span>
        <div class="card__foot">
          <span class="card__price">${priceLabel(p)}</span>
          <button class="add-btn${inBasket ? " added" : ""}" data-add="${esc(p.id)}" aria-label="${inBasket ? "In" : "Add to"} enquiry list">${inBasket ? checkIcon : plusIcon}</button>
        </div>
      </div>
    </article>`;
  }

  const grid = $("#productGrid");
  function render() {
    renderChips();
    const list = filtered();
    grid.innerHTML = list.map(cardHTML).join("");
    $("#emptyState").hidden = list.length > 0;
    $("#resultCount").textContent = `Showing ${list.length} of ${PRODUCTS.length} designs` + (state.cat !== "All" ? ` in ${state.cat}` : "");
    observeReveal();
  }

  grid.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (add) { e.stopPropagation(); toggleBasket(add.dataset.add); return; }
    const card = e.target.closest(".card"); if (card) openModal(card.dataset.id);
  });
  grid.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.classList.contains("card")) openModal(e.target.dataset.id);
  });
  /* 3D tilt + shine on cards */
  const canHover = matchMedia("(hover: hover)").matches;
  if (canHover) {
    grid.addEventListener("mousemove", e => {
      const card = e.target.closest(".card"); if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(900px) rotateY(${(x - .5) * 10}deg) rotateX(${(.5 - y) * 10}deg) translateY(-4px)`;
      card.style.setProperty("--mx", x * 100 + "%"); card.style.setProperty("--my", y * 100 + "%");
    });
    grid.addEventListener("mouseout", e => {
      const card = e.target.closest(".card");
      if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
    });
  }

  /* ---------- Product modal ---------- */
  const modal = $("#modal");
  let current = null, imgIdx = 0, lastFocus = null;
  function openModal(id, push = true) {
    const p = byId[id]; if (!p) return;
    current = p; imgIdx = 0;
    $("#modalCategory").textContent = `${p.num} · ${p.category}`;
    $("#modalTitle").textContent = p.name;
    $("#modalTags").innerHTML = (p.isNew ? '<span class="pill pill--new">NEW</span>' : "") + p.tags.map(t => `<span class="pill">${esc(t)}</span>`).join("");
    $("#modalPrice").textContent = p.price || "Price on request · Bulk & custom orders welcome";
    $("#modalDesc").textContent = p.description || "";
    $("#modalHighlights").innerHTML = p.highlights.map(h => `<li>${esc(h)}</li>`).join("");
    $("#modalThumbs").innerHTML = p.images.map((src, i) => `<button data-i="${i}" aria-label="Image ${i + 1}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join("");
    const many = p.images.length > 1;
    $("#prevImg").hidden = $("#nextImg").hidden = !many;
    showImg(0);
    updateModalAdd();
    const ask = contactLink(`Hi! I'm interested in the *${p.name}* (${p.num}). Could you share price and details?`, `Enquiry: ${p.name}`);
    const askBtn = $("#modalAsk");
    if (ask) { askBtn.href = ask.href; askBtn.hidden = false; } else askBtn.hidden = true;
    if (modal.hidden) { lastFocus = document.activeElement; modal.hidden = false; document.body.style.overflow = "hidden"; }
    $(".modal__panel").scrollTop = 0;
    $(".modal__close").focus({ preventScroll: true });
    if (push) history.replaceState(null, "", "#p-" + p.id);
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true; document.body.style.overflow = ""; current = null;
    $("#zoom").classList.remove("zoomed");
    history.replaceState(null, "", location.pathname + location.search);
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  function showImg(i) {
    if (!current) return;
    const n = current.images.length || 1;
    imgIdx = (i + n) % n;
    const img = $("#modalImage");
    img.style.opacity = 0;
    setTimeout(() => { img.src = current.images[imgIdx] || PLACEHOLDER; img.alt = current.name; img.style.opacity = 1; }, 120);
    $$("#modalThumbs button").forEach((b, k) => b.classList.toggle("active", k === imgIdx));
    $("#zoom").classList.remove("zoomed");
  }
  function stepProduct(d) {
    if (!current) return;
    const list = filtered().length ? filtered() : PRODUCTS;
    let i = list.findIndex(p => p.id === current.id);
    if (i < 0) i = 0;
    openModal(list[(i + d + list.length) % list.length].id);
  }
  function updateModalAdd() {
    if (!current) return;
    const b = $("#modalAdd"), inB = !!basket[current.id];
    b.textContent = inB ? "✓ In enquiry list" : "Add to enquiry";
  }
  modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });
  $("#modalThumbs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) showImg(+b.dataset.i); });
  $("#prevImg").addEventListener("click", e => { e.stopPropagation(); showImg(imgIdx - 1); });
  $("#nextImg").addEventListener("click", e => { e.stopPropagation(); showImg(imgIdx + 1); });
  $("#prevProduct").addEventListener("click", () => stepProduct(-1));
  $("#nextProduct").addEventListener("click", () => stepProduct(1));
  $("#modalAdd").addEventListener("click", () => current && toggleBasket(current.id));
  const zoom = $("#zoom");
  zoom.addEventListener("click", e => { if (!e.target.closest(".nav-arrow")) zoom.classList.toggle("zoomed"); });
  zoom.addEventListener("mousemove", e => {
    const r = zoom.getBoundingClientRect();
    $("#modalImage").style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
  });
  /* swipe between images on touch */
  let sx = null;
  zoom.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
  zoom.addEventListener("touchend", e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) showImg(imgIdx + (dx < 0 ? 1 : -1));
  });

  document.addEventListener("keydown", e => {
    if (!modal.hidden) {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") showImg(imgIdx + 1);
      if (e.key === "ArrowLeft") showImg(imgIdx - 1);
    } else if (!drawer.hidden && e.key === "Escape") closeDrawer();
  });

  /* ---------- Enquiry basket (saved in this browser) ---------- */
  let basket = store.get("n3d-basket", {});
  Object.keys(basket).forEach(id => { if (!byId[id]) delete basket[id]; });
  const drawer = $("#drawer");
  function saveBasket() { store.set("n3d-basket", basket); updateCount(); renderDrawer(); updateModalAdd(); }
  function updateCount(bump) {
    const n = Object.values(basket).reduce((a, b) => a + b, 0), el = $("#basketCount");
    el.textContent = n; el.classList.toggle("show", n > 0);
    if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
  }
  function toggleBasket(id) {
    const p = byId[id]; if (!p) return;
    if (basket[id]) { delete basket[id]; toast(`Removed ${p.name}`); }
    else { basket[id] = 1; toast(`Added ${p.name} to your enquiry list`); updateCount(true); }
    saveBasket();
    $$(`[data-add="${CSS.escape(id)}"]`).forEach(b => {
      const on = !!basket[id];
      b.classList.toggle("added", on); b.innerHTML = on ? checkIcon : plusIcon;
      b.setAttribute("aria-label", (on ? "In" : "Add to") + " enquiry list");
    });
  }
  function enquiryText() {
    const name = $("#enqName").value.trim(), notes = $("#enqNotes").value.trim();
    const lines = Object.entries(basket).map(([id, q]) => `• ${byId[id].name} (${byId[id].num}) × ${q}`);
    return `Hello ${SITE.name || ""}!` + (name ? ` This is ${name}.` : "") +
      `\nI'd like to enquire about:\n${lines.join("\n")}` + (notes ? `\n\nNotes: ${notes}` : "") + "\n\nPlease share price and availability. Thank you!";
  }
  function contactLink(text, subject) {
    if (SITE.whatsapp) return { href: `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, kind: "wa" };
    if (SITE.email) return { href: `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`, kind: "mail" };
    return null;
  }
  function renderDrawer() {
    const ids = Object.keys(basket), list = $("#drawerList");
    list.innerHTML = ids.length ? ids.map(id => {
      const p = byId[id];
      return `<li><img src="${esc(cover(p))}" alt=""><div><strong>${esc(p.name)}</strong><small>${esc(p.category)}</small></div>
        <div class="qty"><button data-q="-1" data-id="${esc(id)}" aria-label="Decrease">−</button><span>${basket[id]}</span><button data-q="1" data-id="${esc(id)}" aria-label="Increase">+</button></div></li>`;
    }).join("") : `<li class="drawer__empty" style="display:block;background:none">Your list is empty.<br>Tap <b>+</b> on any design to add it.</li>`;
    const send = $("#drawerSend"); const has = ids.length > 0;
    let html = "";
    if (SITE.whatsapp) html += `<a class="btn btn--wa" data-send="wa" target="_blank" rel="noopener"${has ? "" : " hidden"}>Send on WhatsApp</a>`;
    if (SITE.email) html += `<a class="btn btn--primary" data-send="mail"${has ? "" : " hidden"}>Send by e-mail</a>`;
    html += `<button class="btn btn--ghost" data-send="copy"${has ? "" : " disabled"}>Copy enquiry text</button>`;
    send.innerHTML = html;
    refreshSendLinks();
  }
  function refreshSendLinks() {
    const text = enquiryText();
    const wa = $('#drawerSend [data-send="wa"]'), mail = $('#drawerSend [data-send="mail"]');
    if (wa) wa.href = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
    if (mail) mail.href = `mailto:${SITE.email}?subject=${encodeURIComponent("Product enquiry")}&body=${encodeURIComponent(text)}`;
  }
  ["#enqName", "#enqNotes"].forEach(s => $(s).addEventListener("input", refreshSendLinks));
  $("#drawerList").addEventListener("click", e => {
    const b = e.target.closest("[data-q]"); if (!b) return;
    const id = b.dataset.id; basket[id] = (basket[id] || 0) + +b.dataset.q;
    if (basket[id] <= 0) { delete basket[id]; $$(`[data-add="${CSS.escape(id)}"]`).forEach(x => { x.classList.remove("added"); x.innerHTML = plusIcon; }); }
    saveBasket();
  });
  $("#drawerSend").addEventListener("click", async e => {
    const b = e.target.closest('[data-send="copy"]'); if (!b) return;
    const text = enquiryText();
    try { await navigator.clipboard.writeText(text); toast("Enquiry copied. Paste it into a message to us."); }
    catch { const n = $("#enqNotes"); n.value = text; n.select(); toast("Press Ctrl+C (or long-press) to copy your enquiry"); }
  });
  function openDrawer() { renderDrawer(); drawer.hidden = false; document.body.style.overflow = "hidden"; }
  function closeDrawer() { drawer.hidden = true; document.body.style.overflow = ""; }
  $("#basketBtn").addEventListener("click", openDrawer);
  drawer.addEventListener("click", e => { if (e.target.closest("[data-close-drawer]")) closeDrawer(); });

  /* ---------- Contact section ---------- */
  (function renderContact() {
    const wa = (SITE.whatsapp || "").replace(/\D/g, "");
    const a = [];
    if (wa) a.push(`<a class="btn btn--wa" target="_blank" rel="noopener" href="https://wa.me/${esc(wa)}?text=${encodeURIComponent("Hi! I'd like to know more about your 3D designs.")}">WhatsApp us</a>`);
    if (SITE.instagram) a.push(`<a class="btn btn--ghost" target="_blank" rel="noopener" href="https://instagram.com/${esc(SITE.instagram)}">@${esc(SITE.instagram)}</a>`);
    a.push(`<button class="btn ${a.length ? "btn--ghost" : "btn--primary"}" id="ctaBasket">Build an enquiry list</button>`);
    $("#contactActions").innerHTML = a.join("");
    $("#ctaBasket").addEventListener("click", openDrawer);

    const cards = [];
    if (SITE.email) cards.push({ label: "Email", value: SITE.email, href: `mailto:${SITE.email}` });
    if (SITE.phone) cards.push({ label: wa ? "Phone / WhatsApp" : "Phone", value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` });
    $("#contactCards").innerHTML = cards.map((c, i) => `<div class="contact-card"><small>${esc(c.label)}</small>
      <a href="${esc(c.href)}">${esc(c.value)}</a><button type="button" data-copy="${i}">Copy</button></div>`).join("");
    $("#contactCards").addEventListener("click", async e => {
      const b = e.target.closest("[data-copy]"); if (!b) return;
      const v = cards[+b.dataset.copy].value;
      try { await navigator.clipboard.writeText(v); toast(`Copied ${v}`); }
      catch {
        const r = document.createRange(); r.selectNodeContents(b.previousElementSibling);
        getSelection().removeAllRanges(); getSelection().addRange(r); toast("Selected. Press Ctrl+C to copy");
      }
    });
    if (cards.length) $("#footerContact").textContent = cards.map(c => c.value).join(" · ");
    $$("[data-catalogue]").forEach(l => { if (SITE.catalogue) l.href = SITE.catalogue; else l.hidden = true; });
  })();

  /* ---------- Catalogue download ----------
     On a normal web host the <a download> link just works. When the page is
     shown inside the claude.ai viewer, downloads must go through its save prompt. */
  const inViewer = !!(window.claude && typeof window.claude.use === "function");
  const saverP = inViewer ? window.claude.use("downloads").catch(() => null) : null;
  // Fetch the PDF once, in the background, as soon as the page is ready, so a
  // tap on "Download" can open the save prompt straight away.
  let pdfBlob = null, pdfP = null, busy = false;
  const loadPdf = () => pdfP || (pdfP = fetch(SITE.catalogue)
    .then(r => { if (!r.ok) throw { code: "fetch" }; return r.blob(); })
    .then(b => (pdfBlob = b))
    .catch(err => { pdfP = null; throw err; }));
  if (inViewer && SITE.catalogue) {
    const start = () => loadPdf().catch(() => {});
    if (document.readyState === "complete") setTimeout(start, 800);
    else addEventListener("load", () => setTimeout(start, 800), { once: true });
  }
  const contactHint = SITE.phone ? ` Or message ${SITE.phone} for the PDF.` : "";
  document.addEventListener("click", async e => {
    const a = e.target.closest("a[data-catalogue]");
    if (!a || !inViewer) return;           // normal web host: the link works by itself
    e.preventDefault();
    if (busy) return;
    busy = true;
    if (!pdfBlob) toast("Getting the catalogue ready…");
    try {
      const [saver, blob] = await Promise.all([saverP, pdfBlob || loadPdf()]);
      if (!saver) throw { code: "unavailable" };
      await saver.save({ filename: "Navin3D-Product-Catalogue.pdf", data: blob });
      toast("Catalogue saved to your device");
    } catch (err) {
      const code = err && err.code;
      if (code === "declined") toast("Download cancelled");
      else if (code === "rate_limited") toast("A save prompt is already open. Please try again in a moment.");
      else toast("This viewer can't save files." + contactHint);
    } finally {
      busy = false;
    }
  });

  /* ---------- Reveal on scroll ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12 })
    : null;
  function observeReveal() { $$(".reveal:not(.in)").forEach(el => io ? io.observe(el) : el.classList.add("in")); }

  /* ---------- Deep links: #product/<id> ---------- */
  function fromHash() {
    const m = location.hash.match(/^#(?:p-|product\/)(.+)$/);
    if (m && byId[decodeURIComponent(m[1])]) openModal(decodeURIComponent(m[1]), false);
  }
  addEventListener("hashchange", fromHash);

  render();
  updateCount();
  fromHash();
})();
