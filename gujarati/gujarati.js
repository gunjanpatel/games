// ─── Constants & Data Sets ───────────────────────────────────────────────────
const KAKKO = ['ક', 'ખ', 'ગ', 'ઘ', 'ચ', 'છ', 'જ', 'ઝ', 'ટ', 'ઠ', 'ડ', 'ઢ', 'ણ', 'ત', 'થ', 'દ', 'ધ', 'ન', 'પ', 'ફ', 'બ', 'ભ', 'મ', 'ય', 'ર', 'લ', 'વ', 'શ', 'ષ', 'સ', 'હ', 'ળ', 'ક્ષ', 'જ્ઞ'];
const TRAPS = {
  'ઘ': 'ધ', 'ધ': 'ઘ',
  'ડ': 'ઈ', 'ઈ': 'ડ',
  'ઠ': 'ઢ', 'ઢ': 'ઠ',
  'ત': 'ભ', 'ભ': 'ત',
  'ખ': 'બ', 'બ': 'ખ',
  'ક': 'ફ', 'ફ': 'ક'
};

const WORDS = [
  { text: 'કમળ', path: ['ક', 'મ', 'ળ'], english: 'Kamal (Lotus)' },
  { text: 'અજગર', path: ['અ', 'જ', 'ગ', 'ર'], english: 'Ajgar (Python)' },
  { text: 'વડ', path: ['વ', 'ડ'], english: 'Vad (Banyan Tree)' },
  { text: 'ફળ', path: ['ફ', 'ળ'], english: 'Fal (Fruit)' },
  { text: 'બતક', path: ['બ', 'ત', 'ક'], english: 'Batak (Duck)' }
];

const BARAKHADI_FORMULAS = [
  { c: 'ક', v: 'ા', result: 'કા', speak: 'Ka' },
  { c: 'ખ', v: 'િ', result: 'ખિ', speak: 'Khi' },
  { c: 'ગ', v: 'ી', result: 'ગી', speak: 'Gee' },
  { c: 'ઘ', v: 'ુ', result: 'ઘુ', speak: 'Ghu' },
  { c: 'ચ', v: 'ૂ', result: 'ચૂ', speak: 'Choo' },
  { c: 'છ', v: 'ે', result: 'છે', speak: 'Chhe' },
  { c: 'જ', v: 'ૈ', result: 'જૈ', speak: 'Jai' },
  { c: 'ટ', v: 'ો', result: 'ટો', speak: 'To' },
  { c: 'ઠ', v: 'ૌ', result: 'ઠૌ', speak: 'Thau' },
  { c: 'ડ', v: 'ં', result: 'ડં', speak: 'Dam' }
];

const CIPHER_LETTERS = ['ક', 'ખ', 'ગ', 'ઘ', 'ચ', 'છ', 'જ', 'ઝ'];

const PHONETIC_MAP = {
  'ક': 'Ka', 'ખ': 'Kha', 'ગ': 'Ga', 'ઘ': 'Gha',
  'ચ': 'Cha', 'છ': 'Chha', 'જ': 'Ja', 'ઝ': 'Zha',
  'ટ': 'Ta', 'ઠ': 'Tha', 'ડ': 'Da', 'ઢ': 'Dha',
  'ણ': 'Na', 'ત': 'Ta', 'થ': 'Tha', 'દ': 'Da',
  'ધ': 'Dha', 'ન': 'Na', 'પ': 'Pa', 'ફ': 'Pha',
  'બ': 'Ba', 'ભ': 'Bha', 'મ': 'Ma', 'ય': 'Ya',
  'ર': 'Ra', 'લ': 'La', 'વ': 'Va', 'શ': 'Sha',
  'ષ': 'Sha', 'સ': 'Sa', 'હ': 'Ha', 'ળ': 'La',
  'ક્ષ': 'Ksha', 'જ્ઞ': 'Gnya',
  'અ': 'Ah', 'મ': 'Ma', 'ળ': 'La', 'જ': 'Ja', 'ગ': 'Ga', 'ર': 'Ra', 'વ': 'Va', 'ડ': 'Da', 'ફ': 'Pha', 'ત': 'Ta',
  'કા': 'Kaa', 'ખિ': 'Khi', 'ગી': 'Gee', 'ઘુ': 'Ghoo',
  'ચૂ': 'Choo', 'છે': 'Chhay', 'જૈ': 'Jai', 'ટો': 'Toe',
  'ઠૌ': 'Thau', 'ડં': 'Dam', 'ા': 'Aa', 'િ': 'I', 'ી': 'Ee', 'ુ': 'U', 'ૂ': 'Oo', 'ે': 'Ay', 'ૈ': 'Ai', 'ો': 'Oh', 'ૌ': 'Au', 'ં': 'Um'
};

