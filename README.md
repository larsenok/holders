# Iron Sigil
An incremental guild-management game built with React + Vite.

## Setup
```bash
npm install
npm run dev
```

## Scripts
- `npm run dev` — start the local dev server
- `npm run build` — type-check and build the production bundle
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build

## Notes
- Game state is stored in `localStorage` (guild name, stats, inventory). Clearing storage resets your guild.
- The starter flow requires selecting an initial adventurer before the main app loads.

## Development notes

## VIKTIG

- Må kunne SAMMENLIGNE med andre
- Tallene må bli store
- Visuelle tilbakemeldinger må være tydelige og tilfredsstillende
- Bevisste handlinger gir bedre gevinst
- Tid investert over evner tilegnet

## Viktig for meg

- Se tilfredsstillende ut
- Tall og stats - generelt
- Kunne bli overpowered i noen tilfeller

## Div
- Auto-format inlines: Shift + Alt + F

## TODO

### Tome effects
- [ ] Tome kan gi konstant passiv effekt til guilden - fiks faktisk effekt. Lagre hvor?
- [x] Tome kan selges, men gi varsel om man prøver å selge den
- [x] Merk items med "hasWarning" , så det dukker opp en "are you sure? ved sell all eller direkte salg.

### Inventory
- [x] Definere hvor det åpnes
- [x] Visuelt: Hvordan skal det se ut? Grid. Hvor stort? Hvor invaderende for skjermen? Viktig, men ikke overveldende.
- [ ] Sette opp lagring i sb. Table med guild id.
- [ ] Laste opp status ved første innlogging
- [ ] Oppdatere når? 1 gang i timen? Kan forårsake treighet 1 gang i timen for mange. Test div. Bruk ved time passert ved initielt.
- [x] Last inn ikoner fra pakke. 
- [x] Hva slags items, utover materialer fra foraging? Bein, mat, potions, trash. Men hvorfor? Selge for gull? Ja, grei start det.

### Game flow
- [ ] Ved ny guild rank eller power, oppdater maxAdventurers i backend og visuelt (åpen PR funker ikke. test i dev deploy 11)

### Missions
- [x] Unique = sett til å bare kunne gjennomføre 1 gang? Ja som default, og så kan åpne de igjen med fremtidig mekanikk.

### Visuell feedback (+lyd)
- [ ] Knapper må være tydelige at de kan trykkes på.
- [ ] "Tunge" knapper med tung hover effect og vekt bak klikk
- [ ] Custom musepeker
- [ ] Test minimalistiske lydeffekter ved klikk og notifikasjoner.
- [ ] Må kunne enkelt skru av og på lyd. AV som default.

### Guild hall progress
- [ ] Guild XP bar mellom tittel og gull osv på høyre siden, helt øverst
- [ ] Vis troféer i bakgrunn på en "hylle"
- [ ] Oppgrader visuelle elementer gitt guild level
- [ ] Ulike rammer til ulike nivåer. Flere hyller til troféer på høyere level.
- [ ] Interaktiv hylle/display. Fullført et set med utstyr? Kan sette opp en mannekeng med utstyret på (som MC).

### Guild & Characters
- [ ] Upsert guild ved ny bruker register (og login dersom ikke register allerede har gjort det - temp)
- [ ] Nytt stash i samme slengen som guild pushes opp
- [x] Gi 1000 tokens ved register
- [x] Bestem stats på karakter.
- [ ] Bestem navn på typen karakter. Ikke adventurer eller character.
- [x] Første åpning av nettsiden og ingen guild - velg 1 character av 3 hardkodete.
- [x] Lagre unlocket bonuser pr area. v1.0
- [ ] Area bonuser kan legges på og fjernes, siden de er "relics" eller "noe" som påvirker area
- [ ] Gi chars mulighet til å "jobbe" og passivt gjøre en aktivitet.
- [x] Legg til resting status
- [x] Definer forskjell på resting og idle. Om resting er default og overtar for idle, kan den gi stor bonus? Behagelig - hvorfor ikke?

