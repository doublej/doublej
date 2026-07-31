/**
 * doublej-nav — the tab bar for a README.
 *
 * A GitHub README cannot open a link in a new tab (the sanitizer strips target=_blank
 * and forbids script), and github.com sends `x-frame-options: deny`, so it cannot be
 * framed either. For the ~20 seconds between a click and the rebuild landing, this
 * worker owns the tab — so it serves the profile back, laid out the same way, and lets
 * the README load *inside* it.
 *
 * The trick is that it does not fake the loading state. The Action commits real frames
 * (6%, 31%, 58%, 84%, then the page), and this polls the file and shows whatever is
 * actually there, easing the bar between commits so it reads as continuous.
 *
 *   click a tab  ->  GET /?p=cli  ->  dispatch, paint the 0% frame immediately
 *                ->  poll /status, swap in each committed frame as it lands
 *                ->  tab lands -> replace() to github.com/doublej
 *
 * Two things keep the wait from looking like a dead page. The 0% frame is prerendered
 * by gen.py into frames.ts, so the loader is on screen before the runner has even
 * booted. And the poller only ever accepts a frame that is loading or is the page you
 * asked for — never the page you just left, which is what made it look stuck.
 *
 * Without GH_TOKEN it degrades to a prefilled issue whose body explains itself.
 *
 * The shell comes in two variants, because github.com does. Logged out you get the
 * 72px dark marketing header and the tab row inside the main column; logged in you get
 * the 52px GlobalNav with a full-bleed tab row, an Edit profile button, an email row
 * and Organizations. Login state cannot be detected cross-origin — every way to probe
 * it is an XS-Leak — so the shell defaults to logged out, which is the common case for
 * a public README link. A cookie on this origin can override it, read in fetch() so the
 * chosen shell is in the first byte: no flash, no client-side reflow.
 *
 *   ?dry=1   render the shell without dispatching a workflow run or polling for it.
 *            Use this for visual checking — every uncached real hit rewrites the
 *            profile README for everyone.
 *   ?view=owner|out, ?theme=light|dark   override the cookie, for the same reason.
 */

import { FRAME_0 } from "./frames";

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
  email: "jurrejan@gmail.com",
  link: "https://www.threads.com/@jurre_jan",
  followers: 7,
  following: 10,
  repositories: 267,
  publicRepos: 94,  // what a visitor who is not me counts
  stars: 95,
};

/** The two shells github.com serves for this page, and the theme override. */
type View = "owner" | "out";
type Theme = "auto" | "light" | "dark";
interface Look { view: View; theme: Theme; dry: boolean }

const VIEW_COOKIE = "djview";
const THEME_COOKIE = "djtheme";

const ORGS = [
  { login: "FrameLinkVR", avatar: "https://avatars.githubusercontent.com/u/297276893?v=4" },
];

/** Mirrors the real profile, which is what the visitor sees a second later. */
const PINNED = [
  { name: "consult-user-mcp", desc: "Consult User MCP - A Human Consultation Interface", lang: "Swift", dot: "#F05138", stars: 40, forks: 2 },
  { name: "strandkanban", desc: "A tasteful ticket system ui for agents, based on beads and claude sdk", lang: "Svelte", dot: "#ff3e00", stars: 6, forks: 1 },
  { name: "bpr", desc: "Better Beeper CLI for Agents", lang: "Go", dot: "#00ADD8", stars: 0, forks: 0 },
  { name: "flt", desc: "Search flights, compare prices across dates, build itineraries, and export data — all from your terminal.", lang: "TypeScript", dot: "#3178c6", stars: 0, forks: 0 },
  { name: "onenv", desc: "1Password-backed environment variable manager with agent friendly CLI. Replaces .env files.", lang: "TypeScript", dot: "#3178c6", stars: 0, forks: 0 },
  { name: "orphan-obliterator", desc: "Prevent orphaned words on the last line of HTML elements", lang: "TypeScript", dot: "#3178c6", stars: 0, forks: 0 },
];

const ACHIEVEMENTS = [
  { name: "Starstruck", img: "https://github.githubassets.com/assets/starstruck-default-b6610abad518.png", x: 0 },
  { name: "Pull Shark", img: "https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png", x: 2 },
  { name: "YOLO", img: "https://github.githubassets.com/assets/yolo-default-be0bbff04951.png", x: 0 },
  { name: "Quickdraw", img: "https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png", x: 0 },
];

const UMAMI = "https://umami-inky-two.vercel.app/script.js";
const UMAMI_SITE = "c10eba84-1988-43b1-a0f2-06b1c1199daf";

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

/**
 * The real contribution graph, straight off github.com — it is public and needs no
 * token. Reduced to levels only, because the source fragment ships 370 tooltips and
 * a quarter of a megabyte of hydration payload to say the same thing.
 */
