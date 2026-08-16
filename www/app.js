const games=[['🎰','Lucky Slots','slots'],['🃏','Royal Cards','table'],['🎯','Turbo Arcade','arcade'],['🎲','Classic Dice','table'],['💎','Gem Spin','slots'],['🚀','Rocket Run','arcade'],['🐯','Tiger Quest','slots'],['🏆','Champion Table','table']];
const grid=document.getElementById('gameGrid');
function render(filter='all'){grid.innerHTML=games.filter(g=>filter==='all'||g[2]===filter).map(g=>`<article class="game"><div class="gameIcon">${g[0]}</div><h3>${g[1]}</h3><p>${g[2].toUpperCase()} · Demo mode</p><button onclick="playGame('${g[1]}')">খেলুন</button></article>`).join('')}
render();
document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.filter)});
const modal=document.getElementById('modal'),content=document.getElementById('modalContent');
function openModal(html){content.innerHTML=html;modal.classList.remove('hidden')}
document.getElementById('closeModal').onclick=()=>modal.classList.add('hidden');

async function loadSession(){
  const {data:{session}}=await supabaseClient.auth.getSession();
  if(session){
    const {data:profile}=await supabaseClient.from('profiles').select('display_name,username').eq('id',session.user.id).maybeSingle();
    document.getElementById('loginBtn').textContent=profile?.display_name||profile?.username||'Account';
    const {data:wallet}=await supabaseClient.from('wallets').select('demo_balance').eq('user_id',session.user.id).maybeSingle();
    if(wallet) document.getElementById('balance').textContent=`৳ ${Number(wallet.demo_balance).toLocaleString('en-US')}`;
  }
}

function auth(title,signup=false){
  openModal(`<h2>${title}</h2><p id="authMsg" style="color:#8995aa">Supabase account ব্যবহার করুন।</p><input id="authEmail" type="email" placeholder="ইমেইল" autocomplete="email"><input id="authPassword" type="password" placeholder="পাসওয়ার্ড" autocomplete="current-password">${signup?'<input id="authName" placeholder="নাম">':''}<button class="primary" id="authSubmit">${signup?'অ্যাকাউন্ট তৈরি করুন':'লগইন'}</button>`);
  document.getElementById('authSubmit').onclick=()=>submitAuth(signup);
}
async function submitAuth(signup){
  const email=document.getElementById('authEmail').value.trim();
  const password=document.getElementById('authPassword').value;
  const msg=document.getElementById('authMsg');
  if(!email||password.length<6){msg.textContent='সঠিক email এবং কমপক্ষে ৬ অক্ষরের password দিন।';return}
  let result;
  if(signup){
    const display_name=document.getElementById('authName').value.trim()||email.split('@')[0];
    result=await supabaseClient.auth.signUp({email,password,options:{data:{display_name}}});
  }else result=await supabaseClient.auth.signInWithPassword({email,password});
  if(result.error){msg.textContent=result.error.message;return}
  modal.classList.add('hidden');
  await loadSession();
  if(signup&&!result.data.session) openModal('<h2>ইমেইল যাচাই করুন</h2><p style="color:#8995aa">আপনার email-এ verification link পাঠানো হয়েছে।</p>');
}
document.getElementById('loginBtn').onclick=()=>auth('লগইন',false);
document.getElementById('signupBtn').onclick=()=>auth('অ্যাকাউন্ট খুলুন',true);
document.getElementById('bonusBtn').onclick=()=>openModal('<h2>🎁 Demo Bonus</h2><p style="color:#8995aa">Demo wallet-এর জন্য bonus flow পরবর্তী ধাপে যোগ করা হবে।</p><button class="primary" onclick="document.getElementById(\'modal\').classList.add(\'hidden\')">ঠিক আছে</button>');
function playGame(name){openModal(`<h2>🎮 ${name}</h2><p style="color:#8995aa">Game launch screen — বর্তমানে demo mode। Provider/API integration পরে যোগ করা যাবে।</p><button class="primary" onclick="document.getElementById('modal').classList.add('hidden')">ফিরে যান</button>`)}
document.getElementById('langBtn').onclick=e=>{e.target.textContent=e.target.textContent==='EN'?'বাংলা':'EN'};
loadSession();
