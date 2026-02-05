# Party Matchmaking MVP

This repo now contains a runnable minimal MVP for the party matchmaking drinking game. The host runs the lobby from a mobile-friendly page, and players join from their browsers using a 4-digit room code or QR link. Realtime coordination is provided by Supabase Realtime channels with anonymous presence tracking.

## What ships in this MVP
- **Host console:** create/join lobby, view players joining in real time, start any round (pointing, silent vote, swipe, compatibility, dare), trigger reveal, and share QR/link.
- **Player web client:** join via code/QR, enter a name, receive prompts, submit silent votes, swipe yes/no, send compatibility picks, and wait for reveal updates.
- **Realtime events:** Supabase presence keeps the player list synced; broadcast messages handle prompts, votes/swipes, compatibility answers, and synchronized reveals.
- **Aggregations:** Live vote counts, swipe tallies, and recent compatibility answers update on the host dashboard; reveal pushes a summary to all connected clients.

## Local setup
1. Install dependencies (Vite only; the Supabase client is pulled from CDN at runtime):
   ```bash
   npm install
   ```
2. Set Supabase environment values (create a `.env` file if you prefer):
   ```bash
   export VITE_SUPABASE_URL="https://your-project.supabase.co"
   export VITE_SUPABASE_ANON_KEY="public-anon-key"
   ```
   The app will fall back to placeholders if these are missing, but realtime requires valid keys.
3. Start the dev server:
   ```bash
   npm run dev -- --host
   ```
   Open the printed URL on your phone/laptop. Append `?room=1234` to preload a join code when sharing.

## How it works
- On **Create / Join Lobby**, the host generates a 4-digit code (or uses the provided code) and joins a Supabase channel `room-{code}` with presence enabled.
- Players join the same channel; presence entries populate the player list and counts.
- Host round buttons broadcast `send_prompt` events so player screens update their prompt and controls.
- Players respond via `player_vote`, `player_swipe`, and `compatibility` events; the host dashboard aggregates results live.
- **Reveal now** broadcasts a `reveal_results` message with a concise summary (top vote, swipe totals, compatibility count, or a generic note for pointing/dare).

## Deployment notes
- Host and player run from the same Vite build. Deploy `dist/` to any static host (Supabase/Firebase Hosting, Netlify, Vercel).
- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured in your hosting environment.
- Supabase policies: enable anonymous sign-in for Realtime only projects or restrict to the channel events you need.

## Files to explore
- `src/main.js` — UI layout, Supabase realtime wiring, round controls, and event handlers.
- `src/style.css` — glassy two-column layout tuned for mobile friendliness.
- `index.html` — root entry with `#app` mount and Vite module import.

## Next steps (if you extend this)
- Move Supabase client to a local dependency once registry access is available.
- Persist results in database tables instead of in-memory aggregates.
- Add host authentication, lobby expiry, and stricter RLS policies.
- Implement player-to-player swipe targets instead of generic tallies.