### Achievements
- [ ] Antall missions gjort
- [ ] Første unique i hvert område og alle områder
- [ ] Levlet hero til lvl 2, 5, 10, 25, 50, 100.
- [ ] Finne flere achievements

### Setup
- [x] Lagre valgt guildnavn
- [ ] Erstatte hardkodet iron sigil i visning for guildnavn
- [ ] Laste opp guild til guild DB ved første login

### Trening
- [x] Tillat trening 1 gang om dagen - én gang i timen?
- [x] Trening er 3 typer, og kan velge +1 fra tilhørende kategori.
- [x] Sparring Pit → strength, defense
- [ ] Starting mission - reserve first idle adventurer as default, but allow choosing Meditation Circle → wisdom, magic Obstacle Course → agility, dexterity
- [ ] Research  Codex/lore unlocks      1–4 hrs Optional narrative impact
- [ ] Camp Guard        Small resource gain     Ongoing + chance to prevent random camp events
- [ ] Scouting  Unlocks fast travel     2–6 hrs Reveals shortcuts, clues
- [ ] Mentor(?) Boost trainee XP        Variable        One idle boosts another in training

### Stash
- [x] PNG ikoner til materialer (stein ferdig)
- [ ] Samle materialer dersom karakter er satt til foraging som passiv aktivitet
- [ ] Samle 1 random materiale hvert x sekund ved foraging (må balanseres)
- [ ] Teste balanse av samling av x materialer på y sekunder

### Stretch Goals
- [ ] Dynamisk vær som påvirker missions
- [ ] Sesongbaserte events med tidsbegrensede quests

## BUGS
- [x] Equip av default ETTER en annen backgrunn beholder forrige som equipped.
- [ ] Fix achievements hentes ved hver eneste refresh. Kun ved ny unlock eller innlogging av user.
- [ ] Default missions fullføres umiddelbart.

## Feedback log

### 1  Refine the core gameplay loop

* **Establish a clear “click/reward/spend” loop.** Idle games thrive on a simple action → reward → upgrade cycle. At present missions, tasks and training all provide separate small rewards, but there isn’t a unified loop that players can repeat continuously. Consider making “sending adventurers on missions” the primary loop: clicking “Send” instantly consumes resources (supplies) and starts a timed expedition, which upon completion yields gold, materials and character XP. Spending gold and materials should clearly unlock stronger adventurers, gear, or shorter mission timers. This forms the “earn → invest → earn more” cycle players expect.

* **Introduce a meaningful meta‑loop.** Machinations’ article notes that a simple core loop must interact with a deeper meta loop to sustain long‑term engagement. In Iron Sigil the meta‑loop is underdeveloped; players recruit adventurers and train them but there is little reason to pursue higher power besides a larger party. Add long‑term goals such as upgrading your guild hall (providing resource multipliers), unlocking new areas via story missions, or “prestige” resets that increase base income. These higher‑level progression systems give players a reason to continue beyond initial missions.

* **Fix and clarify timers.** Current training sets `trainingEndsAt = now + 60` (60 ms instead of 60 s); default missions last only two seconds while unique missions run up to 30–45 minutes. Choose consistent time units (seconds or minutes) and display visible progress bars. Allow players to queue actions or see how long they have left; this simple feedback is essential for idle games.

* **Implement offline progress.** Idle games reward players even when they’re away. Currently you save `lastSeen` on unload in `App.tsx` but never use it. On load, calculate time elapsed since `lastSeen` and simulate missions, tasks and training that would have finished; grant rewards accordingly and cap them (e.g., only accumulate up to X hours). A clear “return reward” message encourages players to come back.

* **Streamline UI/UX.** Best‑practice guides emphasise simple interfaces and clear indicators. Iron Sigil’s pages often hide or truncate information (e.g., character rows require clicking to expand; mission reward details are hidden). Use concise panels showing each adventurer’s status, remaining time and assignment buttons; collapse advanced options behind tabs that unlock later. Keep early game interfaces uncluttered and reveal deeper systems gradually.

