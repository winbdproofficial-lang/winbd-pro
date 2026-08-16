const games=[['🎰','Lucky Slots','slots'],['🃏','Royal Cards','table'],['🎯','Turbo Arcade','arcade'],['🎲','Classic Dice','table'],['💎','Gem Spin','slots'],['🚀','Rocket Run','arcade'],['🐯','Tiger Quest','slots'],['🏆','Champion Table','table']];
const grid=document.getElementById('gameGrid');
function render(filter='all'){grid.innerHTML=games.filter(g=>filter==='all'||g[2]===filter).map(g=>`<article class="game"><div class="gameIcon">${g[0]}</div><h3>${g[1]}</h3><p>${g[2].toUpperCase()} · Demo mode</p><button onclick="playGame('${g[1]}')">খেলুন</button></article>`).join('')}
render();
document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.filter)});
const modal=document.getElementById('modal'),content=document.getElementById('modalContent');
function openModal(html){content.innerHTML=html;modal.classList.remove('hidden')};
document.getElementById('closeModal').onclick=()=>modal.classList.add('hidden');
function auth(title){openModal(`<h2>${title}</h2><p style="color:#8995aa">Demo account — Supabase authentication will be connected in the next setup stage.</p><input placeholder="ইমেইল"><input type="password" placeholder="পাসওয়ার্ড"><button class="primary">Continue</button>`)}
document.getElementById('loginBtn').onclick=()=>auth('লগইন');document.getElementById('signupBtn').onclick=()=>auth('অ্যাকাউন্ট খুলুন');
document.getElementById('bonusBtn').onclick=()=>openModal('<h2>🎁 Demo Bonus</h2><p style="color:#8995aa">আপনার virtual demo wallet-এ bonus যোগ করার UI প্রস্তুত।</p><button class="primary" onclick="document.getElementById(\'modal\').classList.add(\'hidden\')">ঠিক আছে</button>');
function playGame(name){openModal(`<h2>🎮 ${name}</h2><p style="color:#8995aa">Game launch screen — বর্তমানে demo mode। Provider/API integration পরে যোগ করা যাবে।</p><button class="primary" onclick="document.getElementById('modal').classList.add('hidden')">ফিরে যান</button>`)}
document.getElementById('langBtn').onclick=e=>{e.target.textContent=e.target.textContent==='EN'?'বাংলা':'EN'};