async function contributions(): Promise<string> {
  const cache = caches.default;
  const key = new Request("https://doublej-nav.internal/contrib");
  const hit = await cache.match(key);
  if (hit) return hit.text();

  let out = "";
  try {
    const res = await fetch(`https://github.com/users/${OWNER}/contributions`, {
      headers: { "User-Agent": "doublej-nav" },
    });
    if (res.ok) {
      const html = await res.text();
      const total = html.match(/([\d,]+)\s*\n?\s*contributions/)?.[1] ?? "";
      const labels = [...html.matchAll(/colspan="(\d+)"[\s\S]*?aria-hidden="true"[^>]*>([A-Z][a-z]{2})</g)]
        .map((m) => `<td colspan="${m[1]}">${m[2]}</td>`).join("");
      const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
        .map((r) => [...r[1].matchAll(/data-level="(\d)"/g)].map((m) => m[1]))
        .filter((r) => r.length);
      if (rows.length) {
        const grid = rows.map((r) =>
          `<tr>${r.map((l) => `<td data-level="${l}"></td>`).join("")}</tr>`).join("");
        out = `<div class="ctitle"><h2>${total} contributions in the last year</h2>
            <span class="cset">Contribution settings ▾</span></div>
          <div class="graph"><table class="cal">
            <thead><tr><td class="cdow"></td>${labels}</tr></thead><tbody>${grid}</tbody>
          </table>
          <div class="legend"><span>Less</span>${[0, 1, 2, 3, 4]
            .map((l) => `<i data-level="${l}"></i>`).join("")}<span>More</span></div></div>`;
      }
    }
  } catch {
    /* the graph is decoration; the document is the point */
  }
  await cache.put(key, new Response(out, { headers: { "Cache-Control": "max-age=3600" } }));
  return out;
}

/** Just the document, without the tracking pixel. */
const preOf = (md: string): string => (md.match(/<pre>[\s\S]*<\/pre>/) ?? [""])[0];

/**
 * gen.py stamps every build with a marker, so landing is detected explicitly rather
 * than by pattern-matching the document. It used to look for "[page]" in the nav,
 * which silently stopped matching the day the nav became a tab strip — and a turn
 * that never registers as landed leaves the visitor sitting at 99% until the cap.
 */
const landed = (md: string, page: string) => md.includes(`<!-- nav:page=${page} -->`);
const isLoading = (md: string) => md.includes("<!-- nav:loading=");