### 2  Strengthen the reward system

* **Differentiate currencies and rewards.** The Machinations article suggests using a primary currency for routine upgrades and a rarer secondary currency for powerful upgrades. In Iron Sigil gold and FEEL credits exist but purchases are limited to cosmetics or a one‑off gold pouch. Introduce a rare currency (e.g., “Sigils”) awarded from unique missions or achievements, used for permanent guild upgrades (e.g., faster mission timers, automatic training). This gives players a long‑term goal beyond accumulating gold.

* **Make rewards meaningful.** Many current rewards are cosmetic (background colors) or trivial (+3 gold for guard duty). Players need to feel their choices matter. Expand the store with upgrades that affect gameplay—e.g., gear that improves specific stats, tomes that give passive bonuses like +10 % mission XP (your `allTomes` definitions could become equipable items), or buildings that produce resources over time. Cosmetic items should accompany but not replace functional rewards.

* **Design achievements relevant to the game.** The current achievements list includes unrelated tasks like “Inbox Master” and “Social Star”, which break immersion. Replace them with achievements tied to Iron Sigil’s systems: completing the first unique mission, training an adventurer to level 10, recruiting an S‑rank hero, collecting all tomes, etc. Make achievements visible goals with small rewards (titles, resource boosts, or unlocking new content).

* **Balance progression and pacing.** Idle games hook players with frequent early rewards then gradually increase intervals. Adjust mission durations and yields so that early missions complete in 30–60 s, producing enough gold to buy upgrades quickly; mid‑game missions could take 10–30 min but drop rare gear or significant currency. Similarly, training should take minutes (not milliseconds) and give noticeable stat increases; tasks like research or scouting could grant temporary buffs or unveil new missions.

* **Introduce daily/weekly bonuses and tasks.** Give players a reason to log in regularly by adding daily rewards (e.g., free gold, recruit tickets) and simple tasks (“Complete 3 missions”, “Train 2 adventurers”). Offer streak bonuses for consecutive days (capped to avoid overwhelm). This ties into the offline/online cycle and increases retention.

* **Leverage social and competitive elements.** If feasible, implement leaderboards (already mentioned in code) that rank players by guild rank, total power or fastest mission completion times. Optional PvE events or guild‑vs‑guild competitions can further motivate players to improve.

### 3  Code‑level and design criticisms

* **Inconsistent or placeholder data.** Many durations and rewards are labelled as “Todo: balance” or use placeholders (e.g., mission durations of 2 s). Several functions have incomplete implementations (e.g., `loadInitialStatuses` doesn’t reset equipped items). Balancing should be iterated based on play‑testing and analytics.

* **Training bug.** The training modal sets `trainingEndsAt` using `now + 60` without multiplying by 1000, causing training to end almost instantly. Fix this and consider making training time scale with level.

* **Achievement integration.** Achievements rely on Supabase but the actual triggers for unlocking many achievements are missing. You should call `unlock()` in response to events (mission completions, training completions, etc.) or implement counters for tasks like “complete 50 missions”.

* **Rewards for tasks are under‑tuned.** Guarding yields only 3 gold and research 2 XP—barely noticeable when missions give dozens. Re‑evaluate task rewards to make tasks a viable alternative loop or integrate tasks as modifiers that boost missions.

* **Visual polish and feedback.** The UI currently uses minimal animation; actions like mission completion call `animate-loot-burst` on an element that may not exist. Implement proper animations for loot bursts, rank‑up celebrations, and achievement unlocks. Provide audio cues and tooltips to make rewards feel satisfying.

By refining the core loop into a clear, repeatable action→reward→upgrade cycle, adding offline progression and meaningful long‑term goals, balancing timers and rewards, and aligning achievements and store items with the game’s fantasy theme, Iron Sigil can evolve from a prototype into a compelling incremental game.