// ─── Touch, Scroll, & Gesture Locks ──────────────────────────────────────────
// Prevent double-tap zoom
let lastTapTime = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTapTime < 300) {
    e.preventDefault();
  }
  lastTapTime = now;
}, { passive: false });

// Prevent single-finger drag scroll, allow two-finger panning
document.addEventListener('touchmove', (e) => {
  if (e.touches.length === 1) {
    e.preventDefault();
  }
}, { passive: false });

// ─── Scoreboard Translation ──────────────────────────────────────────────────
function toGujaratiNumerals(num) {
  const guDigits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  return String(num).split('').map(char => {
    return (char >= '0' && char <= '9') ? guDigits[Number(char)] : char;
  }).join('');
}

// ─── Auditory Fallback Engine ────────────────────────────────────────────────
function speakText(guText, engPhonetic = null) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const voices = window.speechSynthesis.getVoices();
  const guVoice = voices.find(v => v.lang.startsWith('gu'));

  const utterance = new SpeechSynthesisUtterance(guText);
  if (guVoice) {
    utterance.voice = guVoice;
    utterance.lang = 'gu-IN';
  } else {
    // Intercept missing locales and route to en-IN voice using mapping definitions
    const enInVoice = voices.find(v => v.lang.startsWith('en-IN') || v.lang.startsWith('en'));
    utterance.text = engPhonetic || PHONETIC_MAP[guText] || guText;
    if (enInVoice) {
      utterance.voice = enInVoice;
      utterance.lang = 'en-IN';
    }
  }

  utterance.rate = 0.85;
  utterance.pitch = 1.25;
  window.speechSynthesis.speak(utterance);
}

// Warmed up voice trigger
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => { };
}

// ─── Navigation & Achievements ───────────────────────────────────────────────
function launchMode(mode) {
  document.getElementById('menuScreen').classList.add('hidden');
  document.getElementById('connectorView').classList.add('hidden');
  document.getElementById('blasterView').classList.add('hidden');
  document.getElementById('cipherView').classList.add('hidden');

  if (mode === 'connector') {
    document.getElementById('connectorView').classList.remove('hidden');
    initConnector();
  } else if (mode === 'blaster') {
    document.getElementById('blasterView').classList.remove('hidden');
    initBlaster();
  } else if (mode === 'cipher') {
    document.getElementById('cipherView').classList.remove('hidden');
    initCipher();
  }
}

function exitToMenu() {
  document.getElementById('connectorView').classList.add('hidden');
  document.getElementById('blasterView').classList.add('hidden');
  document.getElementById('cipherView').classList.add('hidden');
  document.getElementById('menuScreen').classList.remove('hidden');
  stopBlasterGame();
  clearInterval(cipherInterval);
  updateHighscoresUI();
  updateMilestonesUI();
}

function updateHighscoresUI() {
  const conn = localStorage.getItem('gujarati_connector_best') || '0';
  const blast = localStorage.getItem('gujarati_blaster_best') || '0';
  const ciph = localStorage.getItem('gujarati_cipher_best') || '--';

  document.getElementById('bestConnector').textContent = `${toGujaratiNumerals(conn)} / ${conn} paths`;
  document.getElementById('bestBlaster').textContent = `${toGujaratiNumerals(blast)} / ${blast} pts`;
  document.getElementById('bestCipher').textContent = ciph !== '--' ? `${toGujaratiNumerals(ciph)}s / ${ciph}s` : '--';
}

