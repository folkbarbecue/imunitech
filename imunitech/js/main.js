// Minimal front-end logic: login mock, store data in localStorage, populate pages
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  // Simple auth mock
  function setUser(email){localStorage.setItem('imunitech_user', JSON.stringify({email,emailLower:email.toLowerCase(),points:0,badges:[]}));}
  function getUser(){return JSON.parse(localStorage.getItem('imunitech_user')||'null');}
  function requireAuth(){if(!getUser()){location.href='index.html'}}
  // login page
  if(path==='index.html'){
    const form = document.getElementById('loginForm');
    const demo = document.getElementById('demoRegister');
    form&&form.addEventListener('submit',(e)=>{e.preventDefault();setUser(document.getElementById('email').value||'user@exemplo');location.href='dashboard.html'})
    demo&&demo.addEventListener('click',(e)=>{e.preventDefault();setUser('demo@imunitech');location.href='dashboard.html'})
    document.getElementById('readAbout')&&document.getElementById('readAbout').addEventListener('click',()=>{if(window.speech){speak('ImuniTech ajuda a acompanhar vacinas, lembretes e doações de sangue.')}})
  }
  // Dashboard
  if(path==='dashboard.html'){
    requireAuth();
    const user=getUser();
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('points').textContent = user.points||0;
    document.getElementById('logout')?.addEventListener('click',()=>{localStorage.removeItem('imunitech_user')});
    // mock data - histórico de vacinação
    const vaccineHistory = [
      {id: 1, name: 'BCG', date: '1990-01-15', lot: 'A123', unit: 'US Cordeiro', done: true},
      {id: 2, name: 'Hepatite B', date: '1990-02-15', lot: 'B456', unit: 'US Cordeiro', done: true},
      {id: 3, name: 'DTP', date: '1990-04-15', lot: 'C789', unit: 'US Casa Amarela', done: true},
      {id: 4, name: 'COVID-19', date: '2025-06-20', lot: 'D012', unit: 'Shopping RioMar', done: true},
      {id: 5, name: 'Gripe', date: '2025-10-01', lot: 'E345', unit: 'US Mangueira', done: true}
    ];

    // Próximas vacinas
    const upcomingVaccines = [
      {id: 6, name: 'Tétano (Reforço)', date: '2025-11-10', unit: 'US Alto do Pascoal', done: false},
      {id: 7, name: 'Gripe (2026)', date: '2026-03-15', unit: 'Shopping Recife', done: false}
    ];

    const donations = [
      {id: 1, center: 'HEMOPE - Recife', date: '2025-12-01', scheduled: false}
    ];

    // Render cartão de vacinação
    const historyEl = document.getElementById('vaccineHistory');
    vaccineHistory.forEach(v => {
      const el = document.createElement('div');
      el.className = 'vaccine-entry';
      el.innerHTML = `
        <div class="date">${new Date(v.date).toLocaleDateString('pt-BR')}</div>
        <div>
          <strong>${v.name}</strong>
          <div class="muted">Lote: ${v.lot} • ${v.unit}</div>
        </div>
        <span class="status">Aplicada</span>
      `;
      historyEl.appendChild(el);
    });

    // QR Code placeholder
    const qrEl = document.getElementById('vaccineQR');
    qrEl.innerHTML = `
      <svg width="100" height="100" viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="#000" stroke-width="2"/>
        <text x="50" y="55" text-anchor="middle" font-size="10">CNS Digital</text>
      </svg>
    `;

    // Render próximas vacinas
    const vList = document.getElementById('vaccinesList');
    upcomingVaccines.forEach(v => {
      const el = document.createElement('div');
      el.className = 'item';
      el.setAttribute('role', 'listitem');
      el.innerHTML = `
        <div>
          <strong>${v.name}</strong>
          <div class="muted">${new Date(v.date).toLocaleDateString('pt-BR')} • ${v.unit}</div>
        </div>
        <div>
          <button data-id="${v.id}" class="primary check">Registrar</button>
        </div>
      `;
      vList.appendChild(el);
    });
    const dList=document.getElementById('donationsList');
    donations.forEach(d=>{const el=document.createElement('div');el.className='item';el.setAttribute('role','listitem');el.innerHTML=`<div><strong>${d.center}</strong><div class="muted">${d.date}</div></div><div><button data-id="${d.id}" class="primary schedule">Agendar</button></div>`;dList.appendChild(el)});
    // interactions: increment points on register/schedule
    document.addEventListener('click',e=>{if(e.target.matches('.check')||e.target.matches('.schedule')){const user2=getUser();user2.points=(user2.points||0)+10;localStorage.setItem('imunitech_user',JSON.stringify(user2));document.getElementById('points').textContent=user2.points;alert('Ação registrada! +10 pontos')}})
    document.getElementById('readDashboard')?.addEventListener('click',()=>{speak(`Usuário ${user.email}. Você tem ${user.points||0} pontos.`)})
  }
  // Reminders
  if(path==='reminders.html'){
    requireAuth();
    const list = document.getElementById('reminderList');
    function load(){list.innerHTML='';(JSON.parse(localStorage.getItem('imunitech_reminders')||'[]')).forEach((r,i)=>{const li=document.createElement('li');li.className='item';li.innerHTML=`<div><strong>${r.text}</strong><div class="muted">${r.time}</div></div><div><button data-i="${i}" class="secondary remove">Remover</button></div>`;list.appendChild(li)})}
    load();
    document.getElementById('reminderForm')?.addEventListener('submit',e=>{e.preventDefault();const text=document.getElementById('remText').value;const time=document.getElementById('remTime').value;const arr=JSON.parse(localStorage.getItem('imunitech_reminders')||'[]');arr.push({text,time});localStorage.setItem('imunitech_reminders',JSON.stringify(arr));document.getElementById('remText').value='';load();alert('Lembrete salvo')});
    document.addEventListener('click',e=>{if(e.target.matches('.remove')){const i=e.target.dataset.i;const arr=JSON.parse(localStorage.getItem('imunitech_reminders')||'[]');arr.splice(i,1);localStorage.setItem('imunitech_reminders',JSON.stringify(arr));load()}})
  }
  // Info
  if(path==='info.html'){
    document.getElementById('readInfo')?.addEventListener('click',()=>{speak(document.querySelector('article').innerText)})
    document.getElementById('logout3')?.addEventListener('click',()=>{localStorage.removeItem('imunitech_user')});
  }
  // Gamification
  if(path==='gamification.html'){
    requireAuth();
    const user = getUser();
    if (!user.level) user.level = 1;
    if (!user.badges) user.badges = [];
    if (!user.points) user.points = 0;
    if (!user.inventory) user.inventory = [];
    
    // Update UI elements
    document.getElementById('totalPoints').textContent = user.points;
    document.getElementById('userLevel').textContent = user.level;
    document.getElementById('logout4')?.addEventListener('click', () => {
      localStorage.removeItem('imunitech_user')
    });

    // Level progress
    const pointsPerLevel = 100;
    const progress = (user.points % pointsPerLevel) / pointsPerLevel * 100;
    document.getElementById('levelProgress').style.width = progress + '%';
    document.getElementById('nextLevel').textContent = pointsPerLevel - (user.points % pointsPerLevel);

    // Badges system
    const badgesEl = document.getElementById('badges');
    const badges = [
      { id: 'daily', name: 'Check-in Diário', icon: '📅' },
      { id: 'vaccine', name: 'Vacinação em Dia', icon: '💉' },
      { id: 'blood', name: 'Doador de Sangue', icon: '❤️' },
      { id: 'streak', name: '7 Dias Seguidos', icon: '🌟' },
      { id: 'master', name: 'Mestre da Saúde', icon: '🏆' }
    ];
    
    function renderBadges() {
      badgesEl.innerHTML = '';
      badges.forEach(b => {
        const hasThisBadge = user.badges.includes(b.id);
        const el = document.createElement('div');
        el.className = 'badge ' + (!hasThisBadge ? 'locked' : '');
        el.innerHTML = `${b.icon} ${b.name}`;
        badgesEl.appendChild(el);
      });
    }
    renderBadges();

    // Store system
    const storeItems = [
      { id: 'cafe_bonus', name: 'Vale Café', cost: 50, icon: '☕', description: 'Café grátis na Cafeteria Municipal' },
      { id: 'copo_eco', name: 'Copo Ecológico', cost: 100, icon: '🥤', description: 'Copo reutilizável da Prefeitura do Recife' },
      { id: 'kit_saude', name: 'Kit Saúde', cost: 150, icon: '🎽', description: 'Camisa + Squeeze + Toalha fitness' },
      { id: 'mochila', name: 'Mochila Sustentável', cost: 200, icon: '🎒', description: 'Mochila feita de material reciclado' },
      { id: 'bike_share', name: 'Bike Recife', cost: 250, icon: '🚲', description: '1 mês de BikeRecife grátis' },
      { id: 'curso_saude', name: 'Curso de Saúde', cost: 300, icon: '📚', description: 'Curso presencial na Academia da Cidade' }
    ];

    const storeEl = document.getElementById('storeItems');
    function renderStore() {
      storeEl.innerHTML = '';
      storeItems.forEach(item => {
        const owned = user.inventory.includes(item.id);
        const canAfford = user.points >= item.cost;
        const el = document.createElement('div');
        el.className = 'store-item';
        el.innerHTML = `
          <div>
            <h3>${item.icon} ${item.name}</h3>
            <p class="muted">${item.description}</p>
            <p class="points">${item.cost} pontos</p>
          </div>
          <button class="secondary" 
            ${owned ? 'disabled' : ''} 
            ${!canAfford ? 'disabled' : ''} 
            data-item="${item.id}">
            ${owned ? 'Obtido' : (canAfford ? 'Obter' : 'Pontos insuficientes')}
          </button>
        `;
        if (!owned && canAfford) {
          el.querySelector('button').addEventListener('click', () => purchaseItem(item));
        }
        storeEl.appendChild(el);
      });
    }
    renderStore();

    function purchaseItem(item) {
      if (user.points >= item.cost && !user.inventory.includes(item.id)) {
        user.points -= item.cost;
        user.inventory.push(item.id);
        localStorage.setItem('imunitech_user', JSON.stringify(user));
        document.getElementById('totalPoints').textContent = user.points;
        renderStore();
        alert(`${item.name} desbloqueado! Você ainda tem ${user.points} pontos.`);
      }
    }

    // Daily check-in and points
    document.getElementById('claimBadge')?.addEventListener('click', () => {
      const today = new Date().toLocaleDateString();
      if (user.lastCheckIn === today) {
        alert('Você já registrou sua atividade hoje! Volte amanhã.');
        return;
      }
      
      user.lastCheckIn = today;
      user.points += 20;
      if (!user.badges.includes('daily')) {
        user.badges.push('daily');
      }
      
      // Check for streak badge
      if (!user.badges.includes('streak')) {
        user.checkInStreak = (user.checkInStreak || 0) + 1;
        if (user.checkInStreak >= 7) {
          user.badges.push('streak');
        }
      }

      // Level up check
      const newLevel = Math.floor(user.points / 100) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
        alert(`Parabéns! Você alcançou o nível ${newLevel}!`);
      }

      localStorage.setItem('imunitech_user', JSON.stringify(user));
      document.getElementById('totalPoints').textContent = user.points;
      document.getElementById('userLevel').textContent = user.level;
      const progress = (user.points % 100) / 100 * 100;
      document.getElementById('levelProgress').style.width = progress + '%';
      document.getElementById('nextLevel').textContent = 100 - (user.points % 100);
      renderBadges();
      renderStore();
      
      speak(`Atividade registrada! Você ganhou 20 pontos e está no nível ${user.level}`);
    });
  }
})();
