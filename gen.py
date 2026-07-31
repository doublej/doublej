#!/usr/bin/env python3
"""Render one page of the doublej profile.

The profile is a seven-page portfolio living in a single README. Nav links open a
prefilled issue; .github/workflows/navigate.yml reads the title, runs this script
and commits the result. Clicking a tab really does redeploy the page.

    gen.py README.md --page cli
    gen.py README.md --loading cli 40
"""

import json
import pathlib
import sys
import time

W = 102          # total line width
NAMECOL = 3      # indent before the name
DESCCOL = 36     # column where descriptions start

GH = "https://github.com/doublej/"
REPO = "https://github.com/doublej/doublej"
# The tab bar proxy: dispatches the workflow, then bounces the visitor straight back.
NAV = "https://doublej-nav.jurrejan-e26.workers.dev/?p="


# ── primitives ──────────────────────────────────────────────────────────────

def header(title):
    left = "  " + title + "  "
    return left + "─" * (W - len(left))


def row(name, repo, desc):
    """repo=None -> private, rendered as plain text."""
    pad = " " * (DESCCOL - NAMECOL - len(name))
    assert len(name) <= DESCCOL - NAMECOL - 1, name
    assert len(desc) <= W - DESCCOL, (len(desc), desc)
    label = f'<a href="{GH}{repo}">{name}</a>' if repo else name
    return " " * NAMECOL + label + pad + desc


def group(title):
    """Group rule: dotted, so a solid rule always means a section and a dotted one a group."""
    left = " " * NAMECOL + title + "  "
    return "\n" + left + "·" * (W - len(left))


def cli_row(name, repo, desc):
    """Like row(), but prompted — the CLI section reads as things you type."""
    label = f'<a href="{GH}{repo}">{name}</a>' if repo else name
    pad = " " * (DESCCOL - NAMECOL - 2 - len(name))
    assert len(name) <= DESCCOL - NAMECOL - 3, name
    assert len(desc) <= W - DESCCOL, (len(desc), desc)
    return " " * NAMECOL + "$ " + label + pad + desc


# ── data ────────────────────────────────────────────────────────────────────

CLI = [
    ("agents, terminal & workflow", [
        ("ccom", "ccom", "Plain English to a shell command, shown before it runs"),
        ("bpr", "bpr", "Beeper CLI for agents: stable ids, JSON when piped, prime"),
        ("strand", "strandkanban", "One command opens a Kanban board over your beads issues"),
        ("rbridge", "reminders-beads-bridge", "Drive beads, agent sessions and Claude tabs from Apple Reminders"),
        ("claude-verbs", "claude-verbs-cli", "Install themed spinner verb sets into Claude Code"),
        ("cav", None, "Supervisor TUI coordinating several Claude Code agents"),
        ("gh-inbox", None, "Relevance-filtered GitHub issue and PR triage"),
    ]),
    ("machines & environment", [
        ("onenv", "onenv", "1Password-backed env vars with an agent-friendly CLI"),
        ("nordvpn", "nordvpn-cli-macos", "NordVPN over WireGuard on macOS, CLI plus TUI"),
        ("cdy", None, "Reverse proxies, static sites and certs on the NAS, over SSH"),
        ("qnap-cli", None, "QNAP NAS services, storage, files, power and users"),
        ("hn", None, "Work on other machines on the LAN as if they were local"),
        ("rig", None, "YAML control plane for a VR sim-racing PC (CLI, API, VR UI)"),
        ("swcache", None, "List and delete stale Chrome service-worker caches"),
    ]),
    ("media & files", [
        ("shazam-export", "shazam-export", "Export Shazam history to CSV, JSON, GeoJSON, GPX, KML, HTML"),
        ("c4d2pixi", "ss-image-processor", "Batch image-sequence processing for VFX and 3D pipelines"),
        ("kfcut", None, "Keyframe-aware video cutting with no re-encode, plus ASR"),
        ("micstream", None, "Turn phones into wireless mics for the Mac over the LAN"),
        ("rotary", None, "The DJ's operating system: crawl, enrich, query and mix crates"),
    ]),
    ("data & scraping", [
        ("flt", "flt", "Flight search, price-by-date comparison and trip export"),
        ("marktplaats", "marktplaats", "Marktplaats scraper library with CLI, MCP server and UI"),
        ("snail-mail", "snail-mail-parser", "Parse physical mail with an LLM and manage it like email"),
        ("umami", None, "Agent-first CLI for Umami analytics"),
        ("fin", None, "Aggregate bank and broker balances and transactions locally"),
        ("fb-scrape", None, "Facebook group scraper with CLI, API and web UI"),
    ]),
    ("debug & devices", [
        ("pixi-debug", "pixi-devtools-cli", "Debug PixiJS apps over the Chrome DevTools Protocol"),
        ("sagemcom-cli", "sagemcom-mcp", "Open and close router ports from the shell or an LLM"),
        ("soundlink", None, "BLE test kit for SoundLink Max: scan, GATT, firmware"),
        ("simstew", None, "Voice assistant for VR sim racing"),
    ]),
]