// GitHub's own octicons, so the chrome reads right at a glance.
const ICON = {
  logo: `<svg height="32" viewBox="0 0 16 16" width="32" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>`,
  bar: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z"/></svg>`,
  plus: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"/></svg>`,
  caret: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"/></svg>`,
  issue: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"/></svg>`,
  pr: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"/></svg>`,
  inbox: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M2.8 2.06A1.75 1.75 0 0 1 4.41 1h7.18c.7 0 1.333.417 1.61 1.06l2.74 6.395c.04.093.06.194.06.295v4.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25v-4.5c0-.101.02-.202.06-.295Zm1.61.44a.25.25 0 0 0-.23.152L1.887 8H4.75a.75.75 0 0 1 .6.3L6.625 10h2.75L10.65 8.3a.75.75 0 0 1 .6-.3h2.863L11.82 2.652a.25.25 0 0 0-.23-.152Z"/></svg>`,
  search: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/></svg>`,
  book: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.001-4.823-.002-2.083c0-1.135-.92-2.056-2.055-2.056H1.5v9h3.757a3.75 3.75 0 0 1 1.994.662ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.672H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z"/></svg>`,
  repo: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>`,
  proj: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25ZM11.75 3a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Zm-8.25.75a.75.75 0 0 1 1.5 0v5.5a.75.75 0 0 1-1.5 0ZM8 3a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 3Z"/></svg>`,
  pkg: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="m8.878.392 5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.201.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0ZM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.248.248 0 0 0-.25 0ZM2.5 5.677v5.372c0 .09.048.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z"/></svg>`,
  star: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>`,
  org: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.575-.729v-.361a.75.75 0 0 1 .479-.7 1.5 1.5 0 0 0-.311-2.884.75.75 0 0 1-.7-.849A.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"/></svg>`,
  pin: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M4.456.734a1.75 1.75 0 0 1 2.826.504l.613 1.327a3.081 3.081 0 0 0 2.084 1.707l2.454.584c1.201.286 1.635 1.779.762 2.65l-1.997 1.997 3.14 3.14a.75.75 0 0 1-1.06 1.06l-3.14-3.14-1.997 1.997c-.871.873-2.364.439-2.65-.762l-.584-2.454a3.081 3.081 0 0 0-1.707-2.084l-1.327-.613a1.75 1.75 0 0 1-.504-2.826Z"/></svg>`,
  link: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 2 2 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a2 2 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 2 2 0 0 0-2.83 0l-2.5 2.5a2 2 0 0 0 0 2.83Z"/></svg>`,
  loc: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="m12.596 11.596-3.535 3.536a1.5 1.5 0 0 1-2.122 0l-3.535-3.536a6.5 6.5 0 1 1 9.192-9.193 6.5 6.5 0 0 1 0 9.193Zm-1.06-8.132v-.001a5 5 0 1 0-7.072 7.072L8 14.07l3.536-3.534a5 5 0 0 0 0-7.072ZM8 9a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 9Z"/></svg>`,
  mail: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z"/></svg>`,
  fork: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>`,
  grip: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M10 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm-4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5-5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5-5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg>`,
  pencil: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"/></svg>`,
  copilot: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M7.998 15.035c-4.562 0-7.873-2.914-7.998-3.749V9.338c.085-.628.677-1.686 1.588-2.065.013-.07.024-.143.036-.218.029-.183.06-.384.126-.612-.201-.508-.254-1.084-.254-1.656 0-.87.128-1.769.693-2.484.579-.733 1.494-1.124 2.724-1.261 1.206-.134 2.262.034 2.944.765.05.053.096.108.139.165.044-.057.094-.112.143-.165.682-.731 1.738-.899 2.944-.765 1.23.137 2.145.528 2.724 1.261.566.715.693 1.614.693 2.484 0 .572-.053 1.148-.254 1.656.066.228.098.429.126.612.012.076.024.148.037.218.924.385 1.522 1.471 1.591 2.095v1.872c0 .766-3.351 3.795-8.002 3.795Zm0-1.485c2.28 0 4.584-1.11 5.002-1.433V7.862l-.023-.116c-.49.21-1.075.291-1.727.291-1.146 0-2.059-.327-2.71-.991A3.222 3.222 0 0 1 8 6.303a3.24 3.24 0 0 1-.544.743c-.65.664-1.563.991-2.71.991-.652 0-1.236-.081-1.727-.291l-.023.116v4.255c.419.323 2.722 1.433 5.002 1.433ZM6.762 2.83c-.193-.206-.637-.413-1.682-.297-1.019.113-1.479.404-1.713.7-.247.312-.369.789-.369 1.554 0 .793.129 1.171.308 1.371.162.181.519.379 1.442.379.853 0 1.339-.235 1.638-.54.315-.322.527-.827.617-1.553.117-.935-.037-1.395-.241-1.614Zm4.155-.297c-1.044-.116-1.488.091-1.681.297-.204.219-.359.679-.242 1.614.091.726.303 1.231.618 1.553.299.305.784.54 1.638.54.922 0 1.28-.198 1.442-.379.179-.2.308-.578.308-1.371 0-.765-.123-1.242-.37-1.554-.233-.296-.693-.587-1.713-.7Z"/><path d="M6.25 9.037a.75.75 0 0 1 .75.75v1.501a.75.75 0 0 1-1.5 0V9.787a.75.75 0 0 1 .75-.75Zm4.25.75v1.501a.75.75 0 0 1-1.5 0V9.787a.75.75 0 0 1 1.5 0Z"/></svg>`,
  smiley: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm3.82 1.636a.75.75 0 0 1 1.038.175l.007.009c.103.118.22.222.35.31.264.178.683.37 1.285.37.602 0 1.02-.192 1.285-.371.13-.088.247-.192.35-.31l.007-.008a.75.75 0 0 1 1.222.87l-.022-.015c.02.013.021.015.021.015v.001l-.001.002-.002.003-.005.007-.014.019a2.066 2.066 0 0 1-.184.213c-.16.166-.338.316-.53.445-.63.418-1.37.638-2.127.629-.946 0-1.652-.308-2.126-.63a3.331 3.331 0 0 1-.715-.657l-.014-.02-.005-.006-.002-.003v-.002h-.001l.613-.432-.614.43a.75.75 0 0 1 .183-1.044ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM5 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5.25 2.25.592.416a97.71 97.71 0 0 0-.592-.416Z"/></svg>`,
  sun: `<svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm5.657-8.157a.75.75 0 0 1 0 1.061l-1.061 1.06a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.06-1.06a.75.75 0 0 1 1.06 0Zm-9.193 9.193a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0ZM8 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 8 0ZM3 8a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 3 8Zm13 0a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 16 8Zm-8 5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 13Zm3.536-1.464a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061ZM2.343 2.343a.75.75 0 0 1 1.061 0l1.06 1.061a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-1.06-1.06a.75.75 0 0 1 0-1.06Z"/></svg>`,
};

