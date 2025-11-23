import "./style.css";

const state = {
  role: null,
  roomCode: new URLSearchParams(window.location.search).get("room") || "",
  hostName: "",
  playerName: "",
  playerId: crypto.randomUUID(),
  prompt: "",
  roundType: null,
  votes: {},
  swipes: { yes: 0, no: 0 },
  compatibility: [],
  darePairs: [],
  reveal: null,
  players: [],
  channel: null,
  supabase: null,
  supabaseReady: false,
  logs: [],
};

const roundTemplates = {
  pointing: "Point to the player most likely to own the aux cord all night.",
  silent: "Vote silently: Who would you trust to hold your phone for a night?",
  swipe: "Swipe yes/no on the vibe of the player shown to you.",
  compatibility: "Answer 3 quick preference picks to find your match.",
  dare: "Host will trigger a duo dare once everyone is in.",
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "public-anon-key";

function log(message) {
  const entry = { id: crypto.randomUUID(), message, ts: new Date().toLocaleTimeString() };
  state.logs.unshift(entry);
  renderLogs();
}

function renderLogs() {
  const logEl = document.getElementById("log");
  logEl.innerHTML = state.logs
    .slice(0, 20)
    .map((e) => `<div class="log-entry"><strong>${e.ts}</strong> · ${e.message}</div>`) 
    .join("");
}

function renderPlayers() {
  const list = document.getElementById("player-list");
  if (!list) return;
  list.innerHTML = state.players
    .map((p) => `<div class="list-item"><span>${p.name}</span><span class="badge">${p.role}</span></div>`) 
    .join("") || "<div class=\"small\">Waiting for players...</div>";
  document.getElementById("player-count").textContent = `${state.players.length} joined`;
}

function renderJoinInfo() {
  const codeEl = document.getElementById("join-code");
  const qrEl = document.getElementById("qr");
  const link = `${window.location.origin}?room=${state.roomCode}`;
  codeEl.textContent = state.roomCode ? state.roomCode : "--";
  qrEl.innerHTML = state.roomCode
    ? `<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(link)}" alt="QR code" loading="lazy" />`
    : "<div class='small'>Create a lobby to generate a QR</div>";
  document.getElementById("join-url").textContent = link;
}

function renderPrompt() {
  const prompt = document.getElementById("prompt-text");
  const phase = document.getElementById("round-phase");
  const revealBox = document.getElementById("reveal");
  prompt.textContent = state.prompt || "Waiting for host to start a round.";
  phase.textContent = state.roundType ? state.roundType : "Idle";
  if (state.reveal) {
    revealBox.innerHTML = `
      <div class="stat">
        <strong>Revealed:</strong><br />
        ${state.reveal}
      </div>`;
  } else {
    revealBox.innerHTML = "<div class='small'>Revealed results will appear here.</div>";
  }
}

function renderStats() {
  const votesBox = document.getElementById("vote-stats");
  const swipeBox = document.getElementById("swipe-stats");
  const compatBox = document.getElementById("compat-stats");

  const votes = Object.entries(state.votes);
  votesBox.innerHTML = votes.length
    ? votes.map(([opt, count]) => `<div class="stat">${opt}: <strong>${count}</strong></div>`).join("")
    : "<div class='small'>No votes yet.</div>";

  swipeBox.innerHTML = `<div class="stat">Yes: <strong>${state.swipes.yes}</strong></div><div class="stat">No: <strong>${state.swipes.no}</strong></div>`;

  compatBox.innerHTML = state.compatibility.length
    ? state.compatibility
        .slice(-4)
        .map((entry) => `<div class="stat"><strong>${entry.name}</strong><br/>${entry.answers.join(", ")}</div>`)
        .join("")
    : "<div class='small'>No compatibility answers yet.</div>";
}

async function initSupabase() {
  if (state.supabase) return state.supabase;
  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.48.0");
    state.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: { params: { eventsPerSecond: 10 } },
      auth: { autoRefreshToken: false, persistSession: false },
    });
    state.supabaseReady = true;
    log("Connected to Supabase realtime.");
    return state.supabase;
  } catch (err) {
    log("Failed to load Supabase client. Check network access.");
    console.error(err);
    throw err;
  }
}