SYSTEMS = [
    ("frameclarity", None, "Per-game Quest optimizer over ADB: Rust core, Tauri, APK"),
    ("quest-link-bridge", None, "Meta Quest Link (XRSP) protocol RE, bridged into SteamVR"),
    ("acc-native-server", None, "The ACC dedicated server, reverse-engineered and rebuilt in Rust"),
    ("beamng-mcp", None, "Drive, tune and sense BeamNG.drive from any MCP client"),
    ("wallgen", None, "Wallpaper print pipeline: wall segmentation to press-ready art"),
    ("schakelwerk", None, "Field admin: a deterministic hour engine on an append-only log"),
    ("capture-resistance", None, "Screen-capture detection, deterrence and attribution in-browser"),
    ("geluid", None, "Multi-device mic ingest with a live waveform viewer"),
    ("dia-tts-api", None, "Nari Labs Dia 1.6B wrapped as a LAN text-to-speech service"),
]

PROJECTS = [
    ("doublej-productivity-skills", None, "Claude Code skills for dev, design, DevOps and creative work"),
    ("consult-user-mcp", "consult-user-mcp", "Native dialogs, forms and slider panes for MCP agents"),
    ("ConsultUserSketch", "ConsultUserSketch", "Grid layout sketcher behind consult-user-mcp propose_layout"),
    ("mermaid-gantt", "mermaid-gantt", "Keyboard-first Gantt editor with Mermaid import and export"),
    ("kanban-claude", "kanban-claude", "WebSocket server wrapping the Claude Agent SDK"),
    ("prompt-analysis", "prompt-analysis", "Distil project briefings out of Claude Code session history"),
    ("claude-history-browser", "claude-history-browser", "Web UI for browsing and analysing Claude Code history"),
    ("cookiecutter-templates", "cookiecutter-templates", "Project templates by language and framework, agent-ready"),
    ("browser-router", "browser-router", "Menu bar app routing URLs to browsers by rule"),
    ("Scoot", "Scoot", "Disk usage analyser with live scanning and a 3D depth view"),
    ("pii-filter-proxy", "pii-filter-proxy", "Proxy between app and LLM that swaps out PII"),
    ("web-haptics-polyfill", "web-haptics-polyfill", "Cross-platform haptic feedback for the mobile web"),
    ("orphan-obliterator", "orphan-obliterator", "Prevent orphaned words on the last line of HTML elements"),
    ("doublej-project-linking", "doublej-project-linking", "Corner widget with path-based profiles and Short.io shortening"),
    ("pixi-adaptive-glass", "pixi-adaptive-glass", "Refraction and chromatic aberration glass plugin for PixiJS"),
    ("pixi-paper", "pixi-paper", "Real-time comparison of HTML-to-canvas screenshot libraries"),
    ("batch-qr-generator", "batch-qr-generator", "Data-driven QR code generator built with Svelte 5"),
    ("laptop-light", "laptop-light", "Turn a laptop screen into warm ambient light, phone remote"),
    ("siargao-market", "siargao-market", "Marketplace site for listings scraped from Siargao FB groups"),
    ("pimpelmees-wallgen-psd-tool", "pimpelmees-wallgen-psd-tool", "macOS app: validate PSD specs, convert to print-ready TIFF"),
]

