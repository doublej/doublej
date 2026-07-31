<pre>

  doublej
  ────────────────────────────────────────────────────────────────────────────────────────────────────
  Jurre-Jan Smit  ·  Netherlands  ·  poolsuite.partners


  CLI TOOLS  ─────────────────────────────────────────────────────────────────────────────────────────

  Everything I drive from a terminal. Linked names are public repos;
  plain names live in private repos and are described here instead.

   agents, terminal & workflow  ······································································

   $ <a href="https://github.com/doublej/ccom">ccom</a>                           Plain English to a shell command, shown before it runs
   $ <a href="https://github.com/doublej/bpr">bpr</a>                            Beeper CLI for agents: stable ids, JSON when piped, prime
   $ <a href="https://github.com/doublej/strandkanban">strand</a>                         One command opens a Kanban board over your beads issues
   $ <a href="https://github.com/doublej/reminders-beads-bridge">rbridge</a>                        Drive beads, agent sessions and Claude tabs from Apple Reminders
   $ <a href="https://github.com/doublej/claude-verbs-cli">claude-verbs</a>                   Install themed spinner verb sets into Claude Code
   $ cav                            Supervisor TUI coordinating several Claude Code agents
   $ gh-inbox                       Relevance-filtered GitHub issue and PR triage

   machines & environment  ···········································································

   $ <a href="https://github.com/doublej/onenv">onenv</a>                          1Password-backed env vars with an agent-friendly CLI
   $ <a href="https://github.com/doublej/nordvpn-cli-macos">nordvpn</a>                        NordVPN over WireGuard on macOS, CLI plus TUI
   $ cdy                            Reverse proxies, static sites and certs on the NAS, over SSH
   $ qnap-cli                       QNAP NAS services, storage, files, power and users
   $ hn                             Work on other machines on the LAN as if they were local
   $ rig                            YAML control plane for a VR sim-racing PC (CLI, API, VR UI)
   $ swcache                        List and delete stale Chrome service-worker caches

   media & files  ····················································································

   $ <a href="https://github.com/doublej/shazam-export">shazam-export</a>                  Export Shazam history to CSV, JSON, GeoJSON, GPX, KML, HTML
   $ <a href="https://github.com/doublej/ss-image-processor">c4d2pixi</a>                       Batch image-sequence processing for VFX and 3D pipelines
   $ kfcut                          Keyframe-aware video cutting with no re-encode, plus ASR
   $ micstream                      Turn phones into wireless mics for the Mac over the LAN
   $ rotary                         The DJ's operating system: crawl, enrich, query and mix crates

   data & scraping  ··················································································

   $ <a href="https://github.com/doublej/flt">flt</a>                            Flight search, price-by-date comparison and trip export
   $ <a href="https://github.com/doublej/marktplaats">marktplaats</a>                    Marktplaats scraper library with CLI, MCP server and UI
   $ <a href="https://github.com/doublej/snail-mail-parser">snail-mail</a>                     Parse physical mail with an LLM and manage it like email
   $ umami                          Agent-first CLI for Umami analytics
   $ fin                            Aggregate bank and broker balances and transactions locally
   $ fb-scrape                      Facebook group scraper with CLI, API and web UI

   debug & devices  ··················································································

   $ <a href="https://github.com/doublej/pixi-devtools-cli">pixi-debug</a>                     Debug PixiJS apps over the Chrome DevTools Protocol
   $ <a href="https://github.com/doublej/sagemcom-mcp">sagemcom-cli</a>                   Open and close router ports from the shell or an LLM
   $ soundlink                      BLE test kit for SoundLink Max: scan, GATT, firmware
   $ simstew                        Voice assistant for VR sim racing


  HIGHLIGHTS  ────────────────────────────────────────────────────────────────────────────────────────

  ╔══════════════════════════════════════════════════════════════════════════════════════════════════╗
  ║                                                                                                  ║
  ║  <a href="https://github.com/doublej/consult-user-mcp">consult-user-mcp</a>                                                                          ★ 40  ║
  ║                                                                                                  ║
  ║  Native dialogs for MCP agents, on macOS and Windows.                                            ║
  ║                                                                                                  ║
  ║  A sidecar app and an MCP bridge giving Claude Code real interactive UI:                         ║
  ║  confirms, picks, multi-question forms, slider tweak panes that write live to disk.              ║
  ║                                                                                                  ║
  ║  →  <a href="https://github.com/doublej/consult-user-mcp">source</a>                                                                                       ║
  ║  →  <a href="https://doublej.github.io/consult-user-mcp/">documentation</a>                                                                                ║
  ║                                                                                                  ║
  ╚══════════════════════════════════════════════════════════════════════════════════════════════════╝

  ┌──────────────────────────────────────────────┐    ┌──────────────────────────────────────────────┐
  │  <a href="https://github.com/doublej/reminders-beads-bridge">reminders-beads-bridge</a>                      │    │  <a href="https://github.com/doublej/strandkanban">strandkanban</a>                                │
  │                                              │    │                                              │
  │  Apple Reminders as an agent remote.         │    │  Drag-and-drop Kanban over beads issues.     │
  │  A macOS daemon: file and close beads        │    │  One command starts it, the issues never     │
  │  issues, drive Claude and Codex sessions,    │    │  leave your repo, and the board draws the    │
  │  read and type into live tabs from a phone.  │    │  dependency arrows the bd CLI cannot.        │
  │                                              │    │                                              │
  │  → <a href="https://github.com/doublej/reminders-beads-bridge">source</a>     → <a href="https://doublej.github.io/reminders-beads-bridge/">docs</a>                         │    │  → <a href="https://github.com/doublej/strandkanban">source</a>                                    │
  └──────────────────────────────────────────────┘    └──────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────┐    ┌──────────────────────────────────────────────┐
  │  <a href="https://github.com/doublej/flt">flt</a>                                         │    │  <a href="https://github.com/doublej/onenv">onenv</a>                                       │
  │                                              │    │                                              │
  │  Flight search in four shapes: a CLI, a      │    │  Stop committing .env. Values live in a      │
  │  green-on-black GDS-style TUI, a SvelteKit   │    │  1Password vault; onenv run injects them     │
  │  web UI and an MCP server — all over an      │    │  into a child process and they vanish when   │
  │  engine with zero npm dependencies.          │    │  it exits. KEY=value ergonomics, unchanged.  │
  │                                              │    │                                              │
  │  → <a href="https://github.com/doublej/flt">source</a>     → <a href="https://doublej.github.io/flt/">docs</a>                         │    │  → <a href="https://github.com/doublej/onenv">source</a>                                    │
  └──────────────────────────────────────────────┘    └──────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────┐    ┌──────────────────────────────────────────────┐
  │  <a href="https://github.com/doublej/bpr">bpr</a>                                         │    │  fin                                         │
  │                                              │    │                                              │
  │  A Beeper CLI shaped for agents. Short       │    │  Every account in one local ledger.          │
  │  stable ids, a dense table on a TTY and      │    │  ING and Revolut over PSD2, Wise on its      │
  │  JSON the moment you pipe it, watch          │    │  own API, DEGIRO through degiro-connector,   │
  │  subscriptions, takeout, a prime contract.   │    │  broker CSVs for the rest. Private.          │
  │                                              │    │                                              │
  │  → <a href="https://github.com/doublej/bpr">source</a>                                    │    │                                              │
  └──────────────────────────────────────────────┘    └──────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────┐    ┌──────────────────────────────────────────────┐
  │  <a href="https://github.com/doublej/ccom">ccom</a>                                        │    │  <a href="https://github.com/doublej/mermaid-gantt">mermaid-gantt</a>                               │
  │                                              │    │                                              │
  │  Plain English → shell command via Claude.   │    │  Keyboard-first Gantt chart editor.          │
  │  Shows the proposed command before running   │    │  Type Mermaid syntax, see the diagram        │
  │  so you can confirm, edit, or pipe further.  │    │  update live, round-trip it back out for     │
  │                                              │    │  planning somewhere else.                    │
  │                                              │    │                                              │
  │  → <a href="https://github.com/doublej/ccom">source</a>     → <a href="https://doublej.github.io/ccom/">docs</a>                         │    │  → <a href="https://github.com/doublej/mermaid-gantt">source</a>                                    │
  └──────────────────────────────────────────────┘    └──────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────┐    ┌──────────────────────────────────────────────┐
  │  <a href="https://github.com/doublej/nordvpn-cli-macos">nordvpn-cli-macos</a>                           │    │  <a href="https://github.com/doublej/browser-router">browser-router</a>                              │
  │                                              │    │                                              │
  │  Unofficial NordVPN CLI and TUI for macOS.   │    │  Menu bar app routing URLs to browsers.      │
  │  Talks WireGuard directly — no Electron, no  │    │  Rule-based, down to the profile: dev to     │
  │  menu bar app, just configs and a fast       │    │  Chrome, work to Firefox, everything else    │
  │  command you can script.                     │    │  to the default. Reclaim your default.       │
  │                                              │    │                                              │
  │  → <a href="https://github.com/doublej/nordvpn-cli-macos">source</a>                                    │    │  → <a href="https://github.com/doublej/browser-router">source</a>                                    │
  └──────────────────────────────────────────────┘    └──────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────┐    ┌──────────────────────────────────────────────┐
  │  <a href="https://github.com/doublej/laptop-light">laptop-light</a>                                │    │  <a href="https://github.com/doublej/?tab=repositories">more  →</a>                                     │
  │                                              │    │                                              │
  │  Turns a laptop screen into ambient light.   │    │  94 public repos and counting,               │
  │  Warm tones, candle flicker, HDR/P3 colour,  │    │  267 in total, public and private.           │
  │  a wake lock so it never sleeps, and a       │    │  Browse the full set:                        │
  │  phone remote over WebRTC.                   │    │                                              │
  │                                              │    │                                              │
  │  → <a href="https://github.com/doublej/laptop-light">source</a>                                    │    │  → <a href="https://github.com/doublej/?tab=repositories">github.com/doublej?tab=repositories</a>       │
  └──────────────────────────────────────────────┘    └──────────────────────────────────────────────┘


  ATLAS  ─────────────────────────────────────────────────────────────────────────────────────────────

             __  __                       _      __            
      ____ _/ /_/ /___ ______      ____  (_)____/ /_____  _____
     / __ `/ __/ / __ `/ ___/_____/ __ \/ / ___/ //_/ _ \/ ___/
    / /_/ / /_/ / /_/ (__  )_____/ /_/ / / /__/ ,< /  __/ /    
    \__,_/\__/_/\__,_/____/     / .___/_/\___/_/|_|\___/_/     
                               /_/                              

    find.  pick.  go.


  One scanner, four front ends. atlas-api walks the development folder and types every project
  it finds — framework, runner, git state, scripts, deploy target, beads issues — then caches
  the graph. A Rust TUI, a Raycast extension, a global CLI and a watchdog all read those same
  shapes, so an action is declared once in a shared registry and turns up everywhere. Twenty-
  five actions, fifteen daemons, one vocabulary, types kept byte-identical across consumers.

                             ~/Documents/development
                                        │
                                        ▼
                                  ┌───────────┐
                                  │ atlas-api │    :47891  ·  scans, types, caches the graph
                                  └─────┬─────┘    .atlas-cache.json  ·  60s TTL, revalidating
                                        │
             ┌──────────────────┬───────┴────────┬─────────────────┐
             ▼                  ▼                ▼                 ▼
       atlas-picker       atlas-browser      atlas-cli      atlas-watchdog
         Rust TUI            Raycast          `atlas`           launchd


   atlas-api                        Scanner, cache and project graph — SvelteKit on :47891
   atlas-cli                        The global `atlas`: tree, scan, pick, open, ports, new
   <a href="https://github.com/doublej/atlas-picker">atlas-picker</a>                     Rust TUI — iocraft and Nucleo, reads the cache directly
   <a href="https://github.com/doublej/atlas-browser">atlas-browser</a>                    Raycast: browse, filter and act on any project
   atlas-watchdog                   Polls the API and restarts it through launchctl


  SYSTEMS  ───────────────────────────────────────────────────────────────────────────────────────────

  The bigger multi-repo work — VR streaming, sim racing, print pipelines, admin platforms.
  All private, so described rather than linked.

   framelink                        Wireless PC-VR to Quest 3 — Bun control plane, Zig data plane
   frameclarity                     Per-game Quest optimizer over ADB: Rust core, Tauri, APK
   quest-link-bridge                Meta Quest Link (XRSP) protocol RE, bridged into SteamVR
   simsync                          Set your wheel up once, use it in every racing sim
   acc-native-server                The ACC dedicated server, reverse-engineered and rebuilt in Rust
   beamng-mcp                       Drive, tune and sense BeamNG.drive from any MCP client
   wallgen                          Wallpaper print pipeline: wall segmentation to press-ready art
   schakelwerk                      Field admin: a deterministic hour engine on an append-only log
   capture-resistance               Screen-capture detection, deterrence and attribution in-browser
   geluid                           Multi-device mic ingest with a live waveform viewer
   dia-tts-api                      Nari Labs Dia 1.6B wrapped as a LAN text-to-speech service


  PROJECTS  ──────────────────────────────────────────────────────────────────────────────────────────

   doublej-productivity-skills      Claude Code skills for dev, design, DevOps and creative work
   <a href="https://github.com/doublej/consult-user-mcp">consult-user-mcp</a>                 Native dialogs, forms and slider panes for MCP agents
   <a href="https://github.com/doublej/ConsultUserSketch">ConsultUserSketch</a>                Grid layout sketcher behind consult-user-mcp propose_layout
   <a href="https://github.com/doublej/mermaid-gantt">mermaid-gantt</a>                    Keyboard-first Gantt editor with Mermaid import and export
   <a href="https://github.com/doublej/kanban-claude">kanban-claude</a>                    WebSocket server wrapping the Claude Agent SDK
   <a href="https://github.com/doublej/prompt-analysis">prompt-analysis</a>                  Distil project briefings out of Claude Code session history
   <a href="https://github.com/doublej/claude-history-browser">claude-history-browser</a>           Web UI for browsing and analysing Claude Code history
   <a href="https://github.com/doublej/cookiecutter-templates">cookiecutter-templates</a>           Project templates by language and framework, agent-ready
   <a href="https://github.com/doublej/browser-router">browser-router</a>                   Menu bar app routing URLs to browsers by rule
   <a href="https://github.com/doublej/Scoot">Scoot</a>                            Disk usage analyser with live scanning and a 3D depth view
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
   Keyboard Backlight               Control MacBook keyboard backlight brightness
   <a href="https://github.com/doublej/raycast-ext-clean-text">Clean Text</a>                       Clean clipboard text with the fabric clean_text pattern
   <a href="https://github.com/doublej/raycast-ext-clean-watermark">Clean Watermark</a>                  Remove watermarks, formatting and junk from clipboard text
   <a href="https://github.com/doublej/raycast-ext-file-scripts">File Scripts</a>                     Run ffmpeg presets on the Finder selection, with live progress
   <a href="https://github.com/doublej/raycast-ext-insecure-chrome">Insecure Chrome</a>                  Launch Chrome Canary with insecure HTTP flags for local dev
   <a href="https://github.com/doublej/raycast-ext-openrouter-key">OpenRouter Key</a>                   Create API keys on OpenRouter
   <a href="https://github.com/doublej/raycast-ext-wake-pc">Wake PC</a>                          Send a Wake-on-LAN magic packet to wake your PC
   <a href="https://github.com/doublej/raycast-ext-text-tools">Text Tools</a>                       Clean, unwrap and wrap clipboard text
   <a href="https://github.com/doublej/watermark-washer">Watermark Washer</a>                 Clean the clipboard of invisible AI watermarks
   <a href="https://github.com/doublej/raycast-ext-wrap-text">Wrap Text</a>                        Wrap clipboard or selected text in XML-like tags


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
