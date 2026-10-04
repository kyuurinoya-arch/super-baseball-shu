let state = {
  year: 1,
  month: 4,
  week: 1,
  points: 1000,
  players: []
};

const SAVE_KEY = 'baseball_simulator_save_data';

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("セーブに失敗したであります...", e);
  }
}

function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      state = JSON.parse(saved);
      return true;
    }
  } catch (e) {
    console.error("ロードに失敗したであります...", e);
  }
  return false;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createPlayer(grade, isPitcher) {
  const id = Date.now() + Math.random();
  const name = isPitcher ? `投手${getRandomInt(1,99)}` : `野手${getRandomInt(1,99)}`;
  let p = { id, name, grade, isPitcher, league: 'normal', dispatched: false };
  
  if (isPitcher) {
    const rSpeed = Math.random();
    if (rSpeed < 0.3) p.speedKm = getRandomInt(110, 120);
    else if (rSpeed < 0.9) p.speedKm = getRandomInt(121, 130);
    else p.speedKm = getRandomInt(131, 140);

    p.control = drawStat();
    p.stamina = drawStat();
    p.breakingName = BREAKING_BALLS[getRandomInt(0, BREAKING_BALLS.length - 1)];
    p.breakingLv = drawBreakingLv();
    p.individuality = PITCHER_IND[getRandomInt(0, PITCHER_IND.length - 1)];
  } else {
    p.meet = drawStat();
    p.power = drawStat();
    p.speed = drawStat();
    p.individuality = BATTER_IND[getRandomInt(0, BATTER_IND.length - 1)];
    p.breakingName = '';
    p.breakingLv = 0;
  }
  p.indLevel = 1;
  return p;
}

function drawStat() {
  const r = Math.random();
  if (r < 0.2) return getRandomInt(1, 100);
  if (r < 0.7) return getRandomInt(101, 300);
  if (r < 0.9) return getRandomInt(301, 400);
  return getRandomInt(401, 500);
}

function drawBreakingLv() {
  const r = Math.random();
  if (r < 0.3) return 1;
  if (r < 0.7) return 2;
  if (r < 0.95) return 3;
  if (r < 0.99) return 4;
  return 5;
}

function startGame() {
  if (loadGame()) {
    alert("前回の続きからスタートするであります！📁");
  } else {
    state.players = [];
    for(let i=0; i<5; i++) state.players.push(createPlayer(1, true));
    for(let i=0; i<5; i++) state.players.push(createPlayer(1, false));
    for(let i=0; i<5; i++) state.players.push(createPlayer(2, true));
    for(let i=0; i<5; i++) state.players.push(createPlayer(2, false));
    for(let i=0; i<3; i++) state.players.push(createPlayer(3, true));
    for(let i=0; i<3; i++) state.players.push(createPlayer(3, false));
    saveGame();
  }

  document.getElementById('title-screen').classList.remove('active');
  document.getElementById('game-main').classList.add('active');
  updateUI();
}

function switchTab(tabName) {
  document.querySelectorAll('.game-tab').forEach(el => el.style.display = 'none');
  document.querySelectorAll('nav button').forEach(el => el.classList.remove('active'));
  
  if(tabName === 'roster') {
    document.getElementById('tab-roster').style.display = 'block';
    document.getElementById('nav-roster').classList.add('active');
    renderRoster();
  } else if(tabName === 'dispatch') {
    document.getElementById('tab-dispatch').style.display = 'block';
    document.getElementById('nav-dispatch').classList.add('active');
    renderDispatch();
  } else if(tabName === 'progress') {
    document.getElementById('tab-progress').style.display = 'block';
    document.getElementById('nav-progress').classList.add('active');
  } else if(tabName === 'settings') {
    document.getElementById('tab-settings').style.display = 'block';
    document.getElementById('nav-settings').classList.add('active');
  }
}

function updateUI() {
  document.getElementById('txt-year').textContent = `${state.year}年目`;
  document.getElementById('txt-month').textContent = `${state.month}月`;
  document.getElementById('txt-week').textContent = `第${state.week}週`;
  document.getElementById('txt-points').textContent = state.points.toLocaleString();
  renderRoster();
  saveGame();
}

