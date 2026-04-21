// CyberVerse Dashboard Application
let currentUser = null;
let terminalHistory = [];
let historyIndex = -1;
let cmdCount = 0;

// Load user from session storage
function loadUser() {
  const stored = sessionStorage.getItem('currentUser');
  if (stored) {
    currentUser = JSON.parse(stored);
    updateUI();
  } else {
    // Redirect to login if no user
    window.location.href = 'index.html';
  }
}

// Update UI with user data
function updateUI() {
  document.getElementById('navAgentName').innerText = currentUser.name;
  document.getElementById('sideAgentName').innerText = currentUser.name;
  document.getElementById('sideAvatar').innerText = currentUser.name.charAt(0);
  document.getElementById('profileName').innerText = currentUser.name;
  document.getElementById('profileNameInput').value = currentUser.name;
  document.getElementById('profileEmailInput').value = currentUser.email;
  
  const xp = currentUser.xp || 1240;
  const missions = currentUser.missions || 5;
  
  document.getElementById('statXP').innerText = xp;
  document.getElementById('statMissions').innerText = missions;
  document.getElementById('profileXPVal').innerHTML = `${xp} XP`;
  document.getElementById('profileMissions').innerText = missions;
  
  const xpPercent = (xp / 5000) * 100;
  document.getElementById('profileXPFill').style.width = `${Math.min(xpPercent, 100)}%`;
  document.getElementById('sideXP').innerHTML = `XP: ${xp.toLocaleString()}`;
  
  const rank = Math.floor(Math.random() * 20) + 5;
  document.getElementById('statRank').innerText = `#${rank}`;
  document.getElementById('profileRankNum').innerText = `#${rank}`;
  
  document.getElementById('voiceInfoText').innerHTML = `Your voice passphrase: <strong style="color: var(--green);">${currentUser.phrase || 'Not set'}</strong><br>Use this phrase for voice login next time!`;
}

// Show notification
function showNotification(msg, type = 'success') {
  const stack = document.getElementById('notificationStack');
  const notif = document.createElement('div');
  notif.className = `notification ${type === 'error' ? 'error' : ''}`;
  notif.innerHTML = `${type === 'error' ? '⚠ ' : '✓ '}${msg}`;
  stack.appendChild(notif);
  setTimeout(() => notif.remove(), 4000);
}

// Logout
function logout() {
  sessionStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Panel switching
function showPanel(panelId) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  
  document.getElementById(`panel-${panelId}`).classList.add('active');
  
  document.querySelectorAll('.sidebar-item').forEach(s => {
    if (s.textContent.trim().toLowerCase().includes(panelId.toLowerCase().substring(0, 5))) {
      s.classList.add('active');
    }
  });
  
  document.querySelectorAll('.nav-link').forEach(n => {
    if (n.textContent.trim().toLowerCase().includes(panelId.toLowerCase().substring(0, 5))) {
      n.classList.add('active');
    }
  });
  
  if (panelId === 'leaderboard') loadLeaderboard();
  if (panelId === 'missions') loadMissions();
}

// Terminal functions
function initTerminal() {
  const output = document.getElementById('terminalOutput');
  output.innerHTML = '';
  addTermLine('<span class="term-info">═══════════════════════════════════════════════════════════</span>');
  addTermLine('<span class="term-info">    CYBERVERSE ADVANCED TERMINAL v3.0 - SECURE SESSION</span>');
  addTermLine('<span class="term-info">═══════════════════════════════════════════════════════════</span>');
  addTermLine('');
  addTermLine('<span class="term-success">Welcome, Agent. Type "help" to see available commands.</span>');
  addTermLine('');
}

