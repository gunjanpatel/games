// ─── Color palette ────────────────────────────────────────────────────────────
const COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'White', hex: '#e5e7eb' },
];

// ─── State ────────────────────────────────────────────────────────────────────
let mode = '2p'; // '2p' | 'cpu'
let cpuPersona = 'chaos'; // 'trapper' | 'wall' | 'chaos'
let players = [
  { name: 'Player 1', colorIdx: 0 }, // Red default
  { name: 'Player 2', colorIdx: 1 }, // Blue default
];
let board = Array(9).fill(null); // null | 0 | 1  (player index)
let current = 0; // whose turn: 0 or 1
let gameOver = false;
let scores = [0, 0, 0]; // [p1 wins, p2 wins, draws]
let cpuThinking = false;

// ─── Persona Strategy Registry ────────────────────────────────────────────────
const PERSONAS = {
  trapper: {
    name: "The Trapper",
    move: (empty) => {
      // 1. Win if possible
      for (const i of empty) {
        board[i] = 1;
        if (checkResult()?.winner === 1) { board[i] = null; return i; }
        board[i] = null;
      }
      // 2. Block if player is winning
      for (const i of empty) {
        board[i] = 0;
        if (checkResult()?.winner === 0) { board[i] = null; return i; }
        board[i] = null;
      }
      // 3. Corners priority (The Trapper aggressively targets corners to form setups)
      const corners = [0, 2, 6, 8].filter(c => empty.includes(c));
      if (corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
      }
      // 4. Center
      if (empty.includes(4)) return 4;
      // 5. Fallback
      return empty[Math.floor(Math.random() * empty.length)];
    }
  },
  wall: {
    name: "The Wall",
    move: (empty) => {
      // 1. Win if possible
      for (const i of empty) {
        board[i] = 1;
        if (checkResult()?.winner === 1) { board[i] = null; return i; }
        board[i] = null;
      }
      // 2. Block if player is winning
      for (const i of empty) {
        board[i] = 0;
        if (checkResult()?.winner === 0) { board[i] = null; return i; }
        board[i] = null;
      }
      // 3. Center priority (The Wall locks down center grid early)
      if (empty.includes(4)) return 4;
      // 4. Sides priority to force defensive stalemates
      const sides = [1, 3, 5, 7].filter(s => empty.includes(s));
      if (sides.length > 0) {
        return sides[Math.floor(Math.random() * sides.length)];
      }
      // 5. Fallback
      return empty[Math.floor(Math.random() * empty.length)];
    }
  },
  chaos: {
    name: "Chaos Monkey",
    move: (empty) => {
      // Chaos Monkey plays randomly, checking for win only 25% of the time
      if (Math.random() < 0.25) {
        for (const i of empty) {
          board[i] = 1;
          if (checkResult()?.winner === 1) { board[i] = null; return i; }
          board[i] = null;
        }
      }
      return empty[Math.floor(Math.random() * empty.length)];
    }
  }
};

// ─── Win lines ────────────────────────────────────────────────────────────────
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],         // diags
];

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const setupScreen = document.getElementById('setupScreen');
const gameScreen = document.getElementById('gameScreen');
const winOverlay = document.getElementById('winOverlay');
const board$ = document.getElementById('board');
const cells = [...document.querySelectorAll('.cell')];
const turnDot = document.getElementById('turnDot');
const turnText = document.getElementById('turnText');
const winEmoji = document.getElementById('winEmoji');
const winTitle = document.getElementById('winTitle');
const winSub = document.getElementById('winSub');
const p1nameInput = document.getElementById('p1name');
const p2nameInput = document.getElementById('p2nameInput');
const p2setup = document.getElementById('p2setup');
const p2label = document.getElementById('p2label');
const cpuPersonaSelect = document.getElementById('cpuPersonaSelect');
const cpuPersonaSetup = document.getElementById('cpuPersonaSetup');

if (cpuPersonaSelect) {
  cpuPersonaSelect.addEventListener('change', () => {
    cpuPersona = cpuPersonaSelect.value;
  });
}

// ─── Build color swatches ─────────────────────────────────────────────────────
function buildSwatches() {
  [1, 2].forEach(p => {
    const container = document.querySelector(`.color-swatches[data-player="${p}"]`);
    container.innerHTML = '';
    COLORS.forEach((c, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swatch';
      btn.style.background = c.hex;
      btn.title = c.name;
      btn.dataset.idx = idx;
      btn.addEventListener('click', () => selectColor(p - 1, idx));
      container.appendChild(btn);
    });
  });
  refreshSwatches();
}