function renderRoster() {
  const list = document.getElementById('roster-list');
  if (!list) return;
  let html = '';
  state.players.forEach(p => {
    const cardClass = p.isPitcher ? 'player-card pitcher' : 'player-card batter';
    const accentColor = p.isPitcher ? 'var(--pitcher-color)' : 'var(--batter-color)';
    
    html += `
      <div class="${cardClass}">
        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
          <div class="player-avatar-box">${p.isPitcher ? '投手' : '野手'}</div>
          <div style="flex-grow: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="player-name">${p.name}</span> 
                <span class="player-sub">(${p.grade}年生)</span>
              </div>
              <button class="btn-sm" onclick="renamePlayer(${p.id})">改名</button>
            </div>
            <div>
              <span class="badge-ind" style="background: rgba(${p.isPitcher ? '30, 136, 229' : '251, 140, 0'}, 0.15); color: ${accentColor}; border-color: rgba(${p.isPitcher ? '30, 136, 229' : '251, 140, 0'}, 0.4);">
                ✨ ${p.individuality}
              </span>
            </div>
          </div>
        </div>
        <div class="stat-bar-container">
          ${p.isPitcher ? `
            <div class="stat-item"><span class="stat-label">球速</span><span class="stat-value" style="color:var(--pitcher-color);">${p.speedKm.toFixed(1)} km/h</span></div>
            <div class="stat-item"><span class="stat-label">コントロール</span><span class="stat-value">${p.control}</span></div>
            <div class="stat-item"><span class="stat-label">スタミナ</span><span class="stat-value">${p.stamina}</span></div>
            <div class="stat-item" style="grid-column: span 3; margin-top: 4px; border-top: 1px solid #333; padding-top: 4px;">
              <span class="stat-label">変化球</span><span class="stat-value" style="color: #ffd700;">${p.breakingName} (Lv.${p.breakingLv})</span>
            </div>
          ` : `
            <div class="stat-item"><span class="stat-label">ミート</span><span class="stat-value" style="color:var(--batter-color);">${p.meet}</span></div>
            <div class="stat-item"><span class="stat-label">パワー</span><span class="stat-value" style="color:var(--batter-color);">${p.power}</span></div>
            <div class="stat-item"><span class="stat-label">スピード</span><span class="stat-value" style="color:var(--batter-color);">${p.speed}</span></div>
          `}
        </div>
      </div>
    `;
  });
  list.innerHTML = html;
}

function canChangeDispatch() {
  return state.month >= 4 && state.month < 11;
}

function renderDispatch() {
  const list = document.getElementById('dispatch-list');
  const countSpan = document.getElementById('dispatch-count');
  const notice = document.getElementById('dispatch-notice');
  if (!list) return;

  const dispatched = state.players.filter(p => p.dispatched);
  countSpan.textContent = dispatched.length;

  const editable = canChangeDispatch();
  notice.textContent = editable ? "⭐ 特徴に合わせたリーグを選ぼう！" : "🔒【派遣ロック中】11月～3月は変更不可";
  notice.style.color = editable ? "var(--accent-color)" : "#ff5252";

  let html = '';
  state.players.forEach(p => {
    html += `
      <div class="player-card ${p.isPitcher ? 'pitcher':'batter'}" style="margin-bottom: 12px;">
        <div class="player-header">
          <div>
            <span class="player-name">${p.name}</span> <span class="player-sub">(${p.grade}年生)</span>
          </div>
          <button class="btn-sm" ${!editable ? 'disabled':''} onclick="toggleDispatch(${p.id})" style="background:${p.dispatched?'var(--accent-color)':'#333'}; color:${p.dispatched?'#0d1117':'#fff'};">
            ${p.dispatched ? '✈️ 派遣中' : '🏠 自校'}
          </button>
        </div>
        <div style="background: #252525; padding: 8px; border-radius: 6px; margin-top:6px;">
          <select ${!editable ? 'disabled':''} onchange="changeLeague(${p.id}, this.value)" style="width:100%; padding: 4px; background:#111; color:#fff; border:1px solid #444;">
            ${LEAGUES.map(l => `<option value="${l.id}" ${p.league === l.id ? 'selected':''}>${l.icon} ${l.name} (×${l.rate})</option>`).join('')}
          </select>
        </div>
      </div>
    `;
  });
  list.innerHTML = html;
}

function toggleDispatch(id) {
  const p = state.players.find(x => x.id === id);
  if(p) { p.dispatched = !p.dispatched; renderDispatch(); saveGame(); }
}

function changeLeague(id, leagueId) {
  const p = state.players.find(x => x.id === id);
  if(p) p.league = leagueId;
  renderDispatch();
  saveGame();
}

