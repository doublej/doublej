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
    return "\n" + " " * NAMECOL + title


CLI = [
    ("agents, terminal & workflow", [
        ("ccom", "ccom", "Plain English to a shell command, shown before it runs"),
        ("bpr", "bpr", "Beeper CLI for agents: stable ids, JSON when piped, prime"),
        ("strand", "strandkanban", "One command opens a Kanban board over your beads issues"),
        ("rbridge", "reminders-beads-bridge", "Two-way bridge between beads issues and Apple Reminders"),
        ("claude-verbs", "claude-verbs-cli", "Install themed spinner verb sets into Claude Code"),
        ("cav", None, "Supervisor TUI coordinating several Claude Code agents"),
        ("gh-inbox", None, "Relevance-filtered GitHub issue and PR triage"),
        ("atlas-picker", "atlas-picker", "Rust TUI: fuzzy-pick any project on disk and jump into it"),
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
        ("poolsuite", "poolsuite-cli", "Poolsuite FM in the terminal"),
        ("c4d2pixi", "ss-image-processor", "Batch image-sequence processing for VFX and 3D pipelines"),
        ("kfcut", None, "Keyframe-aware video cutting with no re-encode, plus ASR"),
        ("micstream", None, "Turn phones into wireless mics for the Mac over the LAN"),
        ("rotary", None, "The DJ's operating system: library, crates and set prep"),
    ]),
    ("data & scraping", [
        ("flt", "flt", "Flight search, price-by-date comparison and trip export"),
        ("marktplaats", "marktplaats", "Marktplaats scraper library with CLI, MCP server and UI"),
        ("snail-mail", "snail-mail-parser", "Parse physical mail with an LLM and manage it like email"),
        ("apple-notes-sync", "apple-notes-sync", "Two-way task sync: Markdown, Apple Reminders, Apple Notes"),
        ("sheet-cms", "sheet-cms", "Bidirectional sync between Google Sheets and local JSON"),
        ("umami", None, "Agent-first CLI for Umami analytics"),
        ("fin", None, "Aggregate bank, broker and crypto balances locally"),
        ("fb-scrape", None, "Facebook group scraper with CLI, API and web UI"),
        ("iracing-bbg", None, "Which single iRacing purchase unlocks the most races"),
    ]),
    ("debug & devices", [
        ("pixi-debug", "pixi-devtools-cli", "Debug PixiJS apps over the Chrome DevTools Protocol"),
        ("sagemcom-cli", "sagemcom-mcp", "Open and close router ports from the shell or an LLM"),
        ("soundlink", None, "BLE test kit for SoundLink Max: scan, GATT, firmware"),
        ("simstew", None, "Voice assistant for VR sim racing"),
    ]),
]

PROJECTS = [
    ("consult-user-mcp", "consult-user-mcp", "Native macOS dialogs, forms and slider panes for MCP agents"),
    ("ConsultUserSketch", "ConsultUserSketch", "Grid layout sketcher behind consult-user-mcp propose_layout"),
    ("strandkanban", "strandkanban", "Drag-and-drop Kanban board for beads issues"),
    ("mermaid-gantt", "mermaid-gantt", "Keyboard-first Gantt editor with Mermaid import and export"),
    ("kanban-claude", "kanban-claude", "WebSocket server wrapping the Claude Agent SDK"),
    ("prompt-analysis", "prompt-analysis", "Distil project briefings out of Claude Code session history"),
    ("claude-history-browser", "claude-history-browser", "Web UI for browsing and analysing Claude Code history"),
    ("claude-verbs", "claude-verbs", "Community-contributed spinner verb sets for Claude Code"),
    ("cookiecutter-templates", "cookiecutter-templates", "Project templates by language and framework, agent-ready"),
    ("browser-router", "browser-router", "Menu bar app routing URLs to browsers by rule"),
    ("Scoot", "Scoot", "Web disk usage analyser with live scanning and 3D view"),
    ("apple-notes-sync", "apple-notes-sync", "Two-way task sync between Markdown, Reminders and Notes"),
    ("sheet-cms", "sheet-cms", "Bidirectional sync between Google Sheets and local JSON"),
    ("pii-filter-proxy", "pii-filter-proxy", "Proxy between app and LLM that swaps out PII"),
    ("web-haptics-polyfill", "web-haptics-polyfill", "Cross-platform haptic feedback for the mobile web"),
    ("orphan-obliterator", "orphan-obliterator", "Prevent orphaned words on the last line of HTML elements"),
    ("doublej-project-linking", "doublej-project-linking", "Embeddable corner widget with path-based profile matching"),
    ("pixi-adaptive-glass", "pixi-adaptive-glass", "Refraction and chromatic aberration glass plugin for PixiJS"),
    ("pixi-paper", "pixi-paper", "Real-time comparison of HTML-to-canvas screenshot libraries"),
    ("batch-qr-generator", "batch-qr-generator", "Data-driven QR code generator built with Svelte 5"),
    ("laptop-light", "laptop-light", "Turn a laptop screen into warm ambient light, phone remote"),
    ("siargao-market", "siargao-market", "Marketplace site for listings scraped from Siargao FB groups"),
    ("pimpelmees-wallgen-psd-tool", "pimpelmees-wallgen-psd-tool", "Photoshop script: validate PSD specs, convert to TIFF"),
]