/** Light and dark as two blocks, so the media query and the cookie override agree. */
const LIGHT = `color-scheme:light;
    --fg:#1f2328; --dim:#59636e; --bg:#ffffff; --canvas:#ffffff; --topbar:#f6f8fa;
    --line:#d1d9e0; --accent:#0969da; --btn:#f6f8fa; --btnh:#eef1f4; --muted:#818b98;
    --code:#f6f8fa; --l0:#eff2f5; --l1:#aceebb; --l2:#4ac26b; --l3:#2da44e; --l4:#116329;`;

const DARK = `color-scheme:dark;
    --fg:#f0f6fc; --dim:#9198a1; --bg:#0d1117; --canvas:#0d1117; --topbar:#010409;
    --line:#3d444d; --accent:#4493f8; --btn:#212830; --btnh:#2a313c; --muted:#6e7681;
    --code:#151b23; --l0:#151b23; --l1:#033a16; --l2:#196c2e; --l3:#2ea043; --l4:#56d364;`;

const tab = (icon: string, label: string, count?: number) =>
  `<a class="tab${label === "Overview" ? " on" : ""}" href="${PROFILE}${
    label === "Overview" ? "" : "?tab=" + label.toLowerCase()}">${icon}<span class="lbl">${label}</span>${
    count === undefined ? "" : `<span class="ctr">${count}</span>`}</a>`;

const pinCard = (p: typeof PINNED[number]) => `
  <li class="pin">
    <div class="pinhead">${ICON.repo}<a href="https://github.com/${OWNER}/${p.name}">${p.name}</a><span class="badge">Public</span><span class="grip">${ICON.grip}</span></div>
    <p class="pindesc">${p.desc}</p>
    <div class="pinmeta">
      <span><i class="langdot" style="background:${p.dot}"></i>${p.lang}</span>
      ${p.stars ? `<span>${ICON.star}${p.stars}</span>` : ""}
      ${p.forks ? `<span>${ICON.fork}${p.forks}</span>` : ""}
    </div>
  </li>`;