async function joinRoom(role) {
  state.role = role;
  state.reveal = null;
  state.votes = {};
  state.swipes = { yes: 0, no: 0 };
  state.compatibility = [];
  renderStats();

  if (!state.roomCode) {
    state.roomCode = String(Math.floor(1000 + Math.random() * 9000));
  }
  const supabase = await initSupabase();
  if (state.channel) await state.channel.unsubscribe();

  const channel = supabase.channel(`room-${state.roomCode}`, {
    config: { presence: { key: state.playerId } },
  });

  channel.on("presence", { event: "sync" }, () => {
    const presence = channel.presenceState();
    const members = Object.values(presence).flat();
    state.players = members.map((m) => ({ name: m.name, role: m.role }));
    renderPlayers();
  });

  channel.on("broadcast", { event: "game-event" }, ({ payload }) => {
    handleBroadcast(payload);
  });

  await channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      channel.track({ name: state.role === "host" ? state.hostName : state.playerName, role: state.role });
      log(`${state.role} joined room ${state.roomCode}`);
      renderJoinInfo();
    }
  });

  state.channel = channel;
}

function handleBroadcast(payload) {
  const { type, data } = payload;
  switch (type) {
    case "player_join":
      log(`${data.name} joined the lobby.`);
      break;
    case "send_prompt":
      state.roundType = data.roundType;
      state.prompt = data.prompt;
      state.reveal = null;
      renderPrompt();
      break;
    case "player_vote":
      state.votes[data.option] = (state.votes[data.option] || 0) + 1;
      renderStats();
      break;
    case "player_swipe":
      state.swipes[data.decision] += 1;
      renderStats();
      break;
    case "compatibility":
      state.compatibility.push(data);
      renderStats();
      break;
    case "reveal_results":
      state.reveal = data.message;
      renderPrompt();
      break;
    default:
      break;
  }
}

function sendEvent(type, data = {}) {
  if (!state.channel) return;
  state.channel.send({
    type: "broadcast",
    event: "game-event",
    payload: { type, data },
  });
}

function setupHostControls() {
  const createBtn = document.getElementById("create-room");
  const startButtons = document.querySelectorAll("[data-round]");
  const revealBtn = document.getElementById("reveal-btn");

  createBtn.addEventListener("click", async () => {
    state.hostName = document.getElementById("host-name").value || "Host";
    state.roomCode = document.getElementById("room-code").value || String(Math.floor(1000 + Math.random() * 9000));
    await joinRoom("host");
    sendEvent("player_join", { name: state.hostName });
    renderJoinInfo();
  });

  startButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const round = btn.dataset.round;
      state.roundType = round;
      state.prompt = roundTemplates[round];
      state.reveal = null;
      state.votes = {};
      state.swipes = { yes: 0, no: 0 };
      state.compatibility = [];
      renderPrompt();
      renderStats();
      sendEvent("send_prompt", { roundType: round, prompt: state.prompt });
    });
  });

  revealBtn.addEventListener("click", () => {
    const message = buildRevealMessage();
    state.reveal = message;
    renderPrompt();
    sendEvent("reveal_results", { message });
  });
}

function buildRevealMessage() {
  switch (state.roundType) {
    case "silent":
      return `Top vote: ${topVote()}`;
    case "swipe":
      return `Yes ${state.swipes.yes} · No ${state.swipes.no}`;
    case "compatibility":
      return state.compatibility.length
        ? `${state.compatibility.length} answers submitted`
        : "No compatibility data yet";
    case "dare":
      return "Random duo selected!";
    default:
      return "Reveal triggered.";
  }
}

function topVote() {
  const entries = Object.entries(state.votes);
  if (!entries.length) return "No votes";
  const [choice, count] = entries.sort((a, b) => b[1] - a[1])[0];
  return `${choice} (${count})`;
}

function setupPlayerControls() {
  const joinBtn = document.getElementById("join-room");
  joinBtn.addEventListener("click", async () => {
    state.playerName = document.getElementById("player-name").value || "Player";
    state.roomCode = document.getElementById("player-room-code").value || state.roomCode;
    await joinRoom("player");
    sendEvent("player_join", { name: state.playerName });
  });

  document.querySelectorAll("[data-vote]").forEach((btn) => {
    btn.addEventListener("click", () => {
      sendEvent("player_vote", { option: btn.dataset.vote, player: state.playerName });
    });
  });

  document.querySelectorAll("[data-swipe]").forEach((btn) => {
    btn.addEventListener("click", () => {
      sendEvent("player_swipe", { decision: btn.dataset.swipe, player: state.playerName });
    });
  });

  document.getElementById("compat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const answers = Array.from(e.target.querySelectorAll("select")).map((s) => s.value);
    sendEvent("compatibility", { name: state.playerName, answers });
  });
}