function addTermLine(html) {
  const output = document.getElementById('terminalOutput');
  const div = document.createElement('div');
  div.innerHTML = html;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

function clearTerminal() {
  const output = document.getElementById('terminalOutput');
  output.innerHTML = '';
  initTerminal();
}

function quickCmd(cmd) {
  document.getElementById('terminalInput').value = cmd;
  executeCommand();
}

function executeCommand() {
  const input = document.getElementById('terminalInput');
  const cmd = input.value.trim();
  if (!cmd) return;
  
  terminalHistory.unshift(cmd);
  historyIndex = -1;
  
  addTermLine(`<span class="terminal-prompt">agent@cyberverse:~$</span> <span style="color:#fff;">${escapeHtml(cmd)}</span>`);
  input.value = '';
  processCommand(cmd.toLowerCase());
  cmdCount++;
}

function processCommand(cmd) {
  if (cmd === 'help') {
    addTermLine('<span class="term-info">Available commands:</span>');
    addTermLine('<span class="term-info">  help                    - Show this help</span>');
    addTermLine('<span class="term-info">  clear                   - Clear terminal</span>');
    addTermLine('<span class="term-info">  whoami                  - Display agent info</span>');
    addTermLine('<span class="term-info">  scan domain &lt;domain&gt;   - DNS & vulnerability scan</span>');
    addTermLine('<span class="term-info">  email_lookup &lt;email&gt;   - Check email breaches</span>');
    addTermLine('<span class="term-info">  username_search &lt;user&gt; - Search across platforms</span>');
    addTermLine('<span class="term-info">  whois &lt;domain&gt;         - WHOIS lookup</span>');
    addTermLine('<span class="term-info">  privacy_score           - Show privacy score</span>');
  } else if (cmd === 'clear') {
    clearTerminal();
  } else if (cmd === 'whoami') {
    addTermLine(`<span class="term-success">Agent: ${currentUser?.name || 'GUEST'}</span>`);
    addTermLine(`<span class="term-info">XP: ${currentUser?.xp || 0} | Missions: ${currentUser?.missions || 0}</span>`);
  } else if (cmd.startsWith('scan domain ')) {
    const domain = cmd.replace('scan domain ', '').trim() || 'example.com';
    addTermLine(`<span class="term-info">🔍 Scanning ${domain}...</span>`);
    setTimeout(() => {
      addTermLine(`<span class="term-success">→ IP: ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}</span>`);
      addTermLine(`<span class="term-info">→ Open Ports: 80, 443, 22, 8080</span>`);
      addTermLine(`<span class="term-warning">→ Risk Score: ${Math.floor(Math.random()*50)+30}/100</span>`);
      if (currentUser) currentUser.xp += 10;
    }, 800);
  } else if (cmd.startsWith('email_lookup ')) {
    const email = cmd.replace('email_lookup ', '').trim();
    addTermLine(`<span class="term-info">📧 Checking ${email}...</span>`);
    setTimeout(() => {
      addTermLine(`<span class="term-success">→ Format: Valid ✓</span>`);
      addTermLine(`<span class="term-warning">→ Found in 2 breaches: RockYou2021, LinkedIn2016</span>`);
      addTermLine(`<span class="term-warning">→ Risk: HIGH - Change password immediately!</span>`);
    }, 700);
  } else if (cmd.startsWith('username_search ')) {
    const user = cmd.replace('username_search ', '').trim();
    addTermLine(`<span class="term-info">👤 Searching ${user} across platforms...</span>`);
    setTimeout(() => {
      addTermLine(`<span class="term-success">→ GitHub: FOUND ✓</span>`);
      addTermLine(`<span class="term-success">→ Twitter/X: FOUND ✓</span>`);
      addTermLine(`<span class="term-info">→ Reddit: NOT FOUND</span>`);
    }, 600);
  } else if (cmd.startsWith('whois ')) {
    const domain = cmd.replace('whois ', '').trim();
    addTermLine(`<span class="term-info">🌐 WHOIS lookup for ${domain}...</span>`);
    setTimeout(() => {
      addTermLine(`<span class="term-info">→ Registrar: NameCheap, Inc.</span>`);
      addTermLine(`<span class="term-info">→ Created: 2020-${Math.floor(Math.random()*12)+1}-${Math.floor(Math.random()*28)+1}</span>`);
    }, 500);
  } else if (cmd === 'privacy_score') {
    addTermLine(`<span class="term-info">🛡️ Privacy Score: ${currentUser?.privacyScore || 82}/100</span>`);
    addTermLine(`<span class="term-warning">→ Recommendations: Remove old accounts, enable 2FA</span>`);
  } else {
    addTermLine(`<span class="term-error">Command not found: ${cmd}. Type 'help' for available commands.</span>`);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// OSINT Tools
function runOsint(type) {
  let input, resultDiv, output = '';
  
  if (type === 'username') {
    input = document.getElementById('osintUser').value.trim();
    resultDiv = document.getElementById('osintUserResult');
    if (!input) { showNotification('Enter a username', 'error'); return; }
    output = `🔍 Username "${input}" found on: GitHub, Twitter/X, Reddit<br>📊 Risk Level: MEDIUM`;
  } else if (type === 'email') {
    input = document.getElementById('osintEmail').value.trim();
    resultDiv = document.getElementById('osintEmailResult');
    if (!input) { showNotification('Enter an email', 'error'); return; }
    output = `📧 Email "${input}"<br>✓ Valid format<br>⚠ Found in 3 breaches: RockYou2021, LinkedIn2016, Adobe2013<br>🔴 Risk: HIGH - Change password!`;
  } else if (type === 'domain') {
    input = document.getElementById('osintDomain').value.trim();
    resultDiv = document.getElementById('osintDomainResult');
    if (!input) { showNotification('Enter a domain', 'error'); return; }
    output = `🌐 Domain "${input}"<br>📍 IP: ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}<br>⚠ Risk Score: ${Math.floor(Math.random()*50)+30}/100`;
  } else if (type === 'ip') {
    input = document.getElementById('osintIP').value.trim();
    resultDiv = document.getElementById('osintIPResult');
    if (!input) { showNotification('Enter an IP', 'error'); return; }
    const countries = ['USA', 'Germany', 'UK', 'Singapore', 'Japan'];
    output = `📍 IP "${input}"<br>🌍 Country: ${countries[Math.floor(Math.random()*countries.length)]}<br>🔒 VPN/Proxy: ${Math.random() > 0.5 ? 'Detected ⚠' : 'Not detected'}`;
  }
  
  resultDiv.innerHTML = output;
  resultDiv.classList.add('show');
  if (currentUser) currentUser.xp += 5;
  showNotification(`OSINT scan complete: ${input}`);
}

// Missions
const missionsList = [
  { title: 'PhishTrack Alpha', difficulty: 'easy', xp: 150, desc: 'Investigate phishing campaign targeting employees.' },
  { title: 'RedNet Infiltration', difficulty: 'medium', xp: 280, desc: 'Trace unauthorized access in fintech platform.' },
  { title: 'Ghost Protocol', difficulty: 'hard', xp: 420, desc: 'Identify threat actor selling corporate data.' }
];

function loadMissions() {
  const grid = document.getElementById('missionsGrid');
  grid.innerHTML = missionsList.map(m => `
    <div class="mission-card" onclick="acceptMission('${m.title}', ${m.xp})">
      <div class="mission-difficulty difficulty-${m.difficulty}">${m.difficulty.toUpperCase()}</div>
      <div class="mission-title">${m.title}</div>
      <div class="mission-desc">${m.desc}</div>
      <div class="mission-reward">🏆 ${m.xp} XP</div>
    </div>
  `).join('');
}

function acceptMission(title, xp) {
  showNotification(`Mission "${title}" started! Use OSINT tools to investigate.`);
  setTimeout(() => {
    if (currentUser) {
      currentUser.xp = (currentUser.xp || 0) + xp;
      currentUser.missions = (currentUser.missions || 0) + 1;
      document.getElementById('statXP').innerText = currentUser.xp;
      document.getElementById('statMissions').innerText = currentUser.missions;
      document.getElementById('profileXPVal').innerHTML = `${currentUser.xp} XP`;
      document.getElementById('profileMissions').innerText = currentUser.missions;
      const xpPercent = (currentUser.xp / 5000) * 100;
      document.getElementById('profileXPFill').style.width = `${Math.min(xpPercent, 100)}%`;
      document.getElementById('sideXP').innerHTML = `XP: ${currentUser.xp.toLocaleString()}`;
      showNotification(`Mission complete! +${xp} XP earned!`, 'success');
      loadLeaderboard();
    }
  }, 5000);
}

// Leaderboard
function loadLeaderboard() {
  const users = JSON.parse(localStorage.getItem('cyberverse_users')) || [];
  const allUsers = [...users];
  if (currentUser && !allUsers.find(u => u.email === currentUser.email)) {
    allUsers.push(currentUser);
  }
  
  const sorted = allUsers.sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 10);
  const body = document.getElementById('leaderboardBody');
  
  body.innerHTML = sorted.map((u, i) => `
    <div class="leaderboard-row ${currentUser && u.email === currentUser.email ? 'me' : ''}">
      <div>${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</div>
      <div>${u.name}${currentUser && u.email === currentUser.email ? ' (YOU)' : ''}</div>
      <div>${(u.xp || 0).toLocaleString()}</div>
      <div>${u.missions || 0}</div>
      <div><span style="border:1px solid var(--border2);padding:2px 8px;font-size:9px;">${i < 3 ? 'ELITE' : 'HUNTER'}</span></div>
    </div>
  `).join('');
}

// Profile
function saveProfile() {
  const newName = document.getElementById('profileNameInput').value.trim().toUpperCase();
  if (newName && currentUser) {
    currentUser.name = newName;
    document.getElementById('profileName').innerText = newName;
    document.getElementById('navAgentName').innerText = newName;
    document.getElementById('sideAgentName').innerText = newName;
    document.getElementById('sideAvatar').innerText = newName.charAt(0);
    showNotification('Profile updated successfully!');
  }
}

// Clock
function startClock() {
  function tick() {
    const now = new Date();
    document.getElementById('clockDisplay').textContent = now.toUTCString().replace('GMT', 'UTC');
  }
  tick();
  setInterval(tick, 1000);
}

// Event Listeners
document.getElementById('logoutBtn')?.addEventListener('click', logout);
document.getElementById('terminalInput')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') executeCommand();
});