function refreshSwatches() {
  [0, 1].forEach(p => {
    const container = document.querySelector(`.color-swatches[data-player="${p + 1}"]`);
    container.querySelectorAll('.swatch').forEach(btn => {
      const idx = Number(btn.dataset.idx);
      btn.classList.toggle('selected', players[p].colorIdx === idx);
      // mark as taken if the OTHER player has it
      const other = p === 0 ? 1 : 0;
      btn.classList.toggle('taken', players[other].colorIdx === idx && players[p].colorIdx !== idx);
    });
  });
}

function selectColor(playerIdx, colorIdx) {
  // Can't pick what the other player has
  const other = playerIdx === 0 ? 1 : 0;
  if (players[other].colorIdx === colorIdx) return;
  players[playerIdx].colorIdx = colorIdx;
  refreshSwatches();
}

// ─── Mode toggle ──────────────────────────────────────────────────────────────
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    mode = btn.dataset.mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (mode === 'cpu') {
      p2label.textContent = 'Computer';
      p2nameInput.value = 'Computer';
      p2nameInput.disabled = true;
      p2nameInput.style.opacity = '0.4';
      if (cpuPersonaSetup) cpuPersonaSetup.classList.remove('hidden');
    } else {
      p2label.textContent = 'Player 2';
      p2nameInput.disabled = false;
      p2nameInput.style.opacity = '';
      if (p2nameInput.value === 'Computer') p2nameInput.value = '';
      if (cpuPersonaSetup) cpuPersonaSetup.classList.add('hidden');
    }
  });
});

// ─── Start game ───────────────────────────────────────────────────────────────
document.getElementById('startBtn').addEventListener('click', startGame);

function startGame() {
  players[0].name = p1nameInput.value.trim() || 'Yuval';
  players[1].name = mode === 'cpu' ? 'Computer' : (p2nameInput.value.trim() || 'Goga');

  scores = [0, 0, 0];
  setupScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  updateScoreUI();
  newRound();
}

// ─── Round management ─────────────────────────────────────────────────────────
function newRound() {
  board = Array(9).fill(null);
  current = 0;
  gameOver = false;
  cpuThinking = false;
  winOverlay.classList.add('hidden');

  cells.forEach(cell => {
    cell.textContent = '\u00A0'; // non-breaking space to keep cell size
    cell.style.color = '';
    cell.style.background = `none`;
    cell.disabled = false;
    cell.classList.remove('marked', 'winning');
  });

  updateTurnUI();

  // If CPU goes first (shouldn't with default, but just in case)
  if (mode === 'cpu' && current === 1) scheduleCpuMove();
}

// ─── Cell click ───────────────────────────────────────────────────────────────
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const idx = Number(cell.dataset.idx);
    if (gameOver || board[idx] !== null) return;
    if (mode === 'cpu' && current === 1) return; // cpu's turn
    playMove(idx);
  });
});

function playMove(idx) {
  board[idx] = current;
  const color = COLORS[players[current].colorIdx];
  const cell = cells[idx];
  cell.textContent = current === 0 ? '✕' : '◯';
  cell.style.color = color.hex;
  cell.classList.add('marked');
  cell.style.background = `${color.hex}22`;
  cell.disabled = true;

  const result = checkResult();
  if (result) {
    endGame(result);
    return;
  }

  current = current === 0 ? 1 : 0;
  updateTurnUI();

  if (mode === 'cpu' && current === 1 && !gameOver) {
    scheduleCpuMove();
  }
}

// ─── CPU move (random) ────────────────────────────────────────────────────────
function scheduleCpuMove() {
  if (cpuThinking) return;
  cpuThinking = true;
  const delay = 400 + Math.random() * 500;
  setTimeout(() => {
    if (gameOver) { cpuThinking = false; return; }
    const pick = getBestCpuMove();
    cpuThinking = false;
    playMove(pick);
  }, delay);
}

function getBestCpuMove() {
  const empty = board.map((v, i) => v === null ? i : -1).filter(i => i >= 0);
  const strategy = PERSONAS[cpuPersona] || PERSONAS.trapper;
  return strategy.move(empty);
}

// ─── Win detection ────────────────────────────────────────────────────────────
function checkResult() {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
      return { winner: board[a], line };
    }
  }
  if (board.every(v => v !== null)) return { winner: null, line: null }; // draw
  return null;
}