function setupUI() {
  document.getElementById("app").innerHTML = `
    <header>
      <div class="badge">Realtime Supabase + Browser Player</div>
      <h1>Party Matchmaking MVP</h1>
      <div class="subtitle">Host on mobile, players join via QR or 4-digit code. Anonymous, realtime rounds.</div>
    </header>

    <div class="layout">
      <section class="card">
        <div class="section-title">
          <h2>Host Console</h2>
          <span class="small" id="player-count">0 joined</span>
        </div>
        <div class="stack">
          <label class="label">Host name</label>
          <input id="host-name" placeholder="Host" />
          <label class="label">Room code</label>
          <input id="room-code" placeholder="1234" value="${state.roomCode}" />
          <button id="create-room">Create / Join Lobby</button>
        </div>
        <hr style="margin: 16px 0; border: 1px solid rgba(255,255,255,0.05)" />
        <div class="stack">
          <div class="label">Round controls</div>
          <div class="inline-actions">
            <button data-round="pointing">Pointing</button>
            <button data-round="silent">Silent vote</button>
            <button data-round="swipe">Swipe</button>
          </div>
          <div class="inline-actions">
            <button data-round="compatibility">Compatibility</button>
            <button data-round="dare">Dare duo</button>
            <button id="reveal-btn" class="secondary">Reveal now</button>
          </div>
        </div>
        <div class="stack" style="margin-top:12px;">
          <div class="label">Players</div>
          <div id="player-list" class="list"></div>
        </div>
      </section>

      <section class="card">
        <div class="section-title">
          <h2>Lobby Share</h2>
          <span class="badge">QR + link</span>
        </div>
        <div class="stack">
          <div class="label">Join code</div>
          <div class="code-box" id="join-code">--</div>
          <div class="label">Join URL</div>
          <div class="code-box" id="join-url">--</div>
          <div class="label">QR code</div>
          <div class="qr" id="qr"></div>
          <div class="small">Players scan the QR or enter the code at the top of the browser page.</div>
        </div>
      </section>

      <section class="card">
        <div class="section-title">
          <h2>Player Client</h2>
          <span class="badge">Mobile-friendly</span>
        </div>
        <div class="stack">
          <label class="label">Player name</label>
          <input id="player-name" placeholder="You" />
          <label class="label">Room code</label>
          <input id="player-room-code" placeholder="1234" value="${state.roomCode}" />
          <button id="join-room">Join as player</button>
        </div>
        <hr style="margin: 16px 0; border: 1px solid rgba(255,255,255,0.05)" />
        <div class="prompt-box">
          <div class="badge" id="round-phase">Idle</div>
          <div id="prompt-text" style="margin-top:8px; font-size:1rem;"></div>
        </div>
        <div class="stack" style="margin-top:12px;">
          <div class="label">Silent voting</div>
          <div class="inline-actions">
            <button data-vote="A">A</button>
            <button data-vote="B">B</button>
            <button data-vote="C">C</button>
          </div>
          <div class="label">Swipe</div>
          <div class="inline-actions">
            <button data-swipe="yes">Yes</button>
            <button data-swipe="no">No</button>
          </div>
          <form id="compat-form" class="stack">
            <div class="label">Compatibility picks</div>
            <select>
              <option>Beach night</option>
              <option>Club</option>
              <option>House party</option>
            </select>
            <select>
              <option>Spicy food</option>
              <option>Comfort food</option>
              <option>Finger food</option>
            </select>
            <select>
              <option>Early bird</option>
              <option>Night owl</option>
            </select>
            <button type="submit" class="secondary">Send compatibility</button>
          </form>
        </div>
      </section>

      <section class="card">
        <div class="section-title">
          <h2>Round Stats & Reveal</h2>
          <span class="badge">Live aggregation</span>
        </div>
        <div class="stack">
          <div class="label">Votes</div>
          <div id="vote-stats" class="result-grid"></div>
          <div class="label">Swipes</div>
          <div id="swipe-stats" class="inline-actions"></div>
          <div class="label">Compatibility</div>
          <div id="compat-stats" class="result-grid"></div>
          <div class="label">Reveal</div>
          <div id="reveal"></div>
        </div>
      </section>

      <section class="card" style="grid-column: 1 / -1;">
        <div class="section-title">
          <h2>Event Log</h2>
          <span class="badge">Realtime</span>
        </div>
        <div id="log" class="log"></div>
      </section>
    </div>
  `;

  renderJoinInfo();
  renderPrompt();
  renderStats();
  renderLogs();
  setupHostControls();
  setupPlayerControls();
}

setupUI();