RAYCAST = [
    ("Active Ports", "raycast-ext-active-ports", "View active TCP ports, kill processes, restart dev servers"),
    ("Caddyfile Tools", "raycast-ext-caddyfile-tools", "Manage the NAS Caddyfile: open, generate passwords, apply"),
    ("Caveman Compress", "raycast-ext-caveman-compress", "Compress selected text via LLM or heuristic backends"),
    ("ChatGPT Software Question", "raycast-ext-chatgpt-software", "Ask ChatGPT about the frontmost application"),
    ("Claude Code Launcher", "claude-code-launcher", "Open Claude Code in any directory, in your terminal of choice"),
    ("Claude History", "claude-history", "Search and browse Claude Code session history across projects"),
    ("Clean Text", "raycast-ext-clean-text", "Clean clipboard text with the fabric clean_text pattern"),
    ("Clean Watermark", "raycast-ext-clean-watermark", "Remove watermarks, formatting and junk from clipboard text"),
    ("File Scripts", "raycast-ext-file-scripts", "Run ffmpeg presets on the Finder selection, with live progress"),
    ("Insecure Chrome", "raycast-ext-insecure-chrome", "Launch Chrome Canary with insecure HTTP flags for local dev"),
    ("Keyboard Backlight", None, "Control MacBook keyboard backlight brightness"),
    ("OpenRouter Key", "raycast-ext-openrouter-key", "Create API keys on OpenRouter"),
    ("Text Tools", "raycast-ext-text-tools", "Clean, unwrap and wrap clipboard text"),
    ("Wake PC", "raycast-ext-wake-pc", "Send a Wake-on-LAN magic packet to wake your PC"),
    ("Watermark Washer", "watermark-washer", "Clean the clipboard of invisible AI watermarks"),
    ("Wrap Text", "raycast-ext-wrap-text", "Wrap clipboard or selected text in XML-like tags"),
]

FORKS = [
    ("cui", "cui", "Web UI for Claude Code agents, ported to the Agent SDK"),
    ("poolsuite-cli", "poolsuite-cli", "Poolsuite FM in the terminal"),
    ("mcpick", "mcpick", "CLI for dynamically managing MCP server configurations"),
    ("whatsapp-mcp-ts", "whatsapp-mcp-ts", "WhatsApp MCP server (TypeScript / Baileys)"),
    ("Gmail-MCP-Server", "Gmail-MCP-Server", "Gmail MCP server with auto authentication"),
    ("portainer-mcp", "portainer-mcp", "Portainer MCP server"),
    ("libgen-downloader", "libgen-downloader", "Search and download ebooks from libgen in a TUI"),
    ("npo-dl-webui", "npo-dl-webui", "NPO Start download tool with a web UI"),
    ("globe", "globe", "Interactive ASCII globe generator"),
    ("cookiecutter-uv", "cookiecutter-uv", "Modern cookiecutter template for Python projects using uv"),
    ("comfy-ui", "comfy-ui", "ComfyUI node system for running plain Python functions"),
]


# ── cards ───────────────────────────────────────────────────────────────────