RAYCAST = [
    ("Active Ports", "raycast-ext-active-ports", "View and manage active TCP ports"),
    ("Caddyfile Tools", "raycast-ext-caddyfile-tools", "Caddyfile utilities and tools"),
    ("Caveman Compress", "raycast-ext-caveman-compress", "Compress text via Claude, Codex or Ollama backends"),
    ("ChatGPT Software Question", "raycast-ext-chatgpt-software", "Ask ChatGPT about software"),
    ("Claude Code Launcher", "claude-code-launcher", "Open your favourite projects in Claude Code"),
    ("Claude History", "claude-history", "Search and browse Claude Code session history"),
    ("Clean Text", "raycast-ext-clean-text", "Clean and format text"),
    ("Clean Watermark", "raycast-ext-clean-watermark", "Remove watermarks from images"),
    ("File Scripts", "raycast-ext-file-scripts", "Run ffmpeg presets on the Finder selection, with progress"),
    ("Hide My Email", "raycast-ext-hide-my-email", "Generate Apple Hide My Email addresses"),
    ("Insecure Chrome", "raycast-ext-insecure-chrome", "Launch Chrome with security disabled for testing"),
    ("OpenRouter Key", "raycast-ext-openrouter-key", "OpenRouter API key management"),
    ("Project Browser", "atlas-browser", "Browse and search indexed projects with framework detection"),
    ("Save API Key", "raycast-ext-save-api-key", "Securely save API keys"),
    ("Wake PC", "raycast-ext-wake-pc", "Wake PC via Wake-on-LAN"),
    ("Watermark Washer", "watermark-washer", "Analyse clipboard text for invisible AI watermarks"),
    ("Wrap Text", "raycast-ext-wrap-text", "Wrap text at a specified width"),
    ("Ziggo Router", "raycast-ext-ziggo-router", "Ziggo router control"),
]

SCRIPTS = [
    ("raycast-ext-keyboard-backlight", None, "MacBook keyboard backlight control"),
    ("raycast-ext-text-tools", "raycast-ext-text-tools", "Text transformation tools"),
]