function updateMilestonesUI() {
  const connBest = parseInt(localStorage.getItem('gujarati_connector_best') || '0');
  const blastBest = parseInt(localStorage.getItem('gujarati_blaster_best') || '0');
  const cipherBest = localStorage.getItem('gujarati_cipher_best');

  // Badge 1: Kakko Master (completed 3 connector paths)
  const badge1 = document.getElementById('badgeKakkoMaster');
  if (connBest >= 3) {
    badge1.classList.add('unlocked');
    localStorage.setItem('gujarati_milestone_kakko_master', 'true');
  } else {
    badge1.classList.remove('unlocked');
  }

  // Badge 2: Barakhadi Combo Champion (score 10 pts)
  const badge2 = document.getElementById('badgeBarakhadiChamp');
  if (blastBest >= 10) {
    badge2.classList.add('unlocked');
    localStorage.setItem('gujarati_milestone_barakhadi_champ', 'true');
  } else {
    badge2.classList.remove('unlocked');
  }

  // Badge 3: Auditory Memory Wizard (complete Cipher in less than 25 seconds)
  const badge3 = document.getElementById('badgeAudioWizard');
  if (cipherBest !== null && cipherBest !== '--' && parseInt(cipherBest) < 25) {
    badge3.classList.add('unlocked');
    localStorage.setItem('gujarati_milestone_audio_wizard', 'true');
  } else {
    badge3.classList.remove('unlocked');
  }
}

// ─── Mode A: Kakko Connector Logic ──────────────────────────────────────────
let connectorPath = [];
let connectorStepIndex = 0;
let connectorCompletedPaths = 0;
let connectorIsWord = false;

function initConnector() {
  connectorStepIndex = 0;

  // 50% chance to spelling spell-out a word, 50% chance standard sequence
  connectorIsWord = Math.random() < 0.5;
  if (connectorIsWord) {
    const wordData = WORDS[Math.floor(Math.random() * WORDS.length)];
    connectorPath = wordData.path;

    // Update target
    document.getElementById('connectorTarget').innerHTML = `${connectorPath.join(' → ')}<br><span class="text-xs text-[rgba(255,255,255,0.4)] italic">${wordData.text} (${wordData.english})</span>`;
  } else {
    const startIndex = Math.floor(Math.random() * (KAKKO.length - 4));
    connectorPath = KAKKO.slice(startIndex, startIndex + 4);
    document.getElementById('connectorTarget').textContent = connectorPath.join(' → ');
  }

  updateConnectorStepUI();

  const grid = document.getElementById('connectorGrid');
  grid.innerHTML = '';

  const tilesData = [];
  connectorPath.forEach(char => {
    tilesData.push({ char, type: 'path' });
    // Inject Adjacent Traps to build children shape recognition skills
    if (TRAPS[char]) {
      tilesData.push({ char: TRAPS[char], type: 'trap' });
    }
  });

  // Populate remaining grid spaces
  while (tilesData.length < 16) {
    const filler = KAKKO[Math.floor(Math.random() * KAKKO.length)];
    if (!connectorPath.includes(filler) && !tilesData.some(t => t.char === filler)) {
      tilesData.push({ char: filler, type: 'filler' });
    }
  }

  shuffle(tilesData);

  tilesData.forEach(tile => {
    const tileEl = document.createElement('button');
    tileEl.className = 'connector-tile';
    tileEl.textContent = tile.char;
    tileEl.dataset.char = tile.char;

    tileEl.addEventListener('click', () => {
      handleConnectorClick(tileEl, tile.char);
    });

    grid.appendChild(tileEl);
  });
}

function handleConnectorClick(tileEl, char) {
  const expected = connectorPath[connectorStepIndex];
  if (char === expected) {
    tileEl.classList.add('correct');
    speakText(char, PHONETIC_MAP[char]);
    connectorStepIndex++;
    updateConnectorStepUI();

    if (connectorStepIndex === connectorPath.length) {
      // Complete path
      connectorCompletedPaths++;
      const currentBest = localStorage.getItem('gujarati_connector_best') || 0;
      if (connectorCompletedPaths > parseInt(currentBest)) {
        localStorage.setItem('gujarati_connector_best', connectorCompletedPaths);
      }

      showWinOverlay(
        `શાબાશ! Completed ${connectorCompletedPaths} connector path(s) successfully!`,
        `🎉 કક્કો માસ્ટર! Path Tracing Success!`
      );
    }
  } else {
    tileEl.classList.add('wrong');
    speakText("ভૂલ છે", "Wrong letter");
    setTimeout(() => {
      tileEl.classList.remove('wrong');
    }, 500);
  }
}

