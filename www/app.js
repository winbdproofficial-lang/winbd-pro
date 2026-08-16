const grid=document.getElementById('gameGrid');
let games=[];
function escapeHtml(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function render(filter='all'){
  const list=games.filter(g=>filter==='all'||g.category_slug===filter);
  grid.innerHTML=list.map(g=>`<article class="game"><div class="gameIcon">${escapeHtml(g.icon||'🎮')}</div><h3>${escapeHtml(g.name)}</h3><p>${escapeHtml(g.category_name||'GAME')} · ${escapeHtml(g.provider||'WINBD-PRO')}</p><button onclick="playGame('${escapeHtml(g.name)}')">খেলুন</button></article>`).join('')||'<p style="color:#8995aa">এই category-তে এখন কোনো game নেই।</p>';
}
async function loadGames(){
  const {data,error}=await supabaseClient.from('games').select('id,name,slug,provider,thumbnail_url,description,category_id,game_categories(name,slug)').eq('is_active',true).order('sort_order');
  if(error){console.error(error);games=[];render();return}
  games=(data||[]).map(g=>({...g,category_name:g.game_categories?.name,category_slug:g.game_categories?.slug}));
  render(document.querySelector('.filters button.active')?.dataset.filter||'all');
}
document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.filter)});
const modal=document.getElementById('modal'),content=document.getElementById('modalContent');
function openModal(html){content.innerHTML=html;modal.classList.remove('hidden')}
document.getElementById('closeModal').onclick=()=>modal.classList.add('hidden');
async function loadSession(){const {data:{session}}=await supabaseClient.auth.getSession();if(session){const {data:profile}=await supabaseClient.from('profiles').select('display_name,username').eq('id',session.user.id).maybeSingle();document.getElementById('loginBtn').textContent=profile?.display_name||profile?.username||'Account';const {data:wallet}=await supabaseClient.from('wallets').select('demo_balance').eq('user_id',session.user.id).maybeSingle();if(wallet)document.getElementById('balance').textContent=`৳ ${Number(wallet.demo_balance).toLocaleString('en-US')}`}}
function auth(title,signup=false){openModal(`<h2>${title}</h2><p id="authMsg" style="color:#8995aa">Supabase account ব্যবহার করুন।</p><input id="authEmail" type="email" placeholder="ইমেইল" autocomplete="email"><input id="authPassword" type="password" placeholder="পাসওয়ার্ড" autocomplete="current-password">${signup?'<input id="authName" placeholder="নাম">':''}<button class="primary" id="authSubmit">${signup?'অ্যাকাউন্ট তৈরি করুন':'লগইন'}</button>`);document.getElementById('authSubmit').onclick=()=>submitAuth(signup)}
async function submitAuth(signup){const email=document.getElementById('authEmail').value.trim(),password=document.getElementById('authPassword').value,msg=document.getElementById('authMsg');if(!email||password.length<6){msg.textContent='সঠিক email এবং কমপক্ষে ৬ অক্ষরের password দিন।';return}let result;if(signup){const display_name=document.getElementById('authName').value.trim()||email.split('@')[0];result=await supabaseClient.auth.signUp({email,password,options:{data:{display_name}}})}else result=await supabaseClient.auth.signInWithPassword({email,password});if(result.error){msg.textContent=result.error.message;return}modal.classList.add('hidden');await loadSession();if(signup&&!result.data.session)openModal('<h2>ইমেইল যাচাই করুন</h2><p style="color:#8995aa">আপনার email-এ verification link পাঠানো হয়েছে।</p>')}
document.getElementById('loginBtn').onclick=()=>auth('লগইন',false);document.getElementById('signupBtn').onclick=()=>auth('অ্যাকাউন্ট খুলুন',true);
document.getElementById('bonusBtn').onclick=()=>openModal('<h2>🎁 Demo Bonus</h2><p style="color:#8995aa">Demo wallet-এর জন্য bonus flow পরবর্তী ধাপে যোগ করা হবে।</p>');
function playGame(name){openModal(`<h2>🎮 ${name}</h2><p style="color:#8995aa">Game launch screen — বর্তমানে demo mode। Provider/API integration পরে যোগ করা যাবে।</p><button class="primary" onclick="document.getElementById('modal').classList.add('hidden')">ফিরে যান</button>`) }
document.getElementById('langBtn').onclick=e=>{e.target.textContent=e.target.textContent==='EN'?'বাংলা':'EN'};
loadGames();loadSession();