def render_cards(left, right):
    """Each card is (name, repo_or_None, [body lines], [(label, url)]). No repo -> private."""
    IW, BODY = 42, 4

    def rows(c):
        name, repo, body, links = c
        out = [(name.ljust(IW),
                f'<a href="{repo}">{name}</a>' + " " * (IW - len(name)) if repo else None),
               (" " * IW, None)]
        for k in range(BODY):
            out.append(((body[k] if k < len(body) else "").ljust(IW), None))
        out.append((" " * IW, None))
        if links:
            plain = rich = ""
            for j, (label, url) in enumerate(links):
                seg = "→ " if j == 0 else "     → "
                plain += seg + label
                rich += seg + f'<a href="{url}">{label}</a>'
            out.append((plain.ljust(IW), rich + " " * (IW - len(plain))))
        else:
            out.append((" " * IW, None))
        return out

    L, R = rows(left), rows(right)
    res = ["  ┌" + "─" * 46 + "┐    ┌" + "─" * 46 + "┐"]
    for (lp, lr), (rp, rr) in zip(L, R):
        for plain in (lp, rp):
            assert len(plain) == IW, (len(plain), plain)
        res.append("  │  " + (lr or lp) + "  │    │  " + (rr or rp) + "  │")
    res.append("  └" + "─" * 46 + "┘    └" + "─" * 46 + "┘")
    return res


CARDS = [
    (("reminders-beads-bridge", GH + "reminders-beads-bridge",
      ["Apple Reminders as an agent remote.",
       "A macOS daemon: file and close beads",
       "issues, drive Claude and Codex sessions,",
       "read and type into live tabs from a phone."],
      [("source", GH + "reminders-beads-bridge"),
       ("docs", "https://doublej.github.io/reminders-beads-bridge/")]),
     ("strandkanban", GH + "strandkanban",
      ["Drag-and-drop Kanban over beads issues.",
       "One command starts it, the issues never",
       "leave your repo, and the board draws the",
       "dependency arrows the bd CLI cannot."],
      [("source", GH + "strandkanban")])),
    (("flt", GH + "flt",
      ["Flight search in four shapes: a CLI, a",
       "green-on-black GDS-style TUI, a SvelteKit",
       "web UI and an MCP server — all over an",
       "engine with zero npm dependencies."],
      [("source", GH + "flt"), ("docs", "https://doublej.github.io/flt/")]),
     ("onenv", GH + "onenv",
      ["Stop committing .env. Values live in a",
       "1Password vault; onenv run injects them",
       "into a child process and they vanish when",
       "it exits. KEY=value ergonomics, unchanged."],
      [("source", GH + "onenv"), ("docs", "https://doublej.github.io/onenv/")])),
    (("bpr", GH + "bpr",
      ["A Beeper CLI shaped for agents. Short",
       "stable ids, a dense table on a TTY and",
       "JSON the moment you pipe it, watch",
       "subscriptions, takeout, a prime contract."],
      [("source", GH + "bpr"), ("docs", "https://doublej.github.io/bpr/")]),
     ("fin", None,
      ["Every account in one local ledger.",
       "ING and Revolut over PSD2, Wise on its",
       "own API, DEGIRO through degiro-connector,",
       "broker CSVs for the rest. Private."],
      [])),
    (("ccom", GH + "ccom",
      ["Plain English → shell command via Claude.",
       "Shows the proposed command before running",
       "so you can confirm, edit, or pipe further."],
      [("source", GH + "ccom"), ("docs", "https://doublej.github.io/ccom/")]),
     ("mermaid-gantt", GH + "mermaid-gantt",
      ["Keyboard-first Gantt chart editor.",
       "Type Mermaid syntax, see the diagram",
       "update live, round-trip it back out for",
       "planning somewhere else."],
      [("source", GH + "mermaid-gantt"), ("mermaidgantt.xyz", "https://mermaidgantt.xyz")])),
    (("nordvpn-cli-macos", GH + "nordvpn-cli-macos",
      ["Unofficial NordVPN CLI and TUI for macOS.",
       "Talks WireGuard directly — no Electron, no",
       "menu bar app, just configs and a fast",
       "command you can script."],
      [("source", GH + "nordvpn-cli-macos")]),
     ("browser-router", GH + "browser-router",
      ["Menu bar app routing URLs to browsers.",
       "Rule-based, down to the profile: dev to",
       "Chrome, work to Firefox, everything else",
       "to the default. Reclaim your default."],
      [("source", GH + "browser-router")])),
    (("laptop-light", GH + "laptop-light",
      ["Turns a laptop screen into ambient light.",
       "Warm tones, candle flicker, HDR/P3 colour,",
       "a wake lock so it never sleeps, and a",
       "phone remote over WebRTC."],
      [("source", GH + "laptop-light")]),
     ("more  →", GH + "?tab=repositories",
      ["94 public repos and counting,",
       "267 in total, public and private.",
       "Browse the full set:"],
      [("github.com/doublej?tab=repositories", GH + "?tab=repositories")])),
]