function updateConnectorStepUI() {
  const guIdx = toGujaratiNumerals(connectorStepIndex);
  const guLen = toGujaratiNumerals(connectorPath.length);
  document.getElementById('connectorStep').textContent = `${guIdx} / ${connectorStepIndex} / ${connectorPath.length}`;
}

// ─── Mode B: Barakhadi Blaster (Phonetic Equation Matcher) ───────────────────
let blasterCanvas, blasterCtx;
let blasterScore = 0;
let blasterTimeLeft = 30;
let blasterTimerInterval = null;
let blasterActive = false;
let blasterTarget = null;
let bubbles = [];
let blasterAnimationFrame = null;

// Dismantle progression variables
let blasterDismantleActive = false;
let blasterDismantleStage = 0; // 0: Consonant, 1: Vowel sign

function initBlaster() {
  blasterCanvas = document.getElementById('blasterCanvas');
  blasterCtx = blasterCanvas.getContext('2d');

  resizeBlasterCanvas();

  blasterScore = 0;
  blasterTimeLeft = 30;
  bubbles = [];
  blasterActive = true;
  blasterDismantleActive = false;

  updateBlasterScoreUI();
  updateBlasterTimerUI();
  document.getElementById('blasterStartBtn').textContent = 'Restart Blaster';

  clearInterval(blasterTimerInterval);
  cancelAnimationFrame(blasterAnimationFrame);

  nextBlasterTarget();

  blasterCanvas.onclick = handleBlasterClick;

  blasterTimerInterval = setInterval(() => {
    blasterTimeLeft--;
    updateBlasterTimerUI();
    if (blasterTimeLeft <= 0) {
      endBlasterGame();
    }
  }, 1000);

  blasterLoop();
}

function resizeBlasterCanvas() {
  const rect = blasterCanvas.parentNode.getBoundingClientRect();
  blasterCanvas.width = rect.width;
  blasterCanvas.height = rect.height;
}

function nextBlasterTarget() {
  blasterTarget = BARAKHADI_FORMULAS[Math.floor(Math.random() * BARAKHADI_FORMULAS.length)];

  // If score >= 5, launch the advanced component popping dismantler
  blasterDismantleActive = blasterScore >= 5;
  blasterDismantleStage = 0;

  const targetLabel = document.getElementById('blasterTargetFormula');

  if (blasterDismantleActive) {
    targetLabel.innerHTML = `<span class="text-red-400">Dismantle: ${blasterTarget.result}</span><br><span class="text-sm font-medium text-[rgba(235,235,245,0.4)] italic">Pop root base consonant: ${blasterTarget.c} first!</span>`;
  } else {
    targetLabel.textContent = `${blasterTarget.c} + ${blasterTarget.v} = ?`;
  }
}

function updateBlasterScoreUI() {
  const guScore = toGujaratiNumerals(blasterScore);
  document.getElementById('blasterScore').textContent = `${guScore} / ${blasterScore}`;
}

function updateBlasterTimerUI() {
  const guTime = toGujaratiNumerals(blasterTimeLeft);
  document.getElementById('blasterTimer').textContent = `${guTime}s / ${blasterTimeLeft}s`;
}

function spawnBubble() {
  if (bubbles.length >= 6) return;

  const radius = 35 + Math.random() * 10;
  const x = radius + Math.random() * (blasterCanvas.width - radius * 2);
  const y = blasterCanvas.height + radius;
  const speed = 1.0 + Math.random() * 1.5;

  const randFormula = BARAKHADI_FORMULAS[Math.floor(Math.random() * BARAKHADI_FORMULAS.length)];
  let value = randFormula.result;

  if (blasterDismantleActive) {
    // Spawn components (consonants and vowel signs)
    if (Math.random() < 0.5) {
      value = Math.random() < 0.4 ? blasterTarget.c : randFormula.c;
    } else {
      value = Math.random() < 0.4 ? blasterTarget.v : randFormula.v;
    }
  } else {
    value = Math.random() < 0.4 ? blasterTarget.result : randFormula.result;
  }

  bubbles.push({ x, y, radius, speed, value, color: `hsl(${30 + Math.random() * 30}, 90%, 60%)` });
}

