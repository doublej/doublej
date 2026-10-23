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

   atlas           2026-10-23 06:32    forks           2026-10-20 17:27
   cli             2026-10-23 02:24    framelink       2026-10-20 05:45
   forks           2026-10-23 01:50    cli             2026-10-19 11:06
   cli             2026-10-22 21:23    raycast         2026-10-19 07:33
   projects        2026-10-22 20:06    cli             2026-10-17 07:21
   raycast         2026-10-22 20:04    atlas           2026-10-17 07:20
   simsync         2026-10-22 19:38    systems         2026-10-17 07:17
   forks           2026-10-22 18:22    projects        2026-10-17 06:55
   framelink       2026-10-22 16:21    framelink       2026-10-17 06:51
   projects        2026-10-20 23:14    raycast         2026-10-17 06:27


</pre>

![](https://umami-inky-two.vercel.app/p/QL68zROQG)

<!-- nav:page=atlas -->