// ─── End game ─────────────────────────────────────────────────────────────────
function endGame(result) {
  gameOver = true;
  cells.forEach(c => c.disabled = true);
  const movesElapsed = board.filter(v => v !== null).length;

  if (result.winner !== null) {
    // Highlight winning cells
    result.line.forEach(i => cells[i].classList.add('winning'));

    scores[result.winner]++;
    updateScoreUI();

    const winnerName = players[result.winner].name;
    const winnerColor = COLORS[players[result.winner].colorIdx].name;

    winEmoji.textContent = '🎉';
    winTitle.textContent = `${winnerName} Wins!`;
    winSub.textContent = `Playing as ${winnerColor}`;

    let speechText = "";
    let rate = 1.0;
    let pitch = 1.0;

    if (movesElapsed <= 6) {
      speechText = `Absolute domination! ${winnerName} crushed the competition in a lightning fast ${movesElapsed} moves! Outstanding performance!`;
      rate = 1.25;
      pitch = 1.35;
    } else if (movesElapsed >= 8) {
      speechText = `A monumental triumph! After a grueling battle of ${movesElapsed} moves, ${winnerName} emerges victorious from the ashes! What a spectacular showdown!`;
      rate = 0.85;
      pitch = 0.9;
    } else {
      speechText = `${winnerName} takes the victory in ${movesElapsed} moves! Well played.`;
      rate = 1.0;
      pitch = 1.1;
    }

    speak(speechText, rate, pitch);
  } else {
    scores[2]++;
    updateScoreUI();
    winEmoji.textContent = '🤝';
    winTitle.textContent = "It's a Draw!";
    winSub.textContent = 'Great game, both of you!';
    speak("A hard-fought stalemate. Neither side could break the wall! It is a draw.", 0.95, 1.0);
  }

  setTimeout(() => winOverlay.classList.remove('hidden'), 600);
}

// ─── Speech synthesis ─────────────────────────────────────────────────────────
function speak(text, rate = 0.95, pitch = 1.1) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = rate;
  utt.pitch = pitch;
  utt.volume = 1;
  window.speechSynthesis.speak(utt);
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
function updateTurnUI() {
  const color = COLORS[players[current].colorIdx];
  turnDot.style.background = color.hex;
  turnDot.style.boxShadow = `0 0 8px ${color.hex}`;
  const name = players[current].name;
  turnText.textContent = mode === 'cpu' && current === 1
    ? 'Computer is thinking…'
    : `${name}'s turn`;
}

function updateScoreUI() {
  ['p1', 'p2'].forEach((id, i) => {
    document.getElementById(`sname-${id}`).textContent = players[i].name;
    document.getElementById(`snum-${id}`).textContent = scores[i];
    const dot = document.getElementById(`dot-${id}`);
    const color = COLORS[players[i].colorIdx].hex;
    dot.style.color = color;
    // dot.style.boxShadow = `0 0 6px ${color}`;
  });
  document.getElementById('snum-draw').textContent = scores[2];
}

// ─── Rematch / new game buttons ───────────────────────────────────────────────
document.getElementById('rematchBtn').addEventListener('click', newRound);
document.getElementById('overlayRematch').addEventListener('click', newRound);

function goToSetup() {
  winOverlay.classList.add('hidden');
  gameScreen.classList.add('hidden');
  setupScreen.classList.remove('hidden');
}
document.getElementById('newGameBtn').addEventListener('click', goToSetup);
document.getElementById('overlayNewGame').addEventListener('click', goToSetup);

// ─── Init ─────────────────────────────────────────────────────────────────────
buildSwatches();

// Restore saved preferences
(function restorePrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem('ttt_prefs') || 'null');
    if (!saved) return;
    if (saved.p1name) p1nameInput.value = saved.p1name;
    if (saved.p2name && saved.mode !== 'cpu') p2nameInput.value = saved.p2name;
    if (saved.p1color !== undefined) selectColor(0, saved.p1color);
    if (saved.p2color !== undefined) selectColor(1, saved.p2color);
    if (saved.cpuPersona) {
      cpuPersona = saved.cpuPersona;
      if (cpuPersonaSelect) cpuPersonaSelect.value = cpuPersona;
    }
    if (saved.mode) {
      mode = saved.mode;
      const btn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
      if (btn) {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (mode === 'cpu') {
          p2label.textContent = 'Computer';
          p2nameInput.value = 'Computer';
          p2nameInput.disabled = true;
          p2nameInput.style.opacity = '0.4';
          if (cpuPersonaSetup) cpuPersonaSetup.classList.remove('hidden');
        }
      }
    }
  } catch { }
})();

// Save preferences when starting
document.getElementById('startBtn').addEventListener('click', () => {
  try {
    localStorage.setItem('ttt_prefs', JSON.stringify({
      p1name: p1nameInput.value.trim(),
      p2name: p2nameInput.value.trim(),
      p1color: players[0].colorIdx,
      p2color: players[1].colorIdx,
      cpuPersona,
      mode,
    }));
  } catch { }
}, true); // capture phase so it runs before startGame

// Prevent single-finger scroll on touch, allow two-finger
document.addEventListener('touchmove', (e) => {
  if (e.touches.length === 1) e.preventDefault();
}, { passive: false });

// Disable double-tap zoom
let lastTap = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTap < 300) e.preventDefault();
  lastTap = now;
}, { passive: false });