function blasterLoop() {
  if (!blasterActive) return;

  blasterCtx.clearRect(0, 0, blasterCanvas.width, blasterCanvas.height);

  if (Math.random() < 0.02) spawnBubble();

  bubbles.forEach(bubble => {
    bubble.y -= bubble.speed;

    blasterCtx.beginPath();
    blasterCtx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    blasterCtx.fillStyle = bubble.color + '22';
    blasterCtx.fill();
    blasterCtx.lineWidth = 2;
    blasterCtx.strokeStyle = bubble.color;
    blasterCtx.stroke();

    blasterCtx.fillStyle = '#ffffff';
    blasterCtx.font = 'bold 24px Inter, system-ui';
    blasterCtx.textAlign = 'center';
    blasterCtx.textBaseline = 'middle';
    blasterCtx.fillText(bubble.value, bubble.x, bubble.y);
  });

  bubbles = bubbles.filter(b => b.y + b.radius > 0);
  blasterAnimationFrame = requestAnimationFrame(blasterLoop);
}

function handleBlasterClick(event) {
  if (!blasterActive) return;

  const rect = blasterCanvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  bubbles.forEach((bubble, idx) => {
    const dist = Math.hypot(clickX - bubble.x, clickY - bubble.y);
    if (dist <= bubble.radius) {
      bubbles.splice(idx, 1);

      if (blasterDismantleActive) {
        // Dismantling sequence checks
        if (blasterDismantleStage === 0) {
          if (bubble.value === blasterTarget.c) {
            blasterDismantleStage = 1;
            speakText(blasterTarget.c, PHONETIC_MAP[blasterTarget.c]);

            // Update prompt to ask for vowel component
            const targetLabel = document.getElementById('blasterTargetFormula');
            targetLabel.innerHTML = `<span class="text-green-400">Popped ${blasterTarget.c}!</span><br><span class="text-sm font-medium text-[rgba(235,235,245,0.4)] italic">Now pop Vowel Sign: ${blasterTarget.v}!</span>`;
          } else {
            blasterTimeLeft = Math.max(0, blasterTimeLeft - 3);
            speakText("ખોટું", "Whoops");
          }
        } else if (blasterDismantleStage === 1) {
          if (bubble.value === blasterTarget.v) {
            // Completed!
            blasterScore++;
            updateBlasterScoreUI();
            speakText(blasterTarget.result, PHONETIC_MAP[blasterTarget.result]);
            nextBlasterTarget();
          } else {
            blasterTimeLeft = Math.max(0, blasterTimeLeft - 3);
            speakText("ખોટું", "Whoops");
          }
        }
      } else {
        // Standard check
        if (bubble.value === blasterTarget.result) {
          blasterScore++;
          updateBlasterScoreUI();
          speakText(blasterTarget.result, PHONETIC_MAP[blasterTarget.result]);
          nextBlasterTarget();
        } else {
          blasterTimeLeft = Math.max(0, blasterTimeLeft - 3);
          speakText("ખોટું", "Whoops");
        }
      }
    }
  });
}

function endBlasterGame() {
  stopBlasterGame();
  const currentBest = localStorage.getItem('gujarati_blaster_best') || 0;
  let isNew = false;
  if (blasterScore > parseInt(currentBest)) {
    localStorage.setItem('gujarati_blaster_best', blasterScore);
    isNew = true;
  }
  showWinOverlay(`Matched all syllables, scoring ${blasterScore} points!`, `🏆 બારાખડી ચેમ્પિયન! Barakhadi Blaster Victory!`, isNew);
}

// ─── Mode C: Kakko Audio Cipher Logic ────────────────────────────────────────
let cipherFlipped = [];
let cipherMatches = 0;
let cipherTurns = 0;
let cipherTimeElapsed = 0;
let cipherInterval = null;
let cipherActive = false;