HERO = """  ╔""" + "═" * 98 + """╗
  ║""" + " " * 98 + """║
  ║  <a href="{gh}consult-user-mcp">consult-user-mcp</a>                                                                          ★ 40  ║
  ║""" + " " * 98 + """║
  ║  Native dialogs for MCP agents, on macOS and Windows.                                            ║
  ║""" + " " * 98 + """║
  ║  A sidecar app and an MCP bridge giving Claude Code real interactive UI:                         ║
  ║  confirms, picks, multi-question forms, slider tweak panes that write live to disk.              ║
  ║""" + " " * 98 + """║
  ║  →  <a href="{gh}consult-user-mcp">source</a>                                                                                       ║
  ║  →  <a href="https://doublej.github.io/consult-user-mcp/">documentation</a>                                                                                ║
  ║""" + " " * 98 + """║
  ╚""" + "═" * 98 + "╝"


# ── the atlas diagram ───────────────────────────────────────────────────────

def atlas_diagram():
    """Scanner at the top, four consumers fanning out below it."""
    CONSUMERS = [("atlas-picker", "Rust TUI"), ("atlas-browser", "Raycast"),
                 ("atlas-cli", "`atlas`"), ("atlas-watchdog", "launchd")]
    centres = [11, 30, 47, 65]
    trunk = (centres[0] + centres[-1]) // 2

    def place(pairs):
        """pairs = [(centre, text)] -> one line with each text centred on its column."""
        line = ""
        for c, t in pairs:
            start = c - len(t) // 2
            line += " " * (start - len(line)) + t
        return line

    lines = [
        place([(trunk, "~/Documents/development")]),
        place([(trunk, "│")]),
        place([(trunk, "▼")]),
        " " * (trunk - 6) + "┌───────────┐",
        " " * (trunk - 6) + "│ atlas-api │" + "    :47891  ·  scans, types, caches the graph",
        " " * (trunk - 6) + "└─────┬─────┘" + "    .atlas-cache.json  ·  60s TTL, revalidating",
        place([(trunk, "│")]),
    ]

    rail = [" "] * (centres[-1] + 1)
    for i in range(centres[0], centres[-1] + 1):
        rail[i] = "─"
    rail[centres[0]], rail[centres[-1]] = "┌", "┐"
    for c in centres[1:-1]:
        rail[c] = "┬"
    rail[trunk] = "┴"
    lines.append("".join(rail))

    lines.append(place([(c, "▼") for c in centres]))
    lines.append(place(list(zip(centres, [n for n, _ in CONSUMERS]))))
    lines.append(place(list(zip(centres, [t for _, t in CONSUMERS]))))
    return [("  " + l).rstrip() for l in lines]


# ── navigation ──────────────────────────────────────────────────────────────

LOG = pathlib.Path(__file__).parent / "nav-log.json"


