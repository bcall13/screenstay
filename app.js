"use strict";
/* =========================================================
   DOM HELPERS — every piece of text goes in via textContent,
   never innerHTML, so nothing typed or configured can inject markup
   ========================================================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "text") node.textContent = v;
    else if (k === "class") node.className = v;
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) node.append(c);
  return node;
}

/* =========================================================
   SECURITY — input cleaning, validation and abuse limits.
   Client-side checks keep honest mistakes and simple bots out;
   the real boundary must be repeated on the server.
   ========================================================= */
const Security = (() => {
  const LIMITS = { name: 80, email: 254, place: 80 };
  const RULES = {
    name:  /^[\p{L}][\p{L}\p{M}' .-]{1,79}$/u,
    place: /^[\p{L}\p{N}][\p{L}\p{M}\p{N}' .,&()-]{1,79}$/u,
    email: /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,24}$/
  };
  const MESSAGES = {
    required: "Fill in this field.",
    name: "Use letters, spaces, hyphens or apostrophes.",
    place: "Use letters, numbers and basic punctuation.",
    email: "Enter an email like name@company.com.",
    select: "Choose one of the options."
  };
  const MIN_FILL_MS = 2500;          // faster than this is almost certainly a bot
  const MAX_SUBMITS = 3;             // per window, per browser session
  const WINDOW_MS = 10 * 60 * 1000;
  let renderedAt = Date.now();
  let memorySubmits = [];

  function clean(value) {
    return String(value)
      .normalize("NFKC")
      .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202E\u2060-\u206F\uFEFF]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  function validate(field, raw) {
    const value = clean(raw);
    if (!value) return { value, error: MESSAGES.required };
    if (field.type === "select") {
      return field.options.includes(value) ? { value } : { value, error: MESSAGES.select };
    }
    const max = LIMITS[field.rule] || 80;
    if (value.length > max || !RULES[field.rule].test(value)) return { value, error: MESSAGES[field.rule] };
    return { value: field.rule === "email" ? value.toLowerCase() : value };
  }
  function readSubmits() {
    try { return JSON.parse(sessionStorage.getItem("ss-submits") || "[]").filter(n => typeof n === "number"); }
    catch { return memorySubmits; }
  }
  function writeSubmits(list) {
    memorySubmits = list;
    try { sessionStorage.setItem("ss-submits", JSON.stringify(list)); } catch { /* storage unavailable */ }
  }
  function checkAbuse(form) {
    if ($("#hp-website", form).value) return "bot";
    if (Date.now() - renderedAt < MIN_FILL_MS) return "bot";
    const now = Date.now();
    const recent = readSubmits().filter(t => now - t < WINDOW_MS);
    if (recent.length >= MAX_SUBMITS) return "limit";
    writeSubmits(recent.concat(now));
    return null;
  }
  return { clean, validate, checkAbuse, reset: () => { renderedAt = Date.now(); } };
})();

/* =========================================================
   RENDER — builds repeated content from CONFIG
   ========================================================= */
const ART = {
  step1: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 300\" role=\"img\" aria-label=\"Phone showing a Screenstay room booking next to a hotel key card\" preserveAspectRatio=\"xMidYMid slice\">\n<rect width=\"400\" height=\"300\" class=\"f-l\"/>\n<g transform=\"rotate(-10 270 190)\"><rect x=\"220\" y=\"150\" width=\"120\" height=\"76\" rx=\"8\" class=\"f-d\"/><rect x=\"236\" y=\"166\" width=\"40\" height=\"6\" rx=\"3\" fill=\"#F4D9C9\"/><rect x=\"236\" y=\"200\" width=\"22\" height=\"14\" rx=\"2\" fill=\"#FFD84D\"/></g>\n<rect x=\"128\" y=\"30\" width=\"124\" height=\"250\" rx=\"20\" fill=\"#111111\"/><rect x=\"135\" y=\"38\" width=\"110\" height=\"234\" rx=\"14\" fill=\"#FFFFFF\"/>\n<rect x=\"168\" y=\"44\" width=\"44\" height=\"8\" rx=\"4\" fill=\"#111111\"/>\n<rect x=\"145\" y=\"62\" width=\"90\" height=\"64\" rx=\"6\" class=\"f-w\"/>\n<rect x=\"160\" y=\"80\" width=\"40\" height=\"26\" rx=\"2\" fill=\"#111111\"/><rect x=\"163\" y=\"83\" width=\"34\" height=\"20\" fill=\"#FAF3EC\"/><rect x=\"177\" y=\"106\" width=\"6\" height=\"6\" fill=\"#111111\"/>\n<rect x=\"145\" y=\"136\" width=\"64\" height=\"7\" rx=\"2\" fill=\"#111111\"/><rect x=\"145\" y=\"150\" width=\"80\" height=\"5\" rx=\"2\" fill=\"#D9CFC4\"/>\n<rect x=\"145\" y=\"164\" width=\"72\" height=\"16\" rx=\"8\" fill=\"#FFD84D\"/><rect x=\"152\" y=\"170\" width=\"58\" height=\"4\" rx=\"2\" fill=\"#111111\"/>\n<rect x=\"145\" y=\"190\" width=\"56\" height=\"5\" rx=\"2\" fill=\"#D9CFC4\"/><rect x=\"145\" y=\"202\" width=\"66\" height=\"5\" rx=\"2\" fill=\"#D9CFC4\"/>\n<rect x=\"145\" y=\"234\" width=\"90\" height=\"24\" rx=\"12\" fill=\"#111111\"/><rect x=\"170\" y=\"244\" width=\"40\" height=\"4\" rx=\"2\" fill=\"#FFFFFF\"/>\n</svg>",
  step2: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 300\" role=\"img\" aria-label=\"A USB-C cable about to plug into the side of a laptop\" preserveAspectRatio=\"xMidYMid slice\">\n<rect width=\"400\" height=\"300\" class=\"f-w\"/>\n<circle cx=\"182\" cy=\"168\" r=\"70\" fill=\"#FFD84D\" opacity=\"0.22\"/>\n<rect x=\"-20\" y=\"140\" width=\"190\" height=\"46\" rx=\"10\" fill=\"#D8D2CC\"/><rect x=\"-20\" y=\"140\" width=\"190\" height=\"10\" rx=\"5\" fill=\"#EDE8E3\"/>\n<rect x=\"148\" y=\"158\" width=\"14\" height=\"8\" rx=\"4\" fill=\"#3A3A3A\"/><rect x=\"124\" y=\"158\" width=\"14\" height=\"8\" rx=\"4\" fill=\"#3A3A3A\"/>\n<rect x=\"190\" y=\"152\" width=\"22\" height=\"20\" rx=\"4\" fill=\"#C9C9C9\"/><rect x=\"212\" y=\"146\" width=\"46\" height=\"32\" rx=\"8\" fill=\"#111111\"/>\n<path d=\"M258 162 C300 162, 300 90, 340 80 S 420 60, 430 40\" stroke=\"#111111\" stroke-width=\"12\" fill=\"none\" stroke-linecap=\"round\"/>\n<path d=\"M176 156 L184 156 M176 168 L184 168\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-linecap=\"round\" opacity=\"0.8\"/>\n<path d=\"M170 150 L160 142 M170 174 L160 182 M166 162 L154 162\" stroke=\"#FFFFFF\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n</svg>",
  step3: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 300\" role=\"img\" aria-label=\"Hotel desk with a laptop connected to a large monitor, a lamp and a coffee\" preserveAspectRatio=\"xMidYMid slice\">\n<rect width=\"400\" height=\"300\" class=\"f-d\"/>\n<circle cx=\"92\" cy=\"120\" r=\"80\" fill=\"#FFD84D\" opacity=\"0.16\"/>\n<path d=\"M74 92 L108 92 L118 118 L64 118 Z\" class=\"f-w\"/><rect x=\"89\" y=\"118\" width=\"4\" height=\"96\" fill=\"#1A1A1A\"/><rect x=\"74\" y=\"212\" width=\"34\" height=\"5\" rx=\"2\" fill=\"#1A1A1A\"/>\n<rect x=\"138\" y=\"72\" width=\"200\" height=\"118\" rx=\"8\" fill=\"#0E0E0E\"/><rect x=\"145\" y=\"79\" width=\"186\" height=\"104\" rx=\"4\" fill=\"#F7F2EC\"/>\n<rect x=\"145\" y=\"79\" width=\"186\" height=\"10\" fill=\"#E9E1D7\"/><rect x=\"152\" y=\"96\" width=\"30\" height=\"80\" rx=\"2\" fill=\"#FFFFFF\"/>\n<rect x=\"188\" y=\"96\" width=\"136\" height=\"80\" rx=\"2\" fill=\"#FFFFFF\"/><rect x=\"196\" y=\"104\" width=\"54\" height=\"7\" rx=\"2\" fill=\"#111111\"/>\n<path d=\"M198 166 L222 148 L244 156 L270 130 L296 138 L316 116\" class=\"s-w\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<rect x=\"228\" y=\"190\" width=\"20\" height=\"22\" fill=\"#2A2A2A\"/><rect x=\"208\" y=\"210\" width=\"60\" height=\"5\" rx=\"2\" fill=\"#2A2A2A\"/>\n<rect x=\"276\" y=\"196\" width=\"80\" height=\"16\" rx=\"2\" fill=\"#1A1A1A\"/><path d=\"M270 212 L362 212 L370 218 L262 218 Z\" fill=\"#CFC6BE\"/>\n<path d=\"M276 210 C250 214, 252 190, 240 190\" stroke=\"#111111\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/>\n<rect x=\"128\" y=\"196\" width=\"16\" height=\"18\" rx=\"3\" fill=\"#FFFFFF\"/><rect x=\"143\" y=\"200\" width=\"6\" height=\"9\" rx=\"3\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2.5\"/>\n<rect x=\"0\" y=\"218\" width=\"400\" height=\"14\" fill=\"#2A120B\"/><rect x=\"0\" y=\"232\" width=\"400\" height=\"68\" fill=\"#000000\" opacity=\"0.2\"/>\n</svg>"
};
function svgFromString(str) {
  // ART strings are fixed artwork written in this file, parsed as SVG, never user input
  const doc = new DOMParser().parseFromString(str, "image/svg+xml");
  return document.importNode(doc.documentElement, true);
}
const Render = {
  steps() {
    const list = $('[data-render="steps"]');
    CONFIG.steps.forEach(s => {
      const art = el("div", { class: "step__art" }, [svgFromString(ART[s.art]), el("span", { class: "chip", text: s.chip, "aria-hidden": "true" })]);
      list.append(el("li", { class: "step" }, [art, el("div", {}, [el("h3", { text: s.title }), el("p", { text: s.text })])]));
    });
  },
  compare() {
    const box = $('[data-render="compare"]');
    const card = (mod, title, items) => el("div", { class: "compare__card compare__card--" + mod }, [
      el("h3", { text: title }), el("ul", {}, items.map(t => el("li", { text: t })))
    ]);
    box.append(card("before", "Before", CONFIG.compare.before), card("after", "With Screenstay", CONFIG.compare.after));
  },
  cities() {
    const ul = $('[data-render="cities"]');
    CONFIG.cities.forEach(c => ul.append(el("li", { text: c })));
  },
  price() { $('[data-render="price"]').textContent = CONFIG.price; },
  fields(audience) {
    const box = $('[data-render="fields"]');
    box.replaceChildren();
    CONFIG.forms[audience].fields.forEach(f => {
      const id = "f-" + audience + "-" + f.name;
      const errId = id + "-err";
      let input;
      if (f.type === "select") {
        input = el("select", { id, name: f.name, required: "", "aria-describedby": errId },
          [el("option", { value: "", text: "Choose one" })].concat(f.options.map(o => el("option", { value: o, text: o }))));
      } else {
        input = el("input", { id, name: f.name, type: f.type, required: "", maxlength: f.rule === "email" ? "254" : "80",
          autocomplete: f.autocomplete || "off", spellcheck: "false", "aria-describedby": errId });
      }
      box.append(el("div", { class: "field" }, [el("label", { for: id, text: f.label }), input, el("span", { id: errId, class: "field__error" })]));
    });
    $("[data-submit-label]").textContent = CONFIG.forms[audience].submit;
  }
};

/* =========================================================
   INTERACTIONS
   ========================================================= */
const UI = {
  nav() {
    const btn = $(".menu-btn"), menu = $("#menu");
    const close = () => { btn.setAttribute("aria-expanded", "false"); menu.hidden = true; };
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open)); menu.hidden = open;
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    document.addEventListener("click", e => { if (!menu.contains(e.target) && !btn.contains(e.target)) close(); });
    $$("[data-scroll]").forEach(a => a.addEventListener("click", e => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault(); close();
      target.scrollIntoView({ block: "start" });
    }));
    const start = /^[A-Za-z0-9_~.-]+$/.test(location.hash.slice(1)) && document.getElementById(location.hash.slice(1));
    if (start) start.scrollIntoView({ block: "start" });
  },
  plug() {
    const btn = $(".plug"), on = $('[data-screen="on"]'), off = $('[data-screen="off"]');
    btn.addEventListener("click", () => {
      const plugged = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", String(plugged));
      btn.textContent = plugged ? "Unplug" : "Plug in USB-C";
      const show = plugged ? on : off, hide = plugged ? off : on;
      hide.hidden = true; show.hidden = false;
      show.classList.remove("is-waking"); void show.offsetWidth; show.classList.add("is-waking");
    });
  },
  compare() {
    const box = $("[data-compare]"), range = $("#compare-range");
    const set = v => {
      const pos = Math.min(100, Math.max(0, Number(v) || 0));
      box.style.setProperty("--pos", pos + "%");
      range.value = String(pos);
      range.setAttribute("aria-valuetext", Math.round(100 - pos) + "% Screenstay");
    };
    range.addEventListener("input", () => set(range.value));
    let dragging = false;
    const fromPointer = e => { const r = box.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); };
    box.addEventListener("pointerdown", e => { dragging = true; box.setPointerCapture(e.pointerId); fromPointer(e); });
    box.addEventListener("pointermove", e => { if (dragging) fromPointer(e); });
    box.addEventListener("pointerup", () => { dragging = false; });
    box.addEventListener("pointercancel", () => { dragging = false; });
    set(50);
  },
  form() {
    const form = $("#signup"), status = $(".form__status", form), done = $("[data-done]");
    let audience = "traveler";
    const pick = a => {
      if (!(a in CONFIG.forms)) return;
      audience = a;
      $$("[data-audience]", form).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.audience === a)));
      Render.fields(a); status.textContent = "";
    };
    $$("[data-audience]", form).forEach(b => b.addEventListener("click", () => pick(b.dataset.audience)));
    pick("traveler");

    form.addEventListener("submit", async e => {
      e.preventDefault();
      status.textContent = "";
      const data = {}; let firstBad = null;
      for (const f of CONFIG.forms[audience].fields) {
        const input = form.elements.namedItem(f.name);
        const { value, error } = Security.validate(f, input.value);
        const err = document.getElementById(input.getAttribute("aria-describedby"));
        err.textContent = error || "";
        input.setAttribute("aria-invalid", error ? "true" : "false");
        if (error && !firstBad) firstBad = input;
        data[f.name] = value;
      }
      if (firstBad) { firstBad.focus(); return; }
      const abuse = Security.checkAbuse(form);
      if (abuse === "limit") { status.textContent = "Too many signups from this browser. Try again in 10 minutes."; return; }
      if (abuse !== "bot") await Submit.send(audience, data);   // bots get the same success screen, silently dropped
      $("[data-done-text]").textContent = CONFIG.forms[audience].done;
      form.hidden = true; done.hidden = false; done.focus();
    });
    $("[data-reset]").addEventListener("click", () => {
      form.reset(); pick(audience); Security.reset();
      done.hidden = true; form.hidden = false;
    });
  }
};

/* =========================================================
   SUBMIT — demo only. Nothing leaves the browser yet.
   When a backend exists it must: re-validate every field,
   use parameterized queries (never string-built SQL), rate-limit
   by IP, verify a CAPTCHA token, and send JSON over HTTPS only.
   ========================================================= */
const Submit = {
  async send(audience, data) {
    if (!CONFIG.submitEndpoint) return { ok: true, demo: true };
    const res = await fetch(CONFIG.submitEndpoint, {
      method: "POST", credentials: "omit", referrerPolicy: "no-referrer",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audience, ...data })
    });
    return { ok: res.ok };
  }
};

/* =========================================================
   BOOT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  Render.steps(); Render.compare(); Render.cities(); Render.price();
  UI.nav(); UI.plug(); UI.compare(); UI.form();
});