function renamePlayer(id) {
  const p = state.players.find(x => x.id === id);
  if(!p) return;
  const newName = prompt("新しい選手名を入力するであります：", p.name);
  if(newName) { p.name = newName; updateUI(); }
}

function progressWeek() {
  state.week++;
  state.players.forEach(p => {
    if(p.isPitcher) {
      p.control = Math.min(1000, p.control + getRandomInt(1, 3));
      p.stamina = Math.min(1000, p.stamina + getRandomInt(1, 3));
      if(Math.random() < 0.3) p.speedKm += 0.2;
    } else {
      p.meet = Math.min(1000, p.meet + getRandomInt(1, 3));
      p.power = Math.min(1000, p.power + getRandomInt(1, 3));
      p.speed = Math.min(1000, p.speed + getRandomInt(1, 3));
    }
  });

  if (state.week > 4) {
    state.week = 1;
    triggerMonthEnd();
  }
  updateUI();
}

function triggerMonthEnd() {
  let monthPt = 0;
  let details = [];
  state.players.forEach(p => {
    if(p.dispatched) {
      const l = LEAGUES.find(x => x.id === p.league) || LEAGUES[0];
      const earned = Math.floor(150 * l.rate);
      monthPt += earned;
      details.push({ name: p.name, league: l.name, pt: earned });
    }
  });
  state.points += monthPt;

  const prevMonth = state.month;
  state.month++;

  let generationMessage = "";

  if (state.month > 12) {
    state.month = 1;
    state.year++;

    const graduates = state.players.filter(p => p.grade === 3);
    state.players = state.players.filter(p => p.grade < 3);

    state.players.forEach(p => {
      p.grade += 1;
      p.dispatched = false;
    });

    for(let i=0; i<5; i++) state.players.push(createPlayer(1, true));
    for(let i=0; i<5; i++) state.players.push(createPlayer(1, false));

    generationMessage = `
      <div style="background: rgba(0,230,118,0.1); border: 1px solid var(--accent-color); padding: 10px; border-radius: 8px; margin-top: 10px; font-size: 11px; text-align: left;">
        <strong style="color: var(--accent-color);">🌸 祝・新年度＆世代交代！</strong><br>
        ・3年生 ${graduates.length}名が卒業していったであります！🎓<br>
        ・在校生が一つ上の学年に進級したであります！<br>
        ・新入生（10名）が新しく入部したであります！⚾
      </div>
    `;
  }

  showResultModal(prevMonth, monthPt, details, generationMessage);
}

function showResultModal(month, totalPt, details, extraHtml = "") {
  document.getElementById('result-modal-title').innerHTML = `🎉 激闘！${month}月度 成績＆獲得Pt 大発表！`;
  let html = `
    <div style="background: rgba(255,215,0,0.1); border: 1px solid #ffd700; padding: 10px; border-radius: 8px; margin-bottom: 12px; text-align: center;">
      <div style="font-size: 11px; color: #ffd700; font-weight: bold;">今月の総獲得ポイント</div>
      <div style="font-size: 20px; font-weight: bold; color: #ffd700;">+${totalPt.toLocaleString()} pt</div>
    </div>
  `;
  
  if (details.length === 0) {
    html += `<div style="font-size: 12px; color: #ff5252; padding: 6px; text-align: center;">今月は誰も派遣していなかったであります。</div>`;
  } else {
    html += `<div style="max-height: 120px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;">`;
    details.forEach(d => {
      html += `
        <div style="background: #252525; padding: 6px 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border-left: 3px solid var(--accent-color);">
          <span style="font-size: 12px; color: #fff;"><strong>${d.name}</strong> (${d.league})</span>
          <span style="font-size: 12px; font-weight: bold; color: #ffd700;">+${d.pt} pt</span>
        </div>
      `;
    });
    html += `</div>`;
  }

  html += extraHtml;

  document.getElementById('result-modal-body').innerHTML = html;
  document.getElementById('result-modal').style.display = 'flex';
}

function closeResultModal() {
  document.getElementById('result-modal').style.display = 'none';
  switchTab('roster');
}

function loadCustomBGM(event) {
  const file = event.target.files[0];
  if (!file) return;
  const audioPlayer = document.getElementById('custom-bgm-player');
  audioPlayer.src = URL.createObjectURL(file);
  audioPlayer.style.display = 'block';
  audioPlayer.play().catch(e => console.log("音声再生制限"));
}