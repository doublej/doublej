<pre>



  Jurre-Jan Smit  ·  Netherlands  ·  poolsuite.partners


   ┌──────┬─────┬───────┬───────────┬─────────┬─────────┬──────────┬─────────┬───────┐      page 3 / 9
 <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=cli">◂</a> │ <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=home">home</a> │ <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=cli">cli</a> │ atlas │ <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=framelink">framelink</a> │ <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=simsync">simsync</a> │ <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=systems">systems</a> │ <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=projects">projects</a> │ <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=raycast">raycast</a> │ <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=forks">forks</a> │ <a href="https://doublej-nav.jurrejan-e26.workers.dev/?p=framelink">▸</a>
───┴──────┴─────┘       └───────────┴─────────┴─────────┴──────────┴─────────┴───────┴────────────────



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


   <a href="https://github.com/doublej/atlas-api">atlas-api</a>                        Scanner, cache and project graph — SvelteKit on :47891
   <a href="https://github.com/doublej/atlas-cli">atlas-cli</a>                        The global `atlas`: tree, scan, pick, open, ports, new
   <a href="https://github.com/doublej/atlas-picker">atlas-picker</a>                     Rust TUI — iocraft and Nucleo, reads the cache directly
   <a href="https://github.com/doublej/atlas-browser">atlas-browser</a>                    Raycast: browse, filter and act on any project
   <a href="https://github.com/doublej/atlas-watchdog">atlas-watchdog</a>                   Polls the API and restarts it through launchctl

  RECENT  ────────────────────────────────────────────────────────────────────────────────────────────

  The last 20 turns, as of the build that produced this page.

   atlas           2026-11-22 08:13    simsync         2026-11-17 13:05
   simsync         2026-11-22 07:48    projects        2026-11-17 11:28
   framelink       2026-11-22 06:47    framelink       2026-11-17 10:47
   projects        2026-11-22 06:38    atlas           2026-11-17 10:01
   cli             2026-11-22 05:54    framelink       2026-11-17 08:50
   raycast         2026-11-22 05:44    raycast         2026-11-17 08:43
   cli             2026-11-19 02:12    cli             2026-11-17 08:05
   raycast         2026-11-18 09:50    simsync         2026-11-16 01:04
   forks           2026-11-17 16:08    systems         2026-11-06 02:19
   systems         2026-11-17 14:46    framelink       2026-11-05 01:59


</pre>

![](https://umami-inky-two.vercel.app/p/QL68zROQG)

<!-- nav:page=atlas -->