FORKS = [
    ("cui", "cui", "Web UI for Claude Code agents, ported to the Agent SDK"),
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
        A(row(*r))

A("")
A("")
A(header("HIGHLIGHTS"))
A("")

HL = """  ╔══════════════════════════════════════════════════════════════════════════════════════════════════╗
  ║                                                                                                  ║
  ║  <a href="{gh}consult-user-mcp">consult-user-mcp</a>                                                                          ★ 40  ║
  ║                                                                                                  ║
  ║  Native macOS dialogs for MCP agents.                                                            ║
  ║                                                                                                  ║
  ║  Sidecar Swift app + Python bridge giving Claude Code real interactive UI:                       ║
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
    """left/right = (name, repo, [3 desc lines], [(label, url), ...])"""
    IW = 42  # inner width between "│ " and " │"

    def cell(c, i):
        name, repo, lines, links = c
        if i == 0 or i == 8:
            return " " * IW, None
        if i == 1:
            return name.ljust(IW), f'<a href="{repo}">{name}</a>' + " " * (IW - len(name))
        if i in (2, 3, 4):
            t = lines[i - 2] if i - 2 < len(lines) else ""
            return t.ljust(IW), None
        if i == 5:
            return " " * IW, None
        if i == 6:
            plain = ""
            rich = ""
            for j, (label, url) in enumerate(links):
                seg = ("→ " if j == 0 else "     → ")
                plain += seg + label
                rich += seg + f'<a href="{url}">{label}</a>'
            return plain.ljust(IW), rich + " " * (IW - len(plain))
        return " " * IW, None

    res = []
    for i in range(9):
        if i == 0:
            res.append("  ┌" + "─" * 46 + "┐    ┌" + "─" * 46 + "┐")
            continue
        if i == 8:
            res.append("  └" + "─" * 46 + "┘    └" + "─" * 46 + "┘")
            continue
        parts = []
        for c in (left, right):
            plain, rich = cell(c, i)
            assert len(plain) == IW, (len(plain), plain)
            parts.append(rich if rich else plain)
        res.append("  │  " + parts[0] + "  │    │  " + parts[1] + "  │")
    return res


CARDS = [
    (("ccom", GH + "ccom",
      ["Plain English → shell command via Claude.",
       "Shows the proposed command before running",
       "so you can confirm, edit, or pipe further."],
      [("source", GH + "ccom"), ("docs", "https://doublej.github.io/ccom/")]),
     ("strandkanban", GH + "strandkanban",
      ["SvelteKit board wrapping the beads CLI.",
       "Drag-and-drop Kanban over your bd issues",
       "with live sync and dependency arrows."],
      [("source", GH + "strandkanban")])),
    (("flt", GH + "flt",
      ["Flight search across CLI, TUI, and web.",
       "Scrapes Google Flights, compares prices",
       "by date range, builds and exports trips."],
      [("source", GH + "flt"), ("docs", "https://doublej.github.io/flt/")]),
     ("onenv", GH + "onenv",
      ["1Password-backed env var manager.",
       "CLI + TUI for humans, HTTP API for agents",
       "with permission brokering. No more .env."],
      [("source", GH + "onenv")])),
    (("claude-verbs", GH + "claude-verbs",
      ["Themed spinner verb sets for Claude Code.",
       "Community-contributed, browsable online,",
       "installed with a single CLI command."],
      [("source", GH + "claude-verbs"), ("site", "https://claudeverbs.com")]),
     ("mermaid-gantt", GH + "mermaid-gantt",
      ["Keyboard-first Gantt chart editor.",
       "Type Mermaid syntax, see live diagram.",
       "Round-trip import/export for planning."],
      [("source", GH + "mermaid-gantt")])),
    (("nordvpn-cli-macos", GH + "nordvpn-cli-macos",
      ["Unofficial NordVPN CLI + TUI for macOS.",
       "Uses WireGuard directly — no Electron, no",
       "menu bar app, just configs and a fast CLI."],
      [("source", GH + "nordvpn-cli-macos")]),
     ("browser-router", GH + "browser-router",
      ["Menu bar app routing URLs to browsers.",
       "Rule-based: dev → Chrome, work → Firefox,",
       "social → default. Reclaim your default."],
      [("source", GH + "browser-router")])),
    (("laptop-light", GH + "laptop-light",
      ["Turns a laptop screen into ambient light.",
       "Warm tones, candle flicker, HDR/P3 colour,",
       "wake lock, phone remote over WebRTC."],
      [("source", GH + "laptop-light")]),
     ("more  →", GH + "?tab=repositories",
      ["94 public repos and counting,",
       "267 repos in total, public and private.",
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
A(row("atlas-api", None, "SvelteKit backend serving the project graph, port 47891"))
A(row("atlas-picker", "atlas-picker", "Rust TUI: splash logo, fuzzy fast project picking"))
A(row("atlas-browser", "atlas-browser", "Raycast extension to browse and search indexed projects"))
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
A(header("RAYCAST SCRIPTS"))
A("")
for r in SCRIPTS:
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
