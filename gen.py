#!/usr/bin/env python3
"""Generate the doublej profile README from structured data."""

W = 102          # total line width
NAMECOL = 3      # indent before the name
DESCCOL = 36     # column where descriptions start

GH = "https://github.com/doublej/"


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
    return "\n" + left + "\u00b7" * (W - len(left))


def cli_row(name, repo, desc):
    """Like row(), but prompted \u2014 the CLI section reads as things you type."""
    label = f'<a href="{GH}{repo}">{name}</a>' if repo else name
    pad = " " * (DESCCOL - NAMECOL - 2 - len(name))
    assert len(name) <= DESCCOL - NAMECOL - 3, name
    assert len(desc) <= W - DESCCOL, (len(desc), desc)
    return " " * NAMECOL + "$ " + label + pad + desc


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
    ("framelink", None, "Wireless PC-VR to Quest 3 \u2014 Bun control plane, Zig data plane"),
    ("frameclarity", None, "Per-game Quest optimizer over ADB: Rust core, Tauri, APK"),
    ("quest-link-bridge", None, "Meta Quest Link (XRSP) protocol RE, bridged into SteamVR"),
    ("simsync", None, "Set your wheel up once, use it in every racing sim"),
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
    ("Keyboard Backlight", None, "Control MacBook keyboard backlight brightness"),
    ("Clean Text", "raycast-ext-clean-text", "Clean clipboard text with the fabric clean_text pattern"),
    ("Clean Watermark", "raycast-ext-clean-watermark", "Remove watermarks, formatting and junk from clipboard text"),
    ("File Scripts", "raycast-ext-file-scripts", "Run ffmpeg presets on the Finder selection, with live progress"),
    ("Insecure Chrome", "raycast-ext-insecure-chrome", "Launch Chrome Canary with insecure HTTP flags for local dev"),
    ("OpenRouter Key", "raycast-ext-openrouter-key", "Create API keys on OpenRouter"),
    ("Wake PC", "raycast-ext-wake-pc", "Send a Wake-on-LAN magic packet to wake your PC"),
    ("Text Tools", "raycast-ext-text-tools", "Clean, unwrap and wrap clipboard text"),
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

    box = "┌───────────┐"
    lines = [
        place([(trunk, "~/Documents/development")]),
        place([(trunk, "│")]),
        place([(trunk, "▼")]),
        " " * (trunk - 6) + box,
        " " * (trunk - 6) + "│ atlas-api │" + "    :47891  ·  scans, types, caches the graph",
        " " * (trunk - 6) + "└─────┬─────┘" + "    .atlas-cache.json  ·  60s TTL, revalidating",
        place([(trunk, "│")]),
    ]

    # the fan-out rail: corners at the outer consumers, tees at the inner ones, trunk in the middle
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


out = []
A = out.append

A("<pre>")
A("")
A("  doublej")
A("  " + "─" * (W - 2))
A("  Jurre-Jan Smit  ·  Netherlands  ·  poolsuite.partners")
A("")
A("")
A(header("CLI TOOLS"))
A("")
A("  Everything I drive from a terminal. Linked names are public repos;")
A("  plain names live in private repos and are described here instead.")

for title, rows in CLI:
    A(group(title))
    A("")
    for r in rows:
        A(cli_row(*r))

A("")
A("")
A(header("HIGHLIGHTS"))
A("")

HL = """  ╔══════════════════════════════════════════════════════════════════════════════════════════════════╗
  ║                                                                                                  ║
  ║  <a href="{gh}consult-user-mcp">consult-user-mcp</a>                                                                          ★ 40  ║
  ║                                                                                                  ║
  ║  Native dialogs for MCP agents, on macOS and Windows.                                            ║
  ║                                                                                                  ║
  ║  A sidecar app and an MCP bridge giving Claude Code real interactive UI:                         ║
  ║  confirms, picks, multi-question forms, slider tweak panes that write live to disk.              ║
  ║                                                                                                  ║
  ║  →  <a href="{gh}consult-user-mcp">source</a>                                                                                       ║
  ║  →  <a href="https://doublej.github.io/consult-user-mcp/">documentation</a>                                                                                ║
  ║                                                                                                  ║
  ╚══════════════════════════════════════════════════════════════════════════════════════════════════╝""".format(gh=GH)
A(HL)
A("")


