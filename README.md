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


   atlas-api                        Scanner, cache and project graph — SvelteKit on :47891
   atlas-cli                        The global `atlas`: tree, scan, pick, open, ports, new
   <a href="https://github.com/doublej/atlas-picker">atlas-picker</a>                     Rust TUI — iocraft and Nucleo, reads the cache directly
   <a href="https://github.com/doublej/atlas-browser">atlas-browser</a>                    Raycast: browse, filter and act on any project
   atlas-watchdog                   Polls the API and restarts it through launchctl

  RECENT  ────────────────────────────────────────────────────────────────────────────────────────────

  The last 20 turns, as of the build that produced this page.

   atlas           just now            atlas           25 minutes ago
   atlas           46 seconds ago      framelink       26 minutes ago
   cli             1 minute ago        home            27 minutes ago
   atlas           2 minutes ago       framelink       28 minutes ago
   atlas           3 minutes ago       home            28 minutes ago
   atlas           11 minutes ago      atlas           29 minutes ago
   cli             12 minutes ago      home            32 minutes ago
   home            23 minutes ago      cli             34 minutes ago
   home            24 minutes ago      framelink       36 minutes ago
   home            24 minutes ago      forks           38 minutes ago


  ────────────────────────────────────────────────────────────────────────────────────────────────────
  A README cannot open a new tab, and github.com refuses to be framed. So for the half minute
  a rebuild takes, a worker hands the profile back to you and lets this document load inside it
  — not a fake progress bar, but the actual frames the Action commits, polled as they land.
  Then it returns you to the real page. Five commits a turn. Refresh here and you catch one.

  Capacity: one reader at a time. The workflow holds a lock, so a second click during a turn
  waits its turn rather than racing it, and clicks inside the same 20 seconds are folded into
  one. Fair use: turn as many pages as you like, but this is a text file behind a queue of one,
  so if it feels slow, that is not the network — that is somebody else already reading.
</pre>

![](https://umami-inky-two.vercel.app/p/QL68zROQG)

<!-- nav:page=atlas -->