def ago(seconds):
    for unit, size in (("second", 60), ("minute", 60), ("hour", 24), ("day", 7)):
        if seconds < size:
            n = int(seconds)
            return "just now" if unit == "second" and n < 10 else f"{n} {unit}{'s' * (n != 1)} ago"
        seconds /= size
    return f"{int(seconds)} week{'s' * (int(seconds) != 1)} ago"


def activity():
    """The last 20 page turns. Relative times are frozen at build time, which is the
    joke: this clock only ticks when somebody clicks something."""
    if not LOG.exists():
        return []
    entries = json.loads(LOG.read_text())[:20]
    if not entries:
        return []
    now = time.time()
    cells = [(e["page"], ago(max(0, now - e["at"]))) for e in entries]
    half = (len(cells) + 1) // 2
    left, right = cells[:half], cells[half:]

    out = ["", header("RECENT"), "",
           "  The last 20 turns, as of the build that produced this page.", ""]
    for i, (page, when) in enumerate(left):
        line = "   " + page.ljust(16) + when.ljust(20)
        if i < len(right):
            line += right[i][0].ljust(16) + right[i][1]
        out.append(line.rstrip())
    return out


PAGES = ["home", "cli", "atlas", "framelink", "simsync", "systems", "projects",
         "raycast", "forks"]


def link(page):
    return NAV + page


def nav(active, live=True):
    """The tab strip.

    Three lines of box drawing, because a row of links reads as a list and a row of
    tabs reads as somewhere you can go. The active tab has no floor \u2014 its box opens
    straight into the page underneath, which is the whole trick: it is the only tab
    you are already inside. live=False renders it inert, for the loading frames.
    """
    i = PAGES.index(active)
    cells = [len(p) + 2 for p in PAGES]

    top = "   \u250c" + "\u252c".join("\u2500" * w for w in cells) + "\u2510"
    tail = f"page {i + 1} / {len(PAGES)}"
    top += " " * (W - len(top) - len(tail)) + tail

    left = "\u25c2" if i else " "
    right = "\u25b8" if i < len(PAGES) - 1 else " "
    mid_plain = f" {left} "
    mid_rich = mid_plain if not (live and i) else \
        f' <a href="{link(PAGES[i - 1])}">{left}</a> '
    for j, page in enumerate(PAGES):
        label = f" {page} "
        mid_plain += "\u2502" + label
        cell = label if page == active or not live else \
            f' <a href="{link(page)}">{page}</a> '
        mid_rich += "\u2502" + cell
    mid_plain += "\u2502 " + right
    mid_rich += "\u2502 " + (right if not (live and i < len(PAGES) - 1) else
                          f'<a href="{link(PAGES[i + 1])}">{right}</a>')

    bot = "\u2500\u2500\u2500"
    for j, w in enumerate(cells):
        bot += ("\u2518" if j == i else "\u2514" if j == i + 1 else "\u2534")
        bot += " " * w if j == i else "\u2500" * w
    bot += "\u2514" if i == len(PAGES) - 1 else "\u2534"
    bot += "\u2500" * (W - len(bot))

    assert len(mid_plain) <= W, len(mid_plain)
    return [top, mid_rich, bot]


def site(url, label):
    return f'  \u2192  <a href="{url}">{label}</a>'


FOOTER = [
    "  " + "\u2500" * (W - 2),
    "  A README cannot open a new tab, and github.com refuses to be framed. So for the half minute",
    "  a rebuild takes, a worker hands the profile back to you and lets this document load inside it",
    "  \u2014 not a fake progress bar, but the actual frames the Action commits, polled as they land.",
    "  Then it returns you to the real page. Five commits a turn. Refresh here and you catch one.",
    "",
    "  Capacity: one reader at a time. The workflow holds a lock, so a second click during a turn",
    "  waits its turn rather than racing it, and clicks inside the same 20 seconds are folded into",
    "  one. Fair use: turn as many pages as you like, but this is a text file behind a queue of one,",
    "  so if it feels slow, that is not the network \u2014 that is somebody else already reading.",
]




