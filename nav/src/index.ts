/**
 * doublej-nav — the tab bar for a README.
 *
 * A GitHub README cannot open a link in a new tab: the markdown sanitizer strips
 * target="_blank" and forbids script. So a click always steals the tab you were
 * reading, and the rebuild it kicks off takes about half a minute.
 *
 * Sending the visitor straight back would drop them on the *old* page with no sign
 * anything happened, so they would click again, and again. Instead they get a small
 * waiting room that confirms the click, then polls until the page they asked for has
 * actually landed and only then hands them back.
 *
 *   click a tab  ->  GET /?p=cli  ->  dispatch the workflow, serve the waiting room
 *                ->  poll /status until README says [cli]
 *                ->  back to github.com/doublej, freshly rebuilt
 *
 * Without GH_TOKEN it degrades to a prefilled issue whose body explains itself, so
 * the tabs keep working either way.
 */

const OWNER = "doublej";
const REPO = "doublej";
const WORKFLOW = "navigate.yml";
const PROFILE = "https://github.com/doublej";

const PAGES = ["home", "cli", "atlas", "framelink", "simsync",
               "systems", "projects", "raycast", "forks"];

/** One turn at a time. Extra clicks join the turn already in flight. */
const COOLDOWN_SECONDS = 20;
/** Never hold anyone hostage, however badly the build is going. */
const MAX_WAIT_SECONDS = 60;

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
  await cache.put(
    key,
    new Response("turning", { headers: { "Cache-Control": `max-age=${COOLDOWN_SECONDS}` } }),
  );
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

/**
 * Has the page actually landed? Read the README itself rather than the run status —
 * the run list races with dispatch, but the file cannot lie about which tab is active.
 */
async function hasLanded(page: string, token: string): Promise<boolean> {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/README.md?ref=main`,
    { headers: gh(token) },
  );
  if (!res.ok) return false;
  const body = (await res.json()) as { content?: string };
  if (!body.content) return false;
  const readme = atob(body.content.replace(/\n/g, ""));
  return readme.includes(`[${page}]`) && !readme.includes("LOADING");
}

const html = (page: string) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>turning to ${page}…</title>
<style>
  :root { color-scheme: light dark; --fg:#1f2328; --dim:#59636e; --bg:#fff; --line:#d1d9e0; --ok:#1a7f37; }
  @media (prefers-color-scheme: dark) {
    :root { --fg:#f0f6fc; --dim:#9198a1; --bg:#0d1117; --line:#3d444d; --ok:#3fb950; }
  }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100dvh; display:grid; place-items:center; background:var(--bg); color:var(--fg);
         font:14px/1.6 ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace; padding:1.5rem; }
  .card { width:100%; max-width:34rem; border:1px solid var(--line); border-radius:6px; padding:1.75rem; }
  h1 { font-size:14px; font-weight:600; margin:0 0 1.5rem; letter-spacing:.02em; }
  h1 .dim { color:var(--dim); font-weight:400; }
  .bar { font-size:12px; letter-spacing:-.05em; white-space:nowrap; overflow:hidden; margin:0 0 .5rem; }
  .pct { color:var(--dim); font-variant-numeric:tabular-nums; }
  .beat { color:var(--dim); margin:0 0 1.75rem; min-height:1.6em; }
  .note { color:var(--dim); font-size:12px; margin:0 0 1.5rem; }
  a { color:inherit; }
  .done { color:var(--ok); }
</style>
</head><body>
  <div class="card">
    <h1>turning to <strong>${page}</strong> <span class="dim">· doublej</span></h1>
    <p class="bar"><span id="bar"></span> <span class="pct" id="pct">0%</span></p>
    <p class="beat" id="beat">waking the runner…</p>
    <p class="note">
      A GitHub Action is rewriting the profile README one commit at a time. This page will
      hand you back the moment the new tab is live — no need to click anything twice.
    </p>
    <p class="note"><a href="${PROFILE}" id="skip">go back now →</a></p>
  </div>
<script>
  const WIDTH = 34, MAX = ${MAX_WAIT_SECONDS};
  const beats = ["waking the runner…", "resolving the monorepo that is not a monorepo…",
                 "rendering the page…", "committing it, one frame at a time…", "almost…"];
  const bar = document.getElementById("bar"), pct = document.getElementById("pct"),
        beat = document.getElementById("beat");
  let t = 0, done = false;

  const paint = (p) => {
    const f = Math.round(p / 100 * WIDTH);
    bar.textContent = "[" + "\\u2593".repeat(f) + "\\u2591".repeat(WIDTH - f) + "]";
    pct.textContent = Math.round(p) + "%";
  };

  setInterval(() => {
    if (done) return;
    t += 0.25;
    // Ease toward 95 and wait there; the poll decides when it is really finished.
    paint(Math.min(95, 95 * (1 - Math.exp(-t / 9))));
    beat.textContent = beats[Math.min(beats.length - 1, Math.floor(t / 6))];
  }, 250);

  const finish = () => {
    done = true; paint(100);
    beat.innerHTML = '<span class="done">deployed \\u2014 sending you back…</span>';
    setTimeout(() => location.replace("${PROFILE}"), 700);
  };

  const poll = async () => {
    if (done) return;
    if (t >= MAX) return finish();
    try {
      const r = await fetch("/status?p=${page}", { cache: "no-store" });
      if ((await r.json()).landed) return finish();
    } catch (e) { /* keep waiting; the cap will fire */ }
    setTimeout(poll, 2000);
  };
  // Give the workflow a moment to exist before asking whether it is done.
  setTimeout(poll, 5000);
</script>
<noscript>
  <meta http-equiv="refresh" content="30;url=${PROFILE}">
</noscript>
</body></html>`;

const seeOther = (to: string) =>
  new Response(null, { status: 302, headers: { Location: to, "Cache-Control": "no-store" } });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const page = (url.searchParams.get("p") ?? "").trim();

    if (url.pathname === "/status") {
      const landed = env.GH_TOKEN && PAGES.includes(page)
        ? await hasLanded(page, env.GH_TOKEN)
        : false;
      return Response.json({ landed }, { headers: { "Cache-Control": "no-store" } });
    }

    if (!PAGES.includes(page)) return seeOther(PROFILE);

    // No token: hand over the issue form rather than silently doing nothing.
    if (!env.GH_TOKEN) return seeOther(issueFallback(page));

    // Losing the race is fine — someone else is already turning a page, and the
    // waiting room polls for the result either way.
    if (await claimTurn()) await dispatch(page, env.GH_TOKEN);

    return new Response(html(page), {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  },
};