const shell = (page: string, pre: string, graph: string, look: Look) => {
const owner = look.view === "owner";
const tabs = `<nav class="tabs">
    ${tab(ICON.book, "Overview")}
    ${tab(ICON.repo, "Repositories", owner ? ME.repositories : ME.publicRepos)}
    ${tab(ICON.proj, "Projects", 0)}
    ${tab(ICON.pkg, "Packages", 0)}
    ${tab(ICON.star, "Stars", ME.stars)}
  </nav>`;

return `<!doctype html>
<html lang="en" class="${owner ? "in" : "out"}"${
  look.theme === "auto" ? "" : ` data-theme="${look.theme}"`}><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${ME.login} (${ME.name})</title>
<link rel="icon" href="${ME.avatar}">
<script defer src="${UMAMI}" data-website-id="${UMAMI_SITE}"></script>
<style>
  /* prefers-color-scheme is exact for logged-out visitors — github.com ships
     data-color-mode="auto" and resolves it the same way. The attribute is only there
     for the visitor who told us the guess was wrong. */
  :root { ${LIGHT} }
  @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ${DARK} } }
  :root[data-theme="dark"] { ${DARK} }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--canvas); color:var(--fg);
         font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif; }
  a { color:var(--accent); text-decoration:none; }
  a:hover { text-decoration:underline; }

  /* Matching the header block to the pixel is the whole point: get it wrong and the
     handoff to github.com ends in a visible jump. Logged in that block is a 52px
     GlobalNav plus a 48px full-bleed tab row, then an 8px gap before the content.
     Logged out it is a 72px marketing header, a 24px gap, and a tab row that lives
     inside the main column instead — 37px further down the page. */
  .chrome { background:var(--topbar); color:var(--fg); }
  .out .chrome { background:#25292e; color:#ffffff; }
  .top { display:flex; align-items:center; gap:16px; padding:0 16px; height:52px; }
  .out .top { height:72px; max-width:1280px; margin:0 auto; padding:0 32px; }
  .top .mark, .top .ico { color:inherit; display:flex; align-items:center; }
  .top .grow { flex:1; }
  .crumb { font-size:14px; color:inherit; }
  .search { display:flex; align-items:center; gap:8px; color:var(--muted); background:var(--bg);
            border:1px solid var(--line); border-radius:6px; padding:5px 8px; width:272px; font-size:14px; }
  .search .slash { margin-left:auto; border:1px solid var(--line); border-radius:3px;
                   padding:0 5px; font-size:12px; line-height:18px; }
  .out .search { background:transparent; border-color:#3d444d; color:#8b949e; width:200px; }
  .out .search .slash { border-color:#3d444d; }
  .avatar-sm { width:20px; height:20px; border-radius:50%; }

  /* The marketing header does not follow the theme — it is #25292e in both. */
  .mnav { display:flex; align-items:center; gap:16px; font-size:14px; }
  .mnav span { display:flex; align-items:center; gap:2px; white-space:nowrap; }
  .signin { color:inherit; font-size:14px; white-space:nowrap; }
  .signup { color:inherit; font-size:14px; line-height:20px; white-space:nowrap;
            border:1px solid #d1d9e0; border-radius:6px; padding:5px 12px; }
  .signin:hover, .signup:hover { text-decoration:none; opacity:.8; }
  @media (max-width:1012px) { .mnav, .out .search { display:none; } }

  /* Classic tab row: items fill the row and underline the separator, which is an
     inset shadow rather than a border so the items can paint over it without a
     negative margin — that margin is what put a scrollbar in a 49px box. */
  .tabs { box-shadow:inset 0 -1px 0 var(--line); padding:0 16px; display:flex; gap:8px;
          height:49px; margin-bottom:24px; align-items:stretch;
          overflow-x:auto; overflow-y:hidden; }
  .tab { display:flex; align-items:center; gap:8px; padding:0 8px; color:var(--fg);
         font-size:14px; border-bottom:2px solid transparent; white-space:nowrap; }
  .tab:hover { text-decoration:none; border-bottom-color:var(--line); }
  .tab.on .lbl { font-weight:600; }
  .tab.on { border-bottom-color:#fd8c73; }
  .tab svg { color:var(--dim); }
  .ctr { background:rgba(129,139,152,.12); border-radius:20px; padding:2px 6px;
         font-size:12px; line-height:14px; color:var(--fg); }
  /* GlobalNav tab row: no icons, 32px items sitting 8px down, underline at y+32. */
  .in .tabs { height:48px; padding:8px 16px 0; margin-bottom:0; align-items:flex-start; }
  .in .tab { height:32px; padding:6px 8px; line-height:20px; border-bottom:0;
             border-radius:6px 6px 0 0; }
  .in .tab svg { display:none; }
  .in .tab:hover { box-shadow:inset 0 -2px 0 var(--line); }
  .in .tab.on { box-shadow:inset 0 -2px 0 #fd8c73; }

  .page { max-width:1280px; margin:8px auto 0; padding:24px 32px 64px;
          display:grid; grid-template-columns:296px minmax(0,1fr); gap:24px; align-items:start; }
  .out .page { margin-top:24px; padding-top:0; }
  /* minmax(0,1fr), not 1fr: an auto minimum lets the tab row and the document set a
     floor wider than the viewport, and the whole page scrolls sideways. */
  @media (max-width:1012px) { .page { grid-template-columns:minmax(0,1fr); padding:16px; }
                              .side { max-width:22rem; } }
  /* The GlobalNav bar cannot fit its search box and six icons on a phone either. */
  @media (max-width:768px) { .in .search, .in .top .ico:not(:first-child) { display:none; } }

  .side { padding-top:8px; }
  .out .side { padding-top:17px; }
  .avawrap { position:relative; }
  .status { position:absolute; right:3px; bottom:33px; width:36px; height:36px; border-radius:50%;
            border:1px solid var(--line); background:var(--bg); color:var(--dim);
            display:flex; align-items:center; justify-content:center; cursor:pointer; }
  .side .ava { width:100%; aspect-ratio:1; border-radius:50%; border:1px solid var(--line); display:block; }
  .side h1 { font-size:24px; line-height:1.25; font-weight:600; margin:16px 0 0; }
  .side h2 { font-size:20px; line-height:24px; font-weight:300; color:var(--dim); margin:0 0 16px; }
  .btn { display:block; text-align:center; width:100%; margin:16px 0; padding:5px 16px;
         font-size:14px; line-height:20px; font-weight:500; border:1px solid var(--line);
         border-radius:6px; background:var(--btn); color:var(--fg); cursor:pointer; }
  .btn:hover { background:var(--btnh); text-decoration:none; }
  /* vcard rows are 25px on a 29px pitch, with the followers line set apart by 12. */
  .meta { color:var(--dim); font-size:14px; display:flex; align-items:center; gap:8px;
          margin:4px 0; padding:2px 0; }
  .side .meta:first-of-type { margin-bottom:12px; }
  .meta svg { color:var(--muted); flex:none; }
  .meta b { color:var(--fg); font-weight:600; }
  .side h3 { font-size:16px; font-weight:600; margin:16px 0 8px; padding-top:16px; border-top:1px solid var(--line); }
  .badges { display:flex; flex-wrap:wrap; gap:8px; }
  .badges img { width:64px; height:64px; }
  .badges span { position:relative; }
  .badges .x { position:absolute; right:-2px; bottom:2px; background:var(--bg); border:1px solid var(--line);
               border-radius:2em; font-size:11px; padding:0 4px; }

  /* The panel is a plain Box with 24px of padding; the "doublej / README.md" line is
     an ordinary flex row inside that padding, not a bordered strip — there is no
     Box-header and no separator. It is 12px monospace on an 18px line, and the extra
     1.34px logged in is the pencil's 16px glyph hanging below the baseline. The
     document itself is a markdown code block, which is where the muted background
     comes from. */
  .panel { border:1px solid var(--line); border-radius:6px; background:var(--bg); padding:24px; }
  .panelhead { display:flex; align-items:center; justify-content:space-between;
               height:18px; margin-bottom:16px; color:var(--dim);
               font:12px/18px ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace; }
  .in .panelhead { height:19.34px; }
  .panelhead .path { color:var(--fg); }
  .panelhead .right { display:flex; align-items:center; gap:8px; }
  .panelhead .ico { color:var(--dim); display:flex; }
  .dot { width:7px; height:7px; border-radius:50%; background:var(--accent); opacity:0; }
  .dot.on { opacity:1; animation:pulse 1.1s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity:.25 } 50% { opacity:1 } }
  .doc { padding:0; }
  pre { margin:0; padding:16px; background:var(--code); border-radius:6px; overflow-x:auto;
        color:var(--fg);
        font-family:"Monaspace Neon",ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
        font-size:11.9px; line-height:17.255px; }
  pre a { color:var(--accent); text-decoration:underline; }

  .sect { margin-top:32px; }
  .secthead { display:flex; align-items:center; justify-content:space-between; margin:0 0 8px; }
  .secthead h2 { font-size:16px; font-weight:400; color:var(--fg); margin:0; }
  .secthead a { font-size:12px; }
  .orgs { display:flex; flex-wrap:wrap; gap:4px; }
  .orgs img { width:32px; height:32px; border-radius:6px; }
  .grip { margin-left:auto; color:var(--muted); display:flex; }
  .graphwrap { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:16px; align-items:start; }
  .years { display:flex; flex-direction:column; gap:4px; padding-top:32px; }
  .year { border:1px solid transparent; border-radius:6px; padding:5px 16px; font-size:14px;
          color:var(--fg); text-align:left; min-width:88px; }
  .year.on { background:var(--accent); color:#fff; font-weight:500; }
  .pins { list-style:none; padding:0; margin:0; display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  @media (max-width:768px) { .pins { grid-template-columns:1fr; } }
  .pin { border:1px solid var(--line); border-radius:6px; padding:16px; display:flex; flex-direction:column; gap:8px; }
  .pinhead { display:flex; align-items:center; gap:8px; }
  .pinhead svg { color:var(--muted); }
  .pinhead a { font-weight:600; }
  .badge { border:1px solid var(--line); border-radius:2em; padding:0 7px; font-size:12px; color:var(--dim); }
  .pindesc { margin:0; color:var(--dim); font-size:12px; flex:1; }
  .pinmeta { display:flex; gap:16px; color:var(--dim); font-size:12px; align-items:center; }
  .pinmeta span { display:flex; align-items:center; gap:4px; }
  .pinmeta svg { width:12px; height:12px; }
  .langdot { width:12px; height:12px; border-radius:50%; display:inline-block; }

  .ctitle { display:flex; align-items:center; justify-content:space-between; margin:0 0 8px; }
  .ctitle h2 { font-size:16px; font-weight:400; margin:0; }
  .cset { font-size:14px; color:var(--fg); }
  .out .cset { display:none; }  /* the graph is public; the settings menu is not */
  .graph { border:1px solid var(--line); border-radius:6px; padding:16px; overflow-x:auto; }
  .cal { border-spacing:3px; border-collapse:separate; font-size:12px; color:var(--dim); }
  .cal td { padding:0; }
  .cal thead td { height:13px; text-align:left; font-weight:400; }
  .cal tbody td { width:10px; height:10px; border-radius:2px; background:var(--l0);
                  outline:1px solid rgba(27,31,35,.06); outline-offset:-1px; }
  .cal tbody td[data-level="1"], .legend i[data-level="1"] { background:var(--l1); }
  .cal tbody td[data-level="2"], .legend i[data-level="2"] { background:var(--l2); }
  .cal tbody td[data-level="3"], .legend i[data-level="3"] { background:var(--l3); }
  .cal tbody td[data-level="4"], .legend i[data-level="4"] { background:var(--l4); }
  .legend { display:flex; align-items:center; gap:3px; justify-content:flex-end;
            font-size:12px; color:var(--dim); margin-top:8px; }
  .legend i { width:10px; height:10px; border-radius:2px; background:var(--l0);
              outline:1px solid rgba(27,31,35,.06); outline-offset:-1px; }
  .legend span:first-child { margin-right:5px; }
  .legend span:last-child { margin-left:5px; }
</style>
</head><body>
  <div class="chrome">
  ${owner ? `<header class="top">
    <span class="ico">${ICON.bar}</span>
    <a class="mark" href="https://github.com/" aria-label="Homepage">${ICON.logo}</a>
    <a class="crumb" href="${PROFILE}">${ME.login}</a>
    <span class="grow"></span>
    <div class="search">${ICON.search}<span>Type <kbd>/</kbd> to search</span><span class="slash">/</span></div>
    <span class="ico">${ICON.copilot}</span>
    <span class="ico">${ICON.plus}${ICON.caret}</span>
    <span class="ico">${ICON.issue}</span>
    <span class="ico">${ICON.pr}</span>
    <span class="ico">${ICON.proj}</span>
    <span class="ico">${ICON.inbox}</span>
    <img class="avatar-sm" src="${ME.avatar}" alt="">
  </header>

  ${tabs}` : `<header class="top">
    <span class="ico">${ICON.bar}</span>
    <a class="mark" href="https://github.com/" aria-label="Homepage">${ICON.logo}</a>
    <nav class="mnav">${["Platform", "Solutions", "Resources", "Open Source", "Enterprise"]
      .map((n) => `<span>${n}${ICON.caret}</span>`).join("")}<span>Pricing</span></nav>
    <span class="grow"></span>
    <div class="search">${ICON.search}<span>Search or jump to...</span><span class="slash">/</span></div>
    <a class="signin" href="https://github.com/login">Sign in</a>
    <a class="signup" href="https://github.com/signup">Sign up</a>
    <span class="ico">${ICON.sun}</span>
  </header>`}
  </div>

  <div class="page">
    <div class="side">
      <div class="avawrap">
        <img class="ava" src="${ME.avatar}" alt="">
        ${owner ? `<button class="status" title="Set status">${ICON.smiley}</button>` : ""}
      </div>
      <h1>${ME.name}</h1>
      <h2>${ME.login}</h2>
      ${owner
        ? `<a class="btn" href="${PROFILE}">Edit profile</a>`
        : `<a class="btn" href="https://github.com/login">Follow</a>`}
      <p class="meta">${ICON.org}<span><b>${ME.followers}</b> followers · <b>${ME.following}</b> following</span></p>
      <p class="meta">${ICON.org}${ME.company}</p>
      <p class="meta">${ICON.loc}${ME.location}</p>
      ${owner ? `<p class="meta">${ICON.mail}${ME.email}</p>` : ""}
      <p class="meta">${ICON.link}<a href="${ME.link}">${ME.link}</a></p>
      <h3>Achievements</h3>
      <div class="badges">
        ${ACHIEVEMENTS.map((a) => `<span><img src="${a.img}" alt="${a.name}">${
          a.x ? `<i class="x">x${a.x}</i>` : ""}</span>`).join("")}
      </div>
      ${owner ? `<h3>Organizations</h3>
      <div class="orgs">
        ${ORGS.map((o) => `<a href="https://github.com/${o.login}"><img src="${o.avatar}" alt="${o.login}"></a>`).join("")}
      </div>` : ""}
    </div>

    <div>
      ${owner ? "" : tabs}
      <div class="panel">
        <div class="panelhead">
          <span><a class="path" href="${PROFILE}">${ME.login}</a> / <span class="path">README</span>.md</span>
          <span class="right">
            <span class="dot on" id="dot" title="rebuilding"></span>
            ${owner ? `<span class="ico">${ICON.pencil}</span>` : ""}
          </span>
        </div>
        <div class="doc" id="doc">${pre}</div>
      </div>

      <div class="sect">
        <div class="secthead"><h2>Pinned</h2>${
          owner ? `<a href="${PROFILE}">Customize your pins</a>` : ""}</div>
        <ul class="pins">${PINNED.map(pinCard).join("")}</ul>
      </div>

      <div class="sect graphwrap">
        <div>${graph}</div>
        <div class="years"><span class="year on">2026</span><span class="year">2025</span></div>
      </div>
    </div>
  </div>

<script>
  const PAGE = ${JSON.stringify(page)}, MAX = ${MAX_WAIT_SECONDS}, DRY = ${look.dry};


  // The tracker is deferred, so it may not exist yet on the first beat. Retry rather
  // than drop it — nav:request fires immediately and is the one event we cannot lose.
  const track = (name, data) => {
    let tries = 0;
    const go = () => {
      if (window.umami) return window.umami.track(name, data);
      if (++tries < 10) setTimeout(go, 500);
    };
    go();
  };
  const began = Date.now();
  if (!DRY) track("nav:request", { page: PAGE });
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

  // When the page lands, the document does not just appear — it wipes across, one
  // character cell at a time, from the loading frame to the page you asked for.
  // The sweep runs in plain text; the real markup (and its links) goes back in at
  // the end, which is also the cue to hand over to github.com.
  const NOISE = "\\u2591\\u2592\\u2593\\u2588\\u259a\\u259e\\u2599\\u259f";
  const FRAMES = 34, LEAD = 0.09;

  const textOf = (html) => {
    const d = document.createElement("div");
    d.innerHTML = html;
    return d.textContent.replace(/^\\n/, "").split("\\n");
  };

  const wipe = (toHtml, then) => {
    const A = textOf(doc.innerHTML), B = textOf(toHtml);
    const rows = Math.max(A.length, B.length);
    const cols = Math.max(1, ...A.concat(B).map((l) => l.length));
    const at = (L, r, c) => ((L[r] || "")[c] || " ");
    const style = Math.floor(Math.random() * 4);
    const edge = (r, c) =>
      style === 0 ? c / cols                                   // left to right
      : style === 1 ? r / rows                                 // top to bottom
      : style === 2 ? c / cols * 0.6 + r / rows * 0.4          // diagonal
      : ((r * 7919) ^ (c * 104729)) % 1000 / 1000;             // dissolve

    let pre = doc.querySelector("pre") || doc.appendChild(document.createElement("pre"));
    let f = 0;
    const iv = setInterval(() => {
      const p = (f / FRAMES) * (1 + LEAD);
      let out = "";
      for (let r = 0; r < rows; r++) {
        let line = "";
        for (let c = 0; c < cols; c++) {
          const e = edge(r, c);
          line += e < p - LEAD ? at(B, r, c)
                : e < p ? NOISE[(r + c + f) % NOISE.length]
                : at(A, r, c);
        }
        out += line.replace(/\\s+$/, "") + "\\n";
      }
      pre.textContent = out;
      if (++f > FRAMES) { clearInterval(iv); then(); }
    }, 24);
  };

  const poll = async () => {
    if (done) return;
    t += 1.2;
    if (t >= MAX) {
      track("nav:timeout", { page: PAGE });
      location.replace(${JSON.stringify(PROFILE)}); return;
    }
    try {
      const j = await (await fetch("/status?p=" + PAGE, { cache: "no-store" })).json();
      if (j.landed) {
        done = true; dot.classList.remove("on");
        track("nav:landed", { page: PAGE, seconds: Math.round((Date.now() - began) / 1000) });
        wipe(j.pre, () => {
          doc.innerHTML = j.pre;
          setTimeout(() => location.replace(${JSON.stringify(PROFILE)}), 700);
        });
        return;
      }
      // Only ever accept a loading frame. Anything else is the page you just left,
      // and swapping it in is what used to make the wait look like a stuck tab.
      if (j.loading) show(j.pre);
    } catch (e) { /* keep waiting; the cap will fire */ }
    setTimeout(poll, 1200);
  };
  // ?dry=1 renders the shell and nothing else: no dispatch, no poll, no handoff.
  if (!DRY) setTimeout(poll, 1200);
</script>
${look.dry ? "" : `<noscript><meta http-equiv="refresh" content="35;url=${PROFILE}"></noscript>`}
</body></html>`;
};

