<pre>

  doublej
  ────────────────────────────────────────────────────────────────────────────────────────────────────
  Jurre-Jan Smit  ·  Netherlands  ·  poolsuite.partners

  <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=cli">◂</a>  <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=home">home</a>  <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=cli">cli</a>  [atlas]  <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=framelink">framelink</a>  <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=simsync">simsync</a>  <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=systems">systems</a>  <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=projects">projects</a>  <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=raycast">raycast</a>  <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=forks">forks</a>  <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=framelink">▸</a>           page 3 / 9


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

  RECENT  ────────────────────────────────────────────────────────────────────────────────────────────

  The last 20 turns, as of the build that produced this page.

   atlas           just now            framelink       12 minutes ago
   projects        1 minute ago        projects        14 minutes ago
   framelink       1 minute ago        systems         14 minutes ago
   cli             5 minutes ago       framelink       16 minutes ago
   framelink       5 minutes ago       simsync         16 minutes ago
   atlas           6 minutes ago       systems         19 minutes ago
   projects        8 minutes ago       simsync         20 minutes ago
   home            10 minutes ago      systems         22 minutes ago
   cli             11 minutes ago      atlas           23 minutes ago
   simsync         12 minutes ago      cli             24 minutes ago


  ────────────────────────────────────────────────────────────────────────────────────────────────────
  A README cannot open a new tab, and github.com refuses to be framed. So for the half minute
  a rebuild takes, a worker hands the profile back to you and lets this document load inside it
  — not a fake progress bar, but the actual frames the Action commits, polled as they land.
  Then it returns you to the real page. Five commits a turn. Refresh here and you catch one.
</pre>

![](https://umami-inky-two.vercel.app/p/QL68zROQG)
