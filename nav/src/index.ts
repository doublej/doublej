/**
 * doublej-nav — the tab bar for a README.
 *
 * A GitHub README cannot open a link in a new tab: the markdown sanitizer strips
 * target="_blank" and forbids script. So a click always steals the tab you were
 * reading, and the rebuild it kicks off takes about half a minute.
 *
 * github.com sends `x-frame-options: deny`, so the profile cannot be iframed either.
 * Instead this worker *is* the profile for a moment: it serves the current README
 * inline, styled like GitHub, dims it behind a progress card, and when the new page
 * lands it swaps the content in place and only then hands back to the real URL.
 * No reload, no blank frame — the document just rebuilds itself in front of you.
 *
 *   click a tab  ->  GET /?p=cli  ->  dispatch, serve the README + overlay
 *                ->  poll /status until the README says [cli]
 *                ->  swap in the new text, then replace() to github.com/doublej
 *
 * Without GH_TOKEN it degrades to a prefilled issue whose body explains itself.
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

/** The README as GitHub currently has it, or "" if it cannot be read. */
async function readme(token: string): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/README.md?ref=main`,
    { headers: gh(token), cf: { cacheTtl: 0 } } as RequestInit,
  );
  if (!res.ok) return "";
  const body = (await res.json()) as { content?: string };
  if (!body.content) return "";
  // atob gives latin1; the file is UTF-8 and full of box-drawing characters.
  const bytes = Uint8Array.from(atob(body.content.replace(/\n/g, "")), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Just the <pre> block — the page itself, without the tracking pixel. */
const preOf = (md: string): string => {
  const m = md.match(/<pre>[\s\S]*<\/pre>/);
  return m ? m[0] : "";
};

const landed = (md: string, page: string) =>
  md.includes(`[${page}]`) && !md.includes("LOADING");

const shell = (page: string, pre: string) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>doublej · turning to ${page}…</title>
<style>
  :root {
    color-scheme: light dark;
    --fg:#1f2328; --dim:#59636e; --bg:#ffffff; --canvas:#f6f8fa;
    --line:#d1d9e0; --accent:#0969da; --ok:#1a7f37;
  }
  @media (prefers-color-scheme: dark) {
    :root { --fg:#e6edf3; --dim:#9198a1; --bg:#0d1117; --canvas:#010409;
            --line:#3d444d; --accent:#4493f8; --ok:#3fb950; }
  }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--canvas); color:var(--fg); padding:2rem 1rem;
         font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif; }
  .wrap { max-width:1012px; margin:0 auto; position:relative; }
  .panel { background:var(--bg); border:1px solid var(--line); border-radius:6px; overflow:hidden; }
  .panelhead { padding:.5rem 1rem; border-bottom:1px solid var(--line); color:var(--dim); font-size:12px; }
  .panelbody { padding:2rem; overflow-x:auto; transition:opacity .45s ease, filter .45s ease; }
  .panelbody.busy { opacity:.45; filter:blur(1.5px); }
  pre { margin:0; font:12px/1.45 ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace; }
  pre a { color:var(--accent); text-decoration:none; }

  .overlay { position:absolute; inset:0; display:grid; place-items:center; pointer-events:none; }
  .card { pointer-events:auto; position:sticky; top:40vh; width:min(24rem,calc(100vw - 3rem));
          background:var(--bg); border:1px solid var(--line); border-radius:6px; padding:1.25rem 1.4rem;
          box-shadow:0 8px 32px rgba(0,0,0,.18); font-size:13px; }
  .card h2 { margin:0 0 1rem; font-size:13px; font-weight:600; }
  .card h2 .dim { color:var(--dim); font-weight:400; }
  .bar { font:11px/1 ui-monospace,Menlo,monospace; letter-spacing:-.05em; margin:0 0 .5rem;
         white-space:nowrap; overflow:hidden; }
  .beat { color:var(--dim); margin:0; min-height:1.5em; font-size:12px; }
  .done { color:var(--ok); }
  .card.gone { opacity:0; transform:translateY(-4px); transition:opacity .4s, transform .4s; }
</style>
</head><body>
  <div class="wrap">
    <div class="panel">
      <div class="panelhead">doublej / README.md</div>
      <div class="panelbody busy" id="body">${pre || "<pre>  rebuilding…</pre>"}</div>
    </div>
    <div class="overlay">
      <div class="card" id="card">
        <h2>turning to <strong>${page}</strong> <span class="dim">· rebuilding the page</span></h2>
        <p class="bar" id="bar"></p>
        <p class="beat" id="beat">waking the runner…</p>
      </div>
    </div>
  </div>
<script>
  const WIDTH = 30, MAX = ${MAX_WAIT_SECONDS}, PAGE = ${JSON.stringify(page)};
  const beats = ["waking the runner…", "resolving the monorepo that is not a monorepo…",
                 "rendering the page…", "committing it, one frame at a time…", "almost…"];
  const bar = document.getElementById("bar"), beat = document.getElementById("beat"),
        card = document.getElementById("card"), body = document.getElementById("body");
  let t = 0, done = false;

  const paint = (p) => {
    const f = Math.round(p / 100 * WIDTH);
    bar.textContent = "[" + "\\u2593".repeat(f) + "\\u2591".repeat(WIDTH - f) + "] " + Math.round(p) + "%";
  };

  setInterval(() => {
    if (done) return;
    t += 0.25;
    paint(Math.min(95, 95 * (1 - Math.exp(-t / 9))));
    beat.textContent = beats[Math.min(beats.length - 1, Math.floor(t / 6))];
  }, 250);

  const finish = async (pre) => {
    done = true; paint(100);
    beat.innerHTML = '<span class="done">deployed</span>';
    if (pre) body.innerHTML = pre;            // swap the document in place
    body.classList.remove("busy");
    card.classList.add("gone");
    setTimeout(() => location.replace(${JSON.stringify(PROFILE)}), 1400);
  };

  const poll = async () => {
    if (done) return;
    if (t >= MAX) return finish(null);
    try {
      const r = await fetch("/status?p=" + PAGE, { cache: "no-store" });
      const j = await r.json();
      if (j.landed) return finish(j.pre);
    } catch (e) { /* keep waiting; the cap will fire */ }
    setTimeout(poll, 2000);
  };
  setTimeout(poll, 5000);
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
        return Response.json({ landed: false }, { headers: nostore });
      }
      const md = await readme(env.GH_TOKEN);
      const ok = landed(md, page);
      // Ship the new document with the verdict so the swap needs no second round trip.
      return Response.json({ landed: ok, pre: ok ? preOf(md) : null }, { headers: nostore });
    }

    if (!PAGES.includes(page)) return seeOther(PROFILE);
    if (!env.GH_TOKEN) return seeOther(issueFallback(page));

    // Losing the race is fine — someone else is already turning a page, and the
    // overlay polls for the result either way.
    const [claimed, current] = await Promise.all([claimTurn(), readme(env.GH_TOKEN)]);
    if (claimed) await dispatch(page, env.GH_TOKEN);

    return new Response(shell(page, preOf(current)), {
      headers: { "Content-Type": "text/html; charset=utf-8", ...nostore },
    });
  },
};
