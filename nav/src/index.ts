/**
 * doublej-nav — the tab bar for a README.
 *
 * A GitHub README cannot open a link in a new tab: the markdown sanitizer strips
 * target="_blank" and forbids script. So a click always steals the tab you were
 * reading. This worker gives it straight back.
 *
 *   click a tab  ->  GET /?p=cli  ->  dispatch the navigate workflow
 *                                 ->  302 back to github.com/doublej
 *
 * The visitor bounces through in well under a second and lands where they started,
 * while the workflow rewrites the README behind them one frame at a time. Refresh
 * and you catch the loading bar.
 *
 * Without GH_TOKEN set it degrades to the original flow — a prefilled issue whose
 * body explains itself — so the tabs keep working either way.
 */

const OWNER = "doublej";
const REPO = "doublej";
const WORKFLOW = "navigate.yml";
const PROFILE = "https://github.com/doublej";

const PAGES = new Set(["home", "cli", "atlas", "framelink", "simsync",
                       "systems", "projects", "raycast", "forks"]);

/** One turn at a time. The workflow queues on its own, but there is no reason to pile them up. */
const COOLDOWN_SECONDS = 20;

interface Env {
  GH_TOKEN?: string;
}

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

async function dispatch(page: string, token: string): Promise<boolean> {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "doublej-nav",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ref: "main", inputs: { page } }),
    },
  );
  return res.ok;
}

const back = (to: string) =>
  new Response(null, {
    status: 302,
    headers: { Location: to, "Cache-Control": "no-store" },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const page = (url.searchParams.get("p") ?? url.pathname.replace(/^\//, "")).trim();

    if (!PAGES.has(page)) return back(PROFILE);

    // No token yet: hand the visitor the issue form instead of silently doing nothing.
    if (!env.GH_TOKEN) return back(issueFallback(page));

    // Losing the race is fine — someone else is already turning a page.
    if (await claimTurn()) await dispatch(page, env.GH_TOKEN);

    return back(PROFILE);
  },
};
