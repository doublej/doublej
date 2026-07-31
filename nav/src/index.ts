/**
 * doublej-nav — the tab bar for a README.
 *
 * A GitHub README cannot open a link in a new tab (the sanitizer strips target=_blank
 * and forbids script), and github.com sends `x-frame-options: deny`, so it cannot be
 * framed either. For the ~25 seconds between a click and the rebuild landing, this
 * worker owns the tab — so it serves the profile back, laid out the same way, and lets
 * the README load *inside* it.
 *
 * The trick is that it does not fake the loading state. The Action commits real frames
 * (6%, 31%, 58%, 84%, then the page), and this polls the file and shows whatever is
 * actually there, easing the bar between commits so it reads as continuous. When the
 * requested tab lands it hands back to the real URL.
 *
 *   click a tab  ->  GET /?p=cli  ->  dispatch, serve the profile + current README
 *                ->  poll /status every 1.5s, swap in each committed frame
 *                ->  tab lands -> replace() to github.com/doublej
 *
 * Deliberately NOT reproduced: GitHub's logo, global nav and account menu. A
 * pixel-exact github.com on a non-GitHub domain is a phishing kit whatever the intent,
 * and the illusion only needs the document itself.
 *
 * Without GH_TOKEN it degrades to a prefilled issue whose body explains itself.
 */

const OWNER = "doublej";
const REPO = "doublej";
const WORKFLOW = "navigate.yml";
const PROFILE = "https://github.com/doublej";

const PAGES = ["home", "cli", "atlas", "framelink", "simsync",
               "systems", "projects", "raycast", "forks"];

const ME = {
  name: "Jurre-Jan Smit",
  login: "doublej",
  avatar: "https://avatars.githubusercontent.com/u/548350?v=4",
  company: "poolsuite.partners",
  location: "Netherlands",
  followers: 7,
  following: 10,
};

const COOLDOWN_SECONDS = 20;
const MAX_WAIT_SECONDS = 75;

interface Env {
  GH_TOKEN?: string;
}

const gh = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "doublej-nav",
});

const issueFallback = (page: string) =>
  `https://github.com/${OWNER}/${REPO}/issues/new?title=go%3A${page}` +
  `&body=Press+Create+and+stay+on+this+page.+A+workflow+reads+the+title+and+rebuilds+the+profile%2C` +
  `+narrating+it+here+as+it+goes.+It+will+link+you+back+when+the+tab+is+live%2C+then+close+itself.`;

async function claimTurn(): Promise<boolean> {
  const cache = caches.default;
  const key = new Request("https://doublej-nav.internal/turn");
  if (await cache.match(key)) return false;
  await cache.put(key, new Response("turning", {
    headers: { "Cache-Control": `max-age=${COOLDOWN_SECONDS}` },
  }));
  return true;
}

async function dispatch(page: string, token: string): Promise<void> {
  await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
    {
      method: "POST",
      headers: { ...gh(token), "Content-Type": "application/json" },
      body: JSON.stringify({ ref: "main", inputs: { page } }),
    },
  );
}

