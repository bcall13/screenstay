# Screenstay — demo landing page

Static landing page for Screenstay: hotel rooms with a monitor on the desk, one USB-C cable away from your laptop.

## Files
| File | What it holds | Edit it to… |
|---|---|---|
| `index.html` | Page structure and section markup | Add, remove or reorder sections |
| `styles.css` | Design tokens (top) and styles, one numbered block per section | Change colors, fonts, spacing, layout |
| `config.js` | All editable content: price, cities, steps, before/after bullets, form fields, submit endpoint | Change copy or form questions — no layout code |
| `app.js` | Helpers, Security, Render, UI, Submit and Boot modules | Change behavior |

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Publish with GitHub Pages
1. Create a new **public** repository (for example `screenstay`).
2. Upload these files.
3. Settings → Pages → Source: **Deploy from a branch** → `main` / `(root)` → Save.
4. After a minute the site is live at `https://<your-username>.github.io/screenstay/`.

## Security
- Content-Security-Policy (in `index.html`) allows scripts only from this site and blocks inline scripts, plugins, framing of other origins and form posts elsewhere. If you add a backend on another domain, add it to `connect-src`.
- All text goes into the page with `textContent`, never `innerHTML` (blocks XSS).
- Form input is normalized, stripped of control characters, length-limited and checked against allowlists; dropdowns only accept listed options.
- Honeypot field, minimum fill time and a per-session rate limit filter basic bots.
- **There is no backend or database yet, so nothing is stored.** Browser checks can be bypassed; when you add a backend it must re-validate every field, use parameterized queries (prevents SQL injection), rate-limit by IP, verify a CAPTCHA, and accept HTTPS only. Set `submitEndpoint` in `config.js` to its URL.