function initCipher() {
  cipherMatches = 0;
  cipherTurns = 0;
  cipherTimeElapsed = 0;
  cipherFlipped = [];
  cipherActive = true;

  updateCipherFlipsUI();
  updateCipherTimeUI();

  clearInterval(cipherInterval);
  cipherInterval = setInterval(() => {
    if (cipherActive) {
      cipherTimeElapsed++;
      updateCipherTimeUI();
    }
  }, 1000);

  const grid = document.getElementById('cipherGrid');
  grid.innerHTML = '';

  const deck = [];
  CIPHER_LETTERS.forEach(char => {
    deck.push({ char, type: 'audio' });
    deck.push({ char, type: 'written' });
  });

  shuffle(deck);

  deck.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'cipher-card aspect-square w-full';
    cardEl.dataset.idx = index;
    cardEl.dataset.char = card.char;
    cardEl.dataset.type = card.type;

    cardEl.innerHTML = `
      <div class="cipher-inner w-full h-full">
        <div class="cipher-front font-semibold">❓</div>
        <div class="cipher-back font-bold">${card.type === 'audio' ? '🔊' : card.char}</div>
      </div>
    `;

    cardEl.addEventListener('click', () => handleCipherClick(cardEl));
    grid.appendChild(cardEl);
  });
}

function updateCipherFlipsUI() {
  const guFlips = toGujaratiNumerals(cipherTurns);
  document.getElementById('cipherFlips').textContent = `${guFlips} / ${cipherTurns}`;
}

function updateCipherTimeUI() {
  const guTime = toGujaratiNumerals(cipherTimeElapsed);
  document.getElementById('cipherTime').textContent = `${guTime}s / ${cipherTimeElapsed}s`;
}

function handleCipherClick(cardEl) {
  if (!cipherActive) return;
  if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;
  if (cipherFlipped.length >= 2) return;

  cardEl.classList.add('flipped');
  cipherFlipped.push(cardEl);

  if (cardEl.dataset.type === 'audio') {
    const char = cardEl.dataset.char;
    speakText(char, PHONETIC_MAP[char]);
  }

  if (cipherFlipped.length === 2) {
    cipherTurns++;
    updateCipherFlipsUI();
    checkCipherMatch();
  }
}

function checkCipherMatch() {
  const [c1, c2] = cipherFlipped;
  const isMatch = (c1.dataset.char === c2.dataset.char) && (c1.dataset.type !== c2.dataset.type);

  if (isMatch) {
    c1.classList.add('matched');
    c2.classList.add('matched');
    cipherMatches += 2;
    cipherFlipped = [];

    if (cipherMatches === 16) {
      endCipherGame();
    }
  } else {
    setTimeout(() => {
      c1.classList.remove('flipped');
      c2.classList.remove('flipped');
      cipherFlipped = [];
    }, 1000);
  }
}

function endCipherGame() {
  cipherActive = false;
  clearInterval(cipherInterval);

  const currentBest = localStorage.getItem('gujarati_cipher_best');
  let isNew = false;
  if (!currentBest || cipherTimeElapsed < parseInt(currentBest)) {
    localStorage.setItem('gujarati_cipher_best', cipherTimeElapsed);
    isNew = true;
  }

  showWinOverlay(
    `Completed auditory matching in ${cipherTurns} turns and ${cipherTimeElapsed} seconds!`,
    `👂 શ્રવણ વિઝાર્ડ! Memory Match Complete!`,
    isNew
  );
}

// ─── Shared Utilities ────────────────────────────────────────────────────────
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showWinOverlay(statsText, titleText, isNewRecord = false) {
  document.getElementById('winStats').textContent = statsText;
  document.getElementById('newRecordText').textContent = isNewRecord ? `🎉 Amazing! A new cognitive personal record!` : '';

  const titleEl = document.querySelector('#winOverlay .win-title');
  if (titleEl && titleText) titleEl.textContent = titleText;

  const overlay = document.getElementById('winOverlay');
  overlay.classList.remove('hidden');

  document.getElementById('overlayPlayAgain').onclick = () => {
    overlay.classList.add('hidden');
    if (!document.getElementById('connectorView').classList.contains('hidden')) {
      initConnector();
    } else if (!document.getElementById('blasterView').classList.contains('hidden')) {
      initBlaster();
    } else if (!document.getElementById('cipherView').classList.contains('hidden')) {
      initCipher();
    }
  };
}

// Load launcher states on mount
window.onload = () => {
  updateHighscoresUI();
  updateMilestonesUI();
};

// Block single-finger interactions
document.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) e.preventDefault();
}, { passive: false });

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

// iOS pinch safeguard
document.addEventListener('gesturestart', (e) => {
  e.preventDefault();
});