// Initialize
loadUser();
initTerminal();
loadMissions();
loadLeaderboard();
startClock();

// Tip rotation
const tips = [
  "💡 Type 'help' in the terminal to see all available commands.",
  "💡 Complete missions to earn XP and climb the leaderboard.",
  "💡 Use OSINT tools to investigate domains, emails, and usernames.",
  "💡 Your voice passphrase is unique to you - keep it secure!"
];
let tipIndex = 0;
setInterval(() => {
  const aiMsg = document.getElementById('aiMessage');
  if (aiMsg && aiMsg.offsetParent) {
    aiMsg.innerHTML = tips[tipIndex % tips.length];
    tipIndex++;
  }
}, 15000);

// Background particles
const canvas = document.getElementById('canvas-bg');
const ctxBg = canvas.getContext('2d');
let particles = [];

function resizeBg() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 2 + 0.5,
      a: Math.random() * 0.5 + 0.1
    });
  }
}

function drawBg() {
  ctxBg.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctxBg.globalAlpha = p.a;
    ctxBg.fillStyle = '#00ff9d';
    ctxBg.beginPath();
    ctxBg.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctxBg.fill();
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });
  requestAnimationFrame(drawBg);
}

resizeBg();
initParticles();
drawBg();
window.addEventListener('resize', () => { resizeBg(); initParticles(); });