const seeOther = (to: string) =>
  new Response(null, { status: 302, headers: { Location: to, "Cache-Control": "no-store" } });

/** The query string is for checking the shell; the cookie is what visitors actually set. */
const setting = (url: URL, jar: string, param: string, name: string) =>
  url.searchParams.get(param) ??
  (jar.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"))?.[1] ?? "");

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const page = (url.searchParams.get("p") ?? "").trim();
    const nostore = { "Cache-Control": "no-store" };

    if (url.pathname === "/status") {
      if (!env.GH_TOKEN || !PAGES.includes(page)) {
        return Response.json({ landed: false, loading: false, pre: null }, { headers: nostore });
      }
      const md = await readme(env.GH_TOKEN);
      return Response.json(
        { landed: landed(md, page), loading: isLoading(md), pre: preOf(md) },
        { headers: nostore },
      );
    }

    // Logged out is the default: the README link is public, so most clicks are.
    const jar = request.headers.get("Cookie") ?? "";
    const theme = setting(url, jar, "theme", THEME_COOKIE);
    const look: Look = {
      view: setting(url, jar, "view", VIEW_COOKIE) === "owner" ? "owner" : "out",
      theme: theme === "light" || theme === "dark" ? theme : "auto",
      dry: url.searchParams.get("dry") === "1",
    };

    if (!PAGES.includes(page)) return seeOther(PROFILE);
    if (!env.GH_TOKEN && !look.dry) return seeOther(issueFallback(page));

    // The 0% frame ships with the worker, so the loader is on screen in one round
    // trip — no waiting on the contents API, let alone on the runner.
    const [claimed, graph] = await Promise.all([
      look.dry ? false : claimTurn(),
      contributions(),
    ]);
    if (claimed && env.GH_TOKEN) await dispatch(page, env.GH_TOKEN);

    return new Response(shell(page, preOf(FRAME_0[page] ?? ""), graph, look), {
      headers: { "Content-Type": "text/html; charset=utf-8", ...nostore },
    });
  },
};