def card(name, repo, lines, links):
    """Return the 9 raw lines of one 46-wide card, without the anchor markup."""
    return (name, repo, lines, links)


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
                seg = "\u2192 " if j == 0 else "     \u2192 "
                plain += seg + label
                rich += seg + f'<a href="{url}">{label}</a>'
            out.append((plain.ljust(IW), rich + " " * (IW - len(plain))))
        else:
            out.append((" " * IW, None))
        return out

    L, R = rows(left), rows(right)
    res = ["  \u250c" + "\u2500" * 46 + "\u2510    \u250c" + "\u2500" * 46 + "\u2510"]
    for (lp, lr), (rp, rr) in zip(L, R):
        for plain in (lp, rp):
            assert len(plain) == IW, (len(plain), plain)
        res.append("  \u2502  " + (lr or lp) + "  \u2502    \u2502  " + (rr or rp) + "  \u2502")
    res.append("  \u2514" + "\u2500" * 46 + "\u2518    \u2514" + "\u2500" * 46 + "\u2518")
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
       "web UI and an MCP server \u2014 all over an",
       "engine with zero npm dependencies."],
      [("source", GH + "flt"), ("docs", "https://doublej.github.io/flt/")]),
     ("onenv", GH + "onenv",
      ["Stop committing .env. Values live in a",
       "1Password vault; onenv run injects them",
       "into a child process and they vanish when",
       "it exits. KEY=value ergonomics, unchanged."],
      [("source", GH + "onenv")])),
    (("bpr", GH + "bpr",
      ["A Beeper CLI shaped for agents. Short",
       "stable ids, a dense table on a TTY and",
       "JSON the moment you pipe it, watch",
       "subscriptions, takeout, a prime contract."],
      [("source", GH + "bpr")]),
     ("fin", None,
      ["Every account in one local ledger.",
       "ING and Revolut over PSD2, Wise on its",
       "own API, DEGIRO through degiro-connector,",
       "broker CSVs for the rest. Private."],
      [])),
    (("ccom", GH + "ccom",
      ["Plain English \u2192 shell command via Claude.",
       "Shows the proposed command before running",
       "so you can confirm, edit, or pipe further."],
      [("source", GH + "ccom"), ("docs", "https://doublej.github.io/ccom/")]),
     ("mermaid-gantt", GH + "mermaid-gantt",
      ["Keyboard-first Gantt chart editor.",
       "Type Mermaid syntax, see the diagram",
       "update live, round-trip it back out for",
       "planning somewhere else."],
      [("source", GH + "mermaid-gantt")])),
    (("nordvpn-cli-macos", GH + "nordvpn-cli-macos",
      ["Unofficial NordVPN CLI and TUI for macOS.",
       "Talks WireGuard directly \u2014 no Electron, no",
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
     ("more  \u2192", GH + "?tab=repositories",
      ["94 public repos and counting,",
       "267 in total, public and private.",
       "Browse the full set:"],
      [("github.com/doublej?tab=repositories", GH + "?tab=repositories")])),
]

for l, r in CARDS:
    out.extend(render_cards(l, r))
    A("")

A("")
A(header("ATLAS"))
A("")
A("             __  __                       _      __            ")
A("      ____ _/ /_/ /___ ______      ____  (_)____/ /_____  _____")
A("     / __ `/ __/ / __ `/ ___/_____/ __ \\/ / ___/ //_/ _ \\/ ___/")
A("    / /_/ / /_/ / /_/ (__  )_____/ /_/ / / /__/ ,< /  __/ /    ")
A("    \\__,_/\\__/_/\\__,_/____/     / .___/_/\\___/_/|_|\\___/_/     ")
A("                               /_/                              ")
A("")
A("    find.  pick.  go.")
A("")
A("")
A("  One scanner, four front ends. atlas-api walks the development folder and types every project")
A("  it finds — framework, runner, git state, scripts, deploy target, beads issues — then caches")
A("  the graph. A Rust TUI, a Raycast extension, a global CLI and a watchdog all read those same")
A("  shapes, so an action is declared once in a shared registry and turns up everywhere. Twenty-")
A("  five actions, fifteen daemons, one vocabulary, types kept byte-identical across consumers.")
A("")
out.extend(atlas_diagram())
A("")
A("")
A(row("atlas-api", None, "Scanner, cache and project graph — SvelteKit on :47891"))
A(row("atlas-cli", None, "The global `atlas`: tree, scan, pick, open, ports, new"))
A(row("atlas-picker", "atlas-picker", "Rust TUI — iocraft and Nucleo, reads the cache directly"))
A(row("atlas-browser", "atlas-browser", "Raycast: browse, filter and act on any project"))
A(row("atlas-watchdog", None, "Polls the API and restarts it through launchctl"))
A("")
A("")
A(header("SYSTEMS"))
A("")
A("  The bigger multi-repo work \u2014 VR streaming, sim racing, print pipelines, admin platforms.")
A("  All private, so described rather than linked.")
A("")
for r in SYSTEMS:
    A(row(*r))
A("")
A("")
A(header("PROJECTS"))
A("")
for r in PROJECTS:
    A(row(*r))
A("")
A("")
A(header("RAYCAST PLUGINS"))
A("")
for r in RAYCAST:
    A(row(*r))
A("")
A("")
A(header("FORKS"))
A("")
for r in FORKS:
    A(row(*r))
A("")
A("</pre>")
A("")
A("![](https://umami-inky-two.vercel.app/p/QL68zROQG)")

import pathlib
import sys
pathlib.Path(sys.argv[1]).write_text("\n".join(out) + "\n")
print("wrote", sys.argv[1], len(out), "lines")
