<pre>

  doublej
  ────────────────────────────────────────────────────────────────────────────────────────────────────
  Jurre-Jan Smit  ·  Netherlands  ·  poolsuite.partners

  <a href="https://github.com/doublej/doublej/issues/new?title=go%3Acli&body=Press+Create.+Nothing+is+filed+against+anyone%3A+a+workflow+reads+the+title%2C+rebuilds+the+README+and+closes+this+issue+by+itself.+Give+it+half+a+minute.">◂ prev</a>   ·   <a href="https://github.com/doublej/doublej/issues/new?title=go%3Ahome&body=Press+Create.+Nothing+is+filed+against+anyone%3A+a+workflow+reads+the+title%2C+rebuilds+the+README+and+closes+this+issue+by+itself.+Give+it+half+a+minute.">home</a>  <a href="https://github.com/doublej/doublej/issues/new?title=go%3Acli&body=Press+Create.+Nothing+is+filed+against+anyone%3A+a+workflow+reads+the+title%2C+rebuilds+the+README+and+closes+this+issue+by+itself.+Give+it+half+a+minute.">cli</a>  [atlas]  <a href="https://github.com/doublej/doublej/issues/new?title=go%3Asystems&body=Press+Create.+Nothing+is+filed+against+anyone%3A+a+workflow+reads+the+title%2C+rebuilds+the+README+and+closes+this+issue+by+itself.+Give+it+half+a+minute.">systems</a>  <a href="https://github.com/doublej/doublej/issues/new?title=go%3Aprojects&body=Press+Create.+Nothing+is+filed+against+anyone%3A+a+workflow+reads+the+title%2C+rebuilds+the+README+and+closes+this+issue+by+itself.+Give+it+half+a+minute.">projects</a>  <a href="https://github.com/doublej/doublej/issues/new?title=go%3Araycast&body=Press+Create.+Nothing+is+filed+against+anyone%3A+a+workflow+reads+the+title%2C+rebuilds+the+README+and+closes+this+issue+by+itself.+Give+it+half+a+minute.">raycast</a>  <a href="https://github.com/doublej/doublej/issues/new?title=go%3Aforks&body=Press+Create.+Nothing+is+filed+against+anyone%3A+a+workflow+reads+the+title%2C+rebuilds+the+README+and+closes+this+issue+by+itself.+Give+it+half+a+minute.">forks</a>   ·   <a href="https://github.com/doublej/doublej/issues/new?title=go%3Asystems&body=Press+Create.+Nothing+is+filed+against+anyone%3A+a+workflow+reads+the+title%2C+rebuilds+the+README+and+closes+this+issue+by+itself.+Give+it+half+a+minute.">next ▸</a>           page 3 / 7


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


  ────────────────────────────────────────────────────────────────────────────────────────────────────
  Every tab up there is an issue link. A workflow reads the title, re-renders this file and
  commits it — so the page you are looking at was literally deployed by your last click.
  It takes about thirty seconds and burns five commits. Refresh to watch it load.
</pre>

![](https://umami-inky-two.vercel.app/p/QL68zROQG)