# ── pages ───────────────────────────────────────────────────────────────────

def masthead():
    """Just the byline. The name is already the page title, and the tab strip below
    supplies the rule this used to draw for itself."""
    return ["", "", "  Jurre-Jan Smit  ·  Netherlands  ·  poolsuite.partners"]


def page_home():
    out = ["", header("FEATURED"), ""]
    out.append(HERO.format(gh=GH))
    out.append("")
    for l, r in CARDS:
        out.extend(render_cards(l, r))
        out.append("")
    return out


def page_cli():
    out = ["", header("CLI TOOLS"), "",
           "  Everything I drive from a terminal. Linked names are public repos;",
           "  plain names live in private repos and are described here instead."]
    for title, rows in CLI:
        out.append(group(title))
        out.append("")
        out.extend(cli_row(*r) for r in rows)
    return out


def page_atlas():
    out = ["", header("ATLAS"), "",
           "             __  __                       _      __            ",
           "      ____ _/ /_/ /___ ______      ____  (_)____/ /_____  _____",
           "     / __ `/ __/ / __ `/ ___/_____/ __ \\/ / ___/ //_/ _ \\/ ___/",
           "    / /_/ / /_/ / /_/ (__  )_____/ /_/ / / /__/ ,< /  __/ /    ",
           "    \\__,_/\\__/_/\\__,_/____/     / .___/_/\\___/_/|_|\\___/_/     ",
           "                               /_/                              ",
           "",
           "    find.  pick.  go.",
           "",
           "",
           "  One scanner, four front ends. atlas-api walks the development folder and types every project",
           "  it finds — framework, runner, git state, scripts, deploy target, beads issues — then caches",
           "  the graph. A Rust TUI, a Raycast extension, a global CLI and a watchdog all read those same",
           "  shapes, so an action is declared once in a shared registry and turns up everywhere. Twenty-",
           "  five actions, fifteen daemons, one vocabulary, types kept byte-identical across consumers.",
           ""]
    out.extend(atlas_diagram())
    out += ["", "",
            row("atlas-api", None, "Scanner, cache and project graph — SvelteKit on :47891"),
            row("atlas-cli", None, "The global `atlas`: tree, scan, pick, open, ports, new"),
            row("atlas-picker", "atlas-picker", "Rust TUI — iocraft and Nucleo, reads the cache directly"),
            row("atlas-browser", "atlas-browser", "Raycast: browse, filter and act on any project"),
            row("atlas-watchdog", None, "Polls the API and restarts it through launchctl")]
    return out


def listing(title, intro, items):
    out = ["", header(title), ""]
    out.extend("  " + l for l in intro)
    if intro:
        out.append("")
    out.extend(row(*r) for r in items)
    return out


def page_systems():
    return listing("SYSTEMS",
                   ["The bigger multi-repo work — VR streaming, sim racing, print pipelines, admin platforms.",
                    "All private, so described rather than linked."],
                   SYSTEMS)


def page_projects():
    return listing("PROJECTS", [], PROJECTS)


def page_raycast():
    return listing("RAYCAST", ["Extensions I use every day. The launcher is half my interface."], RAYCAST)


def page_forks():
    return listing("FORKS", ["Other people's work that I run, patched to taste. Credit upstream."], FORKS)


def page_framelink():
    return ["", header("FRAMELINK"), "", site("https://www.framelink.quest/", "www.framelink.quest"), "",
            "  Wireless PC-VR streaming to a Quest 3. Low-latency capture, encode and transport, with a",
            "  control plane that keeps the session honest when the network is not.",
            "",
            "  Quest 3  \u00b7  SteamVR  \u00b7  OpenXR",
            "",
            "  Commercial product \u2014 the source stays closed."]


