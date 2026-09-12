/* Criadero — interacción del sitio
   DATOS A COMPLETAR (solo aquí):
   - WHATSAPP: código de país + número, sin espacios ni "+". Ej.: "593991234567".
   - PESO_KG: peso de Ramón Dino en kilos. Ej.: "38". Déjalo vacío para mostrar "—". */

const WHATSAPP = "593984677887";
const PESO_KG = "45";

(function () {
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- Peso ---------- */
  $$(".js-weight").forEach((el) => { el.innerHTML = (PESO_KG ? PESO_KG : '<span class="dash">—</span>') + " <small>kg</small>"; });

  /* ---------- Idioma ---------- */
  const T = window.I18N || {};
  const LANGS = Object.keys(T);
  let lang = "es";
  function detectLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q && T[q]) return q;
    try { const s = localStorage.getItem("lang"); if (s && T[s]) return s; } catch (e) {}
    const nav = (navigator.language || "es").slice(0, 2).toLowerCase();
    return T[nav] ? nav : "es";
  }
  function setLang(l) {
    if (!T[l]) return;
    lang = l;
    const d = T[l];
    document.documentElement.lang = l;
    $$("[data-i18n]").forEach((el) => {
      const v = d[el.dataset.i18n];
      if (v == null) return;
      if (/<[a-z]/i.test(v)) el.innerHTML = v; else el.textContent = v;
    });
    $$("[data-i18n-content]").forEach((el) => { const v = d[el.dataset.i18nContent]; if (v) el.setAttribute("content", v); });
    $$(".lang button").forEach((b) => b.classList.toggle("is-active", b.dataset.lang === l));
    try { localStorage.setItem("lang", l); } catch (e) {}
    wireWhatsApp();
  }
  $$(".lang button").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

  /* ---------- WhatsApp ---------- */
  const numeroValido = /^\d{8,15}$/.test(WHATSAPP);
  function wireWhatsApp() {
    const msg = (T[lang] && T[lang]["wa.msg"]) || "";
    $$(".js-wa").forEach((a) => {
      if (numeroValido) { a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg); a.target = "_blank"; a.rel = "noopener"; }
    });
  }
  setLang(detectLang());

  /* ---------- Menú ---------- */
  const nav = $(".nav");
  const toggle = $(".nav__toggle");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$(".nav__links a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }));

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
    const h = document.documentElement;
    const p = h.scrollHeight - h.clientHeight;
    $(".progress span").style.width = (p > 0 ? (window.scrollY / p) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Sección activa ---------- */
  const navLinks = $$(".nav__links a");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean).forEach((s) => spy.observe(s));

    /* Aparición */
    const rev = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); rev.unobserve(en.target); } });
    }, { threshold: .12 });
    $$(".reveal").forEach((el) => rev.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Marquee: duplicar contenido ---------- */
  const mq = $(".js-marquee");
  if (mq) mq.innerHTML += mq.innerHTML;

  /* ---------- Ficha: miniaturas ---------- */
  const studImg = $(".js-stud-img");
  $$(".stud__thumbs button").forEach((b) => b.addEventListener("click", () => {
    $$(".stud__thumbs button").forEach((x) => x.classList.remove("is-active"));
    b.classList.add("is-active");
    studImg.style.opacity = "0";
    setTimeout(() => { studImg.src = b.dataset.src; studImg.style.opacity = "1"; }, 150);
  }));
  studImg.style.transition = "opacity .25s, transform .8s";

  /* ---------- Videos: autoplay silencioso en pantalla, clic abre en grande con sonido ---------- */
  const vmodal = $("#vmodal");
  const vbig = $("video", vmodal);
  const inlineVideos = $$(".vcard video");
  if ("IntersectionObserver" in window) {
    const vo = new IntersectionObserver((entries) => {
      entries.forEach((en) => { const v = en.target; if (en.isIntersecting) { v.play().catch(() => {}); } else { v.pause(); } });
    }, { threshold: .25 });
    inlineVideos.forEach((v) => vo.observe(v));
  }
  /* Música de fondo (YouTube) para los videos que la declaran en data-music */
  let yt = null, ytReady = false, ytPending = null;
  function ensureYT() {
    if (window.YT && window.YT.Player) { ytReady = true; return; }
    if (document.getElementById("yt-api")) return;
    const s = document.createElement("script"); s.id = "yt-api"; s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s);
    window.onYouTubeIframeAPIReady = () => { ytReady = true; if (ytPending) { playMusic(ytPending.id, ytPending.start); ytPending = null; } };
  }
  function playMusic(id, start) {
    ensureYT();
    if (!ytReady) { ytPending = { id: id, start: start }; return; }
    const seek = () => { yt.seekTo(start, true); yt.playVideo(); };
    if (yt) { yt.loadVideoById({ videoId: id, startSeconds: start }); yt.setVolume(70); return; }
    yt = new YT.Player("ytplayer", { videoId: id, playerVars: { start: start, autoplay: 1, controls: 0, disablekb: 1, playsinline: 1 },
      events: { onReady: (e) => { e.target.setVolume(70); seek(); }, onStateChange: (e) => { if (e.data === YT.PlayerState.ENDED) seek(); } } });
  }
  function stopMusic() { if (yt && yt.stopVideo) { try { yt.stopVideo(); } catch (e) {} } ytPending = null; }
  function openVideo(src, music, start) {
    inlineVideos.forEach((v) => v.pause());
    vbig.src = src; vbig.loop = true; vbig.muted = !!music;
    vmodal.hidden = false; document.body.classList.add("has-lightbox");
    vbig.play().catch(() => {});
    if (music) playMusic(music, start || 0);
    $(".vmodal__close").focus();
  }
  function closeVideo() {
    stopMusic(); soundCard = null; $$(".vcard__sound").forEach((b) => b.setAttribute("aria-pressed", "false"));
    vbig.pause(); vbig.removeAttribute("src"); vbig.load();
    vmodal.hidden = true; document.body.classList.remove("has-lightbox");
    inlineVideos.forEach((v) => v.play().catch(() => {}));
  }
  /* Botón de altavoz: música en la tarjeta sin abrir el video */
  let soundCard = null;
  function setSound(card, on) {
    $$(".vcard").forEach((c) => $(".vcard__sound", c).setAttribute("aria-pressed", String(on && c === card)));
    soundCard = on ? card : null;
    if (!on) { stopMusic(); return; }
    const v = $("video", card);
    v.currentTime = 0; v.play().catch(() => {});
    playMusic(v.dataset.music, Number(v.dataset.musicStart || 0));
  }
  $$(".vcard").forEach((card) => {
    const v = $("video", card);
    const src = v.getAttribute("src"), music = v.dataset.music || "", start = Number(v.dataset.musicStart || 0);
    v.addEventListener("click", () => { setSound(null, false); openVideo(src, music, start); });
    $(".vcard__sound", card).addEventListener("click", (e) => { e.stopPropagation(); setSound(card, soundCard !== card); });
  });
  /* Si la tarjeta con música sale de pantalla, se silencia */
  if ("IntersectionObserver" in window) {
    const so = new IntersectionObserver((entries) => { entries.forEach((en) => { if (!en.isIntersecting && soundCard === en.target) setSound(null, false); }); }, { threshold: 0 });
    $$(".vcard").forEach((card) => so.observe(card));
  }
  $(".vmodal__close").addEventListener("click", closeVideo);
  vmodal.addEventListener("click", (e) => { if (e.target === vmodal) closeVideo(); });

  /* ---------- Lightbox ---------- */
  const tiles = $$(".tile");
  const lb = $("#lightbox");
  const lbImg = $("img", lb), lbCap = $("figcaption", lb);
  let idx = 0;
  function show(i) {
    idx = (i + tiles.length) % tiles.length;
    const t = tiles[idx];
    lbImg.src = t.dataset.full; lbImg.alt = $("img", t).alt;
    lbCap.textContent = (idx + 1) + " / " + tiles.length + " · " + $(".tile__cap", t).textContent;
  }
  function open(i) { show(i); lb.hidden = false; document.body.classList.add("has-lightbox"); $(".lightbox__close").focus(); }
  function close() { lb.hidden = true; document.body.classList.remove("has-lightbox"); }
  tiles.forEach((t, i) => t.addEventListener("click", () => open(i)));
  $(".lightbox__close").addEventListener("click", close);
  $(".lightbox__nav--prev").addEventListener("click", () => show(idx - 1));
  $(".lightbox__nav--next").addEventListener("click", () => show(idx + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !vmodal.hidden) closeVideo();
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });

  let tx = null;
  lb.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); tx = null; }, { passive: true });

  $$(".js-year").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