async function readme(token: string): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/README.md?ref=main`,
    { headers: gh(token) },
  );
  if (!res.ok) return "";
  const body = (await res.json()) as { content?: string };
  if (!body.content) return "";
  // atob yields latin1; the file is UTF-8 and mostly box-drawing characters.
  const bytes = Uint8Array.from(atob(body.content.replace(/\n/g, "")), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Just the document, without the tracking pixel. */
const preOf = (md: string): string => (md.match(/<pre>[\s\S]*<\/pre>/) ?? [""])[0];

const landed = (md: string, page: string) =>
  md.includes(`[${page}]`) && !md.includes("LOADING");

const shell = (page: string, pre: string) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${ME.login} · loading ${page}</title>
<link rel="icon" href="${ME.avatar}">
<style>
  :root {
    color-scheme: light dark;
    --fg:#1f2328; --dim:#59636e; --bg:#ffffff; --canvas:#ffffff; --topbar:#ffffff;
    --line:#d1d9e0; --accent:#0969da; --btn:#f6f8fa;
  }
  @media (prefers-color-scheme: dark) {
    :root { --fg:#f0f6fc; --dim:#9198a1; --bg:#0d1117; --canvas:#0d1117; --topbar:#010409;
            --line:#3d444d; --accent:#4493f8; --btn:#212830; }
  }
  * { box-sizing:border-box; }
  html,body { height:100%; }
  body { margin:0; background:var(--canvas); color:var(--fg);
         font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif; }
  .topbar { background:var(--topbar); border-bottom:1px solid var(--line); height:60px;
            display:flex; align-items:center; padding:0 2rem; gap:.75rem; }
  .topbar img { width:24px; height:24px; border-radius:50%; }
  .topbar b { font-size:14px; font-weight:600; }
  .topbar .dim { color:var(--dim); }
  .page { max-width:1280px; margin:0 auto; padding:1.5rem 2rem 4rem;
          display:grid; grid-template-columns:296px minmax(0,1fr); gap:1.5rem; align-items:start; }
  @media (max-width:1012px) { .page { grid-template-columns:1fr; } .side { max-width:22rem; } }
  .side .ava { width:100%; aspect-ratio:1; border-radius:50%; border:1px solid var(--line); display:block; }
  .side h1 { font-size:24px; line-height:1.25; font-weight:600; margin:1rem 0 0; }
  .side h2 { font-size:20px; line-height:1.25; font-weight:300; color:var(--dim); margin:0 0 1rem; }
  .side .meta { color:var(--dim); font-size:14px; margin:.25rem 0; }
  .side .btn { display:block; text-align:center; margin:1rem 0; padding:.3rem; font-size:14px;
               font-weight:500; border:1px solid var(--line); border-radius:6px; background:var(--btn);
               color:var(--fg); text-decoration:none; }
  .panel { border:1px solid var(--line); border-radius:6px; background:var(--bg); overflow:hidden; }
  .panelhead { display:flex; align-items:center; gap:.5rem; padding:.5rem 1rem;
               border-bottom:1px solid var(--line); color:var(--dim); font-size:14px; }
  .panelhead .path { color:var(--fg); }
  .dot { width:7px; height:7px; border-radius:50%; background:var(--accent); opacity:0; }
  .dot.on { opacity:1; animation:pulse 1.1s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity:.25 } 50% { opacity:1 } }
  .doc { padding:2rem; overflow-x:auto; }
  pre { margin:0; font:12px/1.45 ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace; }
  pre a { color:var(--accent); text-decoration:none; }
  pre a:hover { text-decoration:underline; }
</style>
</head><body>
  <div class="topbar">
    <img src="${ME.avatar}" alt="">
    <b>${ME.login}</b><span class="dim">/</span><span class="dim">README.md</span>
  </div>
  <div class="page">
    <div class="side">
      <img class="ava" src="${ME.avatar}" alt="">
      <h1>${ME.name}</h1>
      <h2>${ME.login}</h2>
      <a class="btn" href="${PROFILE}">View on GitHub</a>
      <p class="meta">${ME.followers} followers · ${ME.following} following</p>
      <p class="meta">${ME.company}</p>
      <p class="meta">${ME.location}</p>
    </div>
    <div class="panel">
      <div class="panelhead">
        <span class="path">${ME.login}</span><span>/</span><span class="path">README.md</span>
        <span class="dot on" id="dot" title="rebuilding"></span>
      </div>
      <div class="doc" id="doc">${pre || "<pre>  loading…</pre>"}</div>
    </div>
  </div>
<script>
  const PAGE = ${JSON.stringify(page)}, MAX = ${MAX_WAIT_SECONDS};
  const doc = document.getElementById("doc"), dot = document.getElementById("dot");
  // The committed frames carry a real bar; ease between them so it reads as continuous.
  const BAR = /\\[([\\u2593\\u2591]+)\\]\\s+(\\d+)%/;
  let raw = doc.innerHTML, committed = 0, shown = 0, t = 0, done = false;

  const withBar = (html, pct) => html.replace(BAR, (_m, cells) => {
    const w = cells.length, f = Math.round(pct / 100 * w);
    return "[" + "\\u2593".repeat(f) + "\\u2591".repeat(w - f) + "]  " +
           String(Math.round(pct)).padStart(3) + "%";
  });

  setInterval(() => {
    if (done || !BAR.test(raw)) return;
    // Creep toward the next frame without ever overtaking the truth by much.
    shown += (Math.min(99, committed + 22) - shown) * 0.08 + 0.1;
    doc.innerHTML = withBar(raw, shown);
  }, 220);

  const show = (pre) => {
    if (!pre || pre === raw) return;
    raw = pre;
    const m = raw.match(BAR);
    if (m) { committed = +m[2]; shown = Math.max(shown, committed); }
    doc.innerHTML = m ? withBar(raw, shown) : raw;
  };

  const poll = async () => {
    if (done) return;
    t += 1.5;
    if (t >= MAX) { location.replace(${JSON.stringify(PROFILE)}); return; }
    try {
      const j = await (await fetch("/status?p=" + PAGE, { cache: "no-store" })).json();
      show(j.pre);
      if (j.landed) {
        done = true; dot.classList.remove("on");
        doc.innerHTML = j.pre;
        setTimeout(() => location.replace(${JSON.stringify(PROFILE)}), 1200);
        return;
      }
    } catch (e) { /* keep waiting; the cap will fire */ }
    setTimeout(poll, 1500);
  };
  setTimeout(poll, 1500);
</script>
<noscript><meta http-equiv="refresh" content="35;url=${PROFILE}"></noscript>
</body></html>`;

const seeOther = (to: string) =>
  new Response(null, { status: 302, headers: { Location: to, "Cache-Control": "no-store" } });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const page = (url.searchParams.get("p") ?? "").trim();
    const nostore = { "Cache-Control": "no-store" };

    if (url.pathname === "/status") {
      if (!env.GH_TOKEN || !PAGES.includes(page)) {
        return Response.json({ landed: false, pre: null }, { headers: nostore });
      }
      const md = await readme(env.GH_TOKEN);
      // Always ship the current document — the loading frames are the show.
      return Response.json({ landed: landed(md, page), pre: preOf(md) }, { headers: nostore });
    }

    if (!PAGES.includes(page)) return seeOther(PROFILE);
    if (!env.GH_TOKEN) return seeOther(issueFallback(page));

    const [claimed, current] = await Promise.all([claimTurn(), readme(env.GH_TOKEN)]);
    if (claimed) await dispatch(page, env.GH_TOKEN);

    return new Response(shell(page, preOf(current)), {
      headers: { "Content-Type": "text/html; charset=utf-8", ...nostore },
    });
  },
};