def page_simsync():
    return ["", header("SIMSYNC"), "", site("https://www.simsync.app/", "www.simsync.app"), "",
            "  Set your wheel up once and use it in every sim. Each racing function gets a universal",
            "  control id, so switching titles stops meaning an afternoon of remapping.",
            "",
            "  Assetto Corsa  \u00b7  Competizione  \u00b7  Evo  \u00b7  iRacing  \u00b7  F1 24  \u00b7  ETS2  \u00b7  BeamNG  \u00b7  WRC",
            "",
            "  Commercial product \u2014 the source stays closed."]


BUILDERS = {"home": page_home, "cli": page_cli, "atlas": page_atlas,
            "framelink": page_framelink, "simsync": page_simsync, "systems": page_systems,
            "projects": page_projects, "raycast": page_raycast, "forks": page_forks}


def bar(pct, width=60):
    filled = round(pct * width / 100)
    return "\u2593" * filled + "\u2591" * (width - filled)


BEATS = ["queued", "runner booting", "checking out doublej/doublej",
         "rendering with gen.py", "committing and pushing"]


def loading(target, pct):
    """The page with its body swapped for a loader, and nothing else moved.

    The block is rendered exactly as tall as the page being turned to, so the panel
    keeps its height for the whole turn — only the contents change. RECENT and the
    footer sit below it, untouched, which is what makes the swap read as the same
    document loading rather than a different, shorter one.
    """
    beat = BEATS[min(pct * len(BEATS) // 100, len(BEATS) - 1)]
    block = ["LOADING",
             "",
             f"turning to {target}",
             "",
             f"[{bar(pct)}]  {pct:>3}%",
             "",
             f"{beat}\u2026"]
    mid = [" " * ((W - len(l)) // 2) + l if l else "" for l in block]

    height = len(BUILDERS[target]())
    if height <= len(mid):
        return mid
    top = (height - len(mid)) // 2
    return [""] * top + mid + [""] * (height - len(mid) - top)


def build(page, pct=None):
    out = ["<pre>", ""]
    out += masthead()
    out += ["", ""] + nav(page, live=pct is None) + ["", ""]
    out += loading(page, pct) if pct is not None else BUILDERS[page]()
    out += activity()
    out += ["", ""] + FOOTER
    out += ["</pre>", "", "![](https://umami-inky-two.vercel.app/p/QL68zROQG)"]
    return out


def emit_frames(dest):
    """Freeze every page's 0% frame for the nav proxy.

    The proxy has to put a loading document on screen the instant you click, well
    before the runner has booted, and it must be the *same* document the workflow
    will commit a moment later or the swap would show. So it ships these, rendered
    here, by the same code. At 0% no reveal has started yet, which is why one frame
    per page is enough — the styles only diverge once the fill begins.
    """
    frames = {page: "\n".join(build(page, 0)) for page in PAGES}
    body = ",\n".join(f"  {json.dumps(k)}: {json.dumps(v)}" for k, v in frames.items())
    pathlib.Path(dest).write_text(
        "// Generated by gen.py --frames. Do not edit; run `just frames` instead.\n"
        f"export const FRAME_0: Record<string, string> = {{\n{body}\n}};\n")
    print(f"wrote {dest}  ({len(frames)} frames)")


if __name__ == "__main__":
    if "--bar" in sys.argv:                      # the workflow reuses this for its commentary
        print(bar(int(sys.argv[sys.argv.index("--bar") + 1]), 28))
        raise SystemExit
    if "--frames" in sys.argv:
        emit_frames(sys.argv[sys.argv.index("--frames") + 1])
        raise SystemExit
    dest = sys.argv[1]
    if "--loading" in sys.argv:
        i = sys.argv.index("--loading")
        lines = build(sys.argv[i + 1], int(sys.argv[i + 2]))
    else:
        i = sys.argv.index("--page") if "--page" in sys.argv else None
        lines = build(sys.argv[i + 1] if i else "home")
    pathlib.Path(dest).write_text("\n".join(lines) + "\n")
    print(f"wrote {dest}  ({len(lines)} lines)")
