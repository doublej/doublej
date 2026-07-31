<pre>

  doublej
  ────────────────────────────────────────────────────────────────────────────────────────────────────
  Jurre-Jan Smit  ·  Netherlands  ·  poolsuite.partners


  CLI TOOLS  ─────────────────────────────────────────────────────────────────────────────────────────

  Everything I drive from a terminal. Linked names are public repos;
  plain names live in private repos and are described here instead.

   agents, terminal & workflow

   <a href="https://github.com/doublej/ccom">ccom</a>                             Plain English to a shell command, shown before it runs
   <a href="https://github.com/doublej/bpr">bpr</a>                              Beeper CLI for agents: stable ids, JSON when piped, prime
   <a href="https://github.com/doublej/strandkanban">strand</a>                           One command opens a Kanban board over your beads issues
   <a href="https://github.com/doublej/reminders-beads-bridge">rbridge</a>                          Drive beads, agent sessions and Claude tabs from Apple Reminders
   <a href="https://github.com/doublej/claude-verbs-cli">claude-verbs</a>                     Install themed spinner verb sets into Claude Code
   cav                              Supervisor TUI coordinating several Claude Code agents
   gh-inbox                         Relevance-filtered GitHub issue and PR triage
   <a href="https://github.com/doublej/atlas-picker">atlas-picker</a>                     Rust TUI: fuzzy-pick any project on disk and jump into it

   machines & environment

   <a href="https://github.com/doublej/onenv">onenv</a>                            1Password-backed env vars with an agent-friendly CLI
   <a href="https://github.com/doublej/nordvpn-cli-macos">nordvpn</a>                          NordVPN over WireGuard on macOS, CLI plus TUI
   cdy                              Reverse proxies, static sites and certs on the NAS, over SSH
   qnap-cli                         QNAP NAS services, storage, files, power and users
   hn                               Work on other machines on the LAN as if they were local
   rig                              YAML control plane for a VR sim-racing PC (CLI, API, VR UI)
   swcache                          List and delete stale Chrome service-worker caches

   media & files

   <a href="https://github.com/doublej/shazam-export">shazam-export</a>                    Export Shazam history to CSV, JSON, GeoJSON, GPX, KML, HTML
   <a href="https://github.com/doublej/ss-image-processor">c4d2pixi</a>                         Batch image-sequence processing for VFX and 3D pipelines
   kfcut                            Keyframe-aware video cutting with no re-encode, plus ASR
   micstream                        Turn phones into wireless mics for the Mac over the LAN
   rotary                           The DJ's operating system: crawl, enrich, query and mix crates

   data & scraping

   <a href="https://github.com/doublej/flt">flt</a>                              Flight search, price-by-date comparison and trip export
   <a href="https://github.com/doublej/marktplaats">marktplaats</a>                      Marktplaats scraper library with CLI, MCP server and UI
   <a href="https://github.com/doublej/snail-mail-parser">snail-mail</a>                       Parse physical mail with an LLM and manage it like email
   <a href="https://github.com/doublej/apple-notes-sync">apple-notes-sync</a>                 Two-way task sync: Markdown, Apple Reminders, Apple Notes
   <a href="https://github.com/doublej/sheet-cms">sheet-cms</a>                        Bidirectional sync between Google Sheets and local JSON
   umami                            Agent-first CLI for Umami analytics
   fin                              Aggregate bank and broker balances and transactions locally
   fb-scrape                        Facebook group scraper with CLI, API and web UI

   debug & devices

   <a href="https://github.com/doublej/pixi-devtools-cli">pixi-debug</a>                       Debug PixiJS apps over the Chrome DevTools Protocol
   <a href="https://github.com/doublej/sagemcom-mcp">sagemcom-cli</a>                     Open and close router ports from the shell or an LLM
   soundlink                        BLE test kit for SoundLink Max: scan, GATT, firmware
   simstew                          Voice assistant for VR sim racing


  HIGHLIGHTS  ────────────────────────────────────────────────────────────────────────────────────────

  ╔══════════════════════════════════════════════════════════════════════════════════════════════════╗
  ║                                                                                                  ║
  ║  <a href="https://github.com/doublej/consult-user-mcp">consult-user-mcp</a>                                                                          ★ 40  ║
  ║                                                                                                  ║
  ║  Native macOS dialogs for MCP agents.                                                            ║
  ║                                                                                                  ║
  ║  Sidecar Swift app + Python bridge giving Claude Code real interactive UI:                       ║
  ║  confirms, picks, multi-question forms, slider tweak panes that write live to disk.              ║
  ║                                                                                                  ║
  ║  →  <a href="https://github.com/doublej/consult-user-mcp">source</a>                                                                                       ║
  ║  →  <a href="https://doublej.github.io/consult-user-mcp/">documentation</a>                                                                                ║
  ║                                                                                                  ║
  ╚══════════════════════════════════════════════════════════════════════════════════════════════════╝

  ┌──────────────────────────────────────────────┐    ┌──────────────────────────────────────────────┐
  │  <a href="https://github.com/doublej/ccom">ccom</a>                                        │    │  <a href="https://github.com/doublej/strandkanban">strandkanban</a>                                │
  │  Plain English → shell command via Claude.   │    │  SvelteKit board wrapping the beads CLI.     │
  │  Shows the proposed command before running   │    │  Drag-and-drop Kanban over your bd issues    │
  │  so you can confirm, edit, or pipe further.  │    │  with live sync and dependency arrows.       │
  │                                              │    │                                              │
  │  → <a href="https://github.com/doublej/ccom">source</a>     → <a href="https://doublej.github.io/ccom/">docs</a>                         │    │  → <a href="https://github.com/doublej/strandkanban">source</a>                                    │
  │                                              │    │                                              │
  └──────────────────────────────────────────────┘    └──────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────┐    ┌──────────────────────────────────────────────┐
  │  <a href="https://github.com/doublej/flt">flt</a>                                         │    │  <a href="https://github.com/doublej/onenv">onenv</a>                                       │
  │  Flight search across CLI, TUI, and web.     │    │  1Password-backed env var manager.           │
  │  Scrapes Google Flights, compares prices     │    │  CLI + TUI for humans, HTTP API for agents   │
  │  by date range, builds and exports trips.    │    │  with permission brokering. No more .env.    │
  │                                              │    │                                              │
  │  → <a href="https://github.com/doublej/flt">source</a>     → <a href="https://doublej.github.io/flt/">docs</a>                         │    │  → <a href="https://github.com/doublej/onenv">source</a>                                    │
  │                                              │    │                                              │
  └──────────────────────────────────────────────┘    └──────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────┐    ┌──────────────────────────────────────────────┐
  │  <a href="https://github.com/doublej/claude-verbs">claude-verbs</a>                                │    │  <a href="https://github.com/doublej/mermaid-gantt">mermaid-gantt</a>                               │
  │  Themed spinner verb sets for Claude Code.   │    │  Keyboard-first Gantt chart editor.          │
  │  Community-contributed, browsable online,    │    │  Type Mermaid syntax, see live diagram.      │
  │  installed with a single CLI command.        │    │  Round-trip import/export for planning.      │
  │                                              │    │                                              │
  │  → <a href="https://github.com/doublej/claude-verbs">source</a>     → <a href="https://claudeverbs.com">site</a>                         │    │  → <a href="https://github.com/doublej/mermaid-gantt">source</a>                                    │
  │                                              │    │                                              │
  └──────────────────────────────────────────────┘    └──────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────┐    ┌──────────────────────────────────────────────┐
  │  <a href="https://github.com/doublej/nordvpn-cli-macos">nordvpn-cli-macos</a>                           │    │  <a href="https://github.com/doublej/browser-router">browser-router</a>                              │
  │  Unofficial NordVPN CLI + TUI for macOS.     │    │  Menu bar app routing URLs to browsers.      │
  │  Uses WireGuard directly — no Electron, no   │    │  Rule-based: dev → Chrome, work → Firefox,   │
  │  menu bar app, just configs and a fast CLI.  │    │  social → default. Reclaim your default.     │
  │                                              │    │                                              │
  │  → <a href="https://github.com/doublej/nordvpn-cli-macos">source</a>                                    │    │  → <a href="https://github.com/doublej/browser-router">source</a>                                    │
  │                                              │    │                                              │
  └──────────────────────────────────────────────┘    └──────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────┐    ┌──────────────────────────────────────────────┐
  │  <a href="https://github.com/doublej/laptop-light">laptop-light</a>                                │    │  <a href="https://github.com/doublej/?tab=repositories">more  →</a>                                     │
  │  Turns a laptop screen into ambient light.   │    │  94 public repos and counting,               │
  │  Warm tones, candle flicker, HDR/P3 colour,  │    │  267 repos in total, public and private.     │
  │  wake lock, phone remote over WebRTC.        │    │  Browse the full set:                        │
  │                                              │    │                                              │
  │  → <a href="https://github.com/doublej/laptop-light">source</a>                                    │    │  → <a href="https://github.com/doublej/?tab=repositories">github.com/doublej?tab=repositories</a>       │
  │                                              │    │                                              │
  └──────────────────────────────────────────────┘    └──────────────────────────────────────────────┘


  ATLAS  ─────────────────────────────────────────────────────────────────────────────────────────────

             __  __                       _      __            
      ____ _/ /_/ /___ ______      ____  (_)____/ /_____  _____
     / __ `/ __/ / __ `/ ___/_____/ __ \/ / ___/ //_/ _ \/ ___/
    / /_/ / /_/ / /_/ (__  )_____/ /_/ / / /__/ ,< /  __/ /    
    \__,_/\__/_/\__,_/____/     / .___/_/\___/_/|_|\___/_/     
                               /_/                              

    find.  pick.  go.

   atlas-api                        SvelteKit backend serving the project graph, port 47891
   <a href="https://github.com/doublej/atlas-picker">atlas-picker</a>                     Rust TUI: splash logo, fuzzy fast project picking
   <a href="https://github.com/doublej/atlas-browser">atlas-browser</a>                    Raycast extension to browse and search indexed projects


  PROJECTS  ──────────────────────────────────────────────────────────────────────────────────────────

   <a href="https://github.com/doublej/consult-user-mcp">consult-user-mcp</a>                 Native dialogs, forms and slider panes for MCP agents
   <a href="https://github.com/doublej/ConsultUserSketch">ConsultUserSketch</a>                Grid layout sketcher behind consult-user-mcp propose_layout
   <a href="https://github.com/doublej/strandkanban">strandkanban</a>                     Drag-and-drop Kanban board for beads issues
   <a href="https://github.com/doublej/mermaid-gantt">mermaid-gantt</a>                    Keyboard-first Gantt editor with Mermaid import and export
   <a href="https://github.com/doublej/kanban-claude">kanban-claude</a>                    WebSocket server wrapping the Claude Agent SDK
   <a href="https://github.com/doublej/prompt-analysis">prompt-analysis</a>                  Distil project briefings out of Claude Code session history
   <a href="https://github.com/doublej/claude-history-browser">claude-history-browser</a>           Web UI for browsing and analysing Claude Code history
   <a href="https://github.com/doublej/claude-verbs">claude-verbs</a>                     Community-contributed spinner verb sets for Claude Code
   <a href="https://github.com/doublej/cookiecutter-templates">cookiecutter-templates</a>           Project templates by language and framework, agent-ready
   <a href="https://github.com/doublej/browser-router">browser-router</a>                   Menu bar app routing URLs to browsers by rule
   <a href="https://github.com/doublej/Scoot">Scoot</a>                            Disk usage analyser with live scanning and a 3D depth view
   <a href="https://github.com/doublej/apple-notes-sync">apple-notes-sync</a>                 Two-way task sync between Markdown, Reminders and Notes
   <a href="https://github.com/doublej/sheet-cms">sheet-cms</a>                        Bidirectional sync between Google Sheets and local JSON
   <a href="https://github.com/doublej/pii-filter-proxy">pii-filter-proxy</a>                 Proxy between app and LLM that swaps out PII
   <a href="https://github.com/doublej/web-haptics-polyfill">web-haptics-polyfill</a>             Cross-platform haptic feedback for the mobile web
   <a href="https://github.com/doublej/orphan-obliterator">orphan-obliterator</a>               Prevent orphaned words on the last line of HTML elements
   <a href="https://github.com/doublej/doublej-project-linking">doublej-project-linking</a>          Corner widget with path-based profiles and Short.io shortening
   <a href="https://github.com/doublej/pixi-adaptive-glass">pixi-adaptive-glass</a>              Refraction and chromatic aberration glass plugin for PixiJS
   <a href="https://github.com/doublej/pixi-paper">pixi-paper</a>                       Real-time comparison of HTML-to-canvas screenshot libraries
   <a href="https://github.com/doublej/batch-qr-generator">batch-qr-generator</a>               Data-driven QR code generator built with Svelte 5
   <a href="https://github.com/doublej/laptop-light">laptop-light</a>                     Turn a laptop screen into warm ambient light, phone remote
   <a href="https://github.com/doublej/siargao-market">siargao-market</a>                   Marketplace site for listings scraped from Siargao FB groups
   <a href="https://github.com/doublej/pimpelmees-wallgen-psd-tool">pimpelmees-wallgen-psd-tool</a>      macOS app: validate PSD specs, convert to print-ready TIFF


  RAYCAST PLUGINS  ───────────────────────────────────────────────────────────────────────────────────

   <a href="https://github.com/doublej/raycast-ext-active-ports">Active Ports</a>                     View active TCP ports, kill processes, restart dev servers
   <a href="https://github.com/doublej/raycast-ext-caddyfile-tools">Caddyfile Tools</a>                  Manage the NAS Caddyfile: open, generate passwords, apply
   <a href="https://github.com/doublej/raycast-ext-caveman-compress">Caveman Compress</a>                 Compress selected text via LLM or heuristic backends
   <a href="https://github.com/doublej/raycast-ext-chatgpt-software">ChatGPT Software Question</a>        Ask ChatGPT about the frontmost application
   <a href="https://github.com/doublej/claude-code-launcher">Claude Code Launcher</a>             Open Claude Code in any directory, in your terminal of choice
   <a href="https://github.com/doublej/claude-history">Claude History</a>                   Search and browse Claude Code session history across projects
   <a href="https://github.com/doublej/raycast-ext-clean-text">Clean Text</a>                       Clean clipboard text with the fabric clean_text pattern
   <a href="https://github.com/doublej/raycast-ext-clean-watermark">Clean Watermark</a>                  Remove watermarks, formatting and junk from clipboard text
   <a href="https://github.com/doublej/raycast-ext-file-scripts">File Scripts</a>                     Run ffmpeg presets on the Finder selection, with live progress
   <a href="https://github.com/doublej/raycast-ext-hide-my-email">Hide My Email</a>                    Generate Apple Hide My Email addresses
   <a href="https://github.com/doublej/raycast-ext-insecure-chrome">Insecure Chrome</a>                  Launch Chrome Canary with insecure HTTP flags for local dev
   <a href="https://github.com/doublej/raycast-ext-openrouter-key">OpenRouter Key</a>                   Create API keys on OpenRouter
   <a href="https://github.com/doublej/atlas-browser">Project Browser</a>                  Browse and search indexed projects with framework detection
   <a href="https://github.com/doublej/raycast-ext-save-api-key">Save API Key</a>                     Securely save API keys
   <a href="https://github.com/doublej/raycast-ext-wake-pc">Wake PC</a>                          Send a Wake-on-LAN magic packet to wake your PC
   <a href="https://github.com/doublej/watermark-washer">Watermark Washer</a>                 Clean the clipboard of invisible AI watermarks
   <a href="https://github.com/doublej/raycast-ext-wrap-text">Wrap Text</a>                        Wrap clipboard or selected text in XML-like tags
   <a href="https://github.com/doublej/raycast-ext-ziggo-router">Ziggo Router</a>                     Ziggo router control


  RAYCAST SCRIPTS  ───────────────────────────────────────────────────────────────────────────────────

   raycast-ext-keyboard-backlight   MacBook keyboard backlight control
   <a href="https://github.com/doublej/raycast-ext-text-tools">raycast-ext-text-tools</a>           Text transformation tools


  FORKS  ─────────────────────────────────────────────────────────────────────────────────────────────

   <a href="https://github.com/doublej/cui">cui</a>                              Web UI for Claude Code agents, ported to the Agent SDK
   <a href="https://github.com/doublej/poolsuite-cli">poolsuite-cli</a>                    Poolsuite FM in the terminal
   <a href="https://github.com/doublej/mcpick">mcpick</a>                           CLI for dynamically managing MCP server configurations
   <a href="https://github.com/doublej/whatsapp-mcp-ts">whatsapp-mcp-ts</a>                  WhatsApp MCP server (TypeScript / Baileys)
   <a href="https://github.com/doublej/Gmail-MCP-Server">Gmail-MCP-Server</a>                 Gmail MCP server with auto authentication
   <a href="https://github.com/doublej/portainer-mcp">portainer-mcp</a>                    Portainer MCP server
   <a href="https://github.com/doublej/libgen-downloader">libgen-downloader</a>                Search and download ebooks from libgen in a TUI
   <a href="https://github.com/doublej/npo-dl-webui">npo-dl-webui</a>                     NPO Start download tool with a web UI
   <a href="https://github.com/doublej/globe">globe</a>                            Interactive ASCII globe generator
   <a href="https://github.com/doublej/cookiecutter-uv">cookiecutter-uv</a>                  Modern cookiecutter template for Python projects using uv
   <a href="https://github.com/doublej/comfy-ui">comfy-ui</a>                         ComfyUI node system for running plain Python functions

</pre>

![](https://umami-inky-two.vercel.app/p/QL68zROQG)
