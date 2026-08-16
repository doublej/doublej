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

   atlas           2026-08-16 22:43    simsync         2026-08-10 06:50
   framelink       2026-08-16 21:47    cli             2026-08-10 06:41
   raycast         2026-08-16 17:54    cli             2026-08-09 08:53
   systems         2026-08-16 12:15    cli             2026-08-07 15:51
   cli             2026-08-14 14:07    cli             2026-08-07 12:13
   cli             2026-08-14 14:05    atlas           2026-08-06 15:23
   cli             2026-08-13 18:31    cli             2026-08-06 14:52
   cli             2026-08-10 13:17    cli             2026-08-06 08:43
   home            2026-08-10 13:15    cli             2026-08-04 23:54
   cli             2026-08-10 13:14    cli             2026-08-04 05:19


</pre>

![](https://umami-inky-two.vercel.app/p/QL68zROQG)

<!-- nav:page=atlas -->
