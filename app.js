'use strict';
/* ═══════════════════════════════════════════════════════════
   NOOR NET — app.js  (Complete, All Features Working)
   DB → Auth(A) → UI(U) → Chat(C) → Feed(F) →
   Pages(P) → Prayer(PR) → Members(M) → Admin(AD) → Boot
═══════════════════════════════════════════════════════════ */

/* ══════════════ DATABASE ══════════════ */
const DB = (() => {
  const PFX = 'nn3_';
  const COLORS = ['#1a56db','#059669','#7c3aed','#dc2626','#0891b2','#d97706','#be185d','#0f766e','#4338ca','#b45309'];
  const g = k => { try { return JSON.parse(localStorage.getItem(PFX+k)||'null'); } catch { return null; } };
  const s = (k,v) => { try { localStorage.setItem(PFX+k,JSON.stringify(v)); } catch(e) { T.show('স্টোরেজ পূর্ণ! পুরনো ফাইল মুছুন।','error'); } };
  const d = k => localStorage.removeItem(PFX+k);

  function seed() {
    if (g('seeded')) return;
    const admin = mkUser('অ্যাডমিন','admin','admin@noornet.bd','admin123','admin',COLORS[0]);
    const u1 = mkUser('রাহেলা বেগম','rahela','rahela@demo.com','demo123','user',COLORS[1]);
    const u2 = mkUser('আরিফ হোসেন','arif','arif@demo.com','demo123','user',COLORS[2]);
    const u3 = mkUser('সুমাইয়া খানম','sumaiya','sumaiya@demo.com','demo123','user',COLORS[3]);
    s('users',[admin,u1,u2,u3]);

    /* seed messages */
    const ms = {};
    const ck = convKey;
    const now = Date.now();
    ms[ck(admin.id,u1.id)] = [
      msg(u1.id,admin.id,'text','আস-সালামু আলাইকুম ভাই! কেমন আছেন?',now-7200000),
      msg(admin.id,u1.id,'text','ওয়ালাইকুম আস-সালাম! আলহামদুলিল্লাহ ভালো। আপনি কেমন?',now-7100000),
      msg(u1.id,admin.id,'text','আলহামদুলিল্লাহ! নূর নেট অনেক সুন্দর হয়েছে মাশাআল্লাহ 🌟',now-3600000),
    ];
    ms[ck(admin.id,u2.id)] = [
      msg(u2.id,admin.id,'text','ভাই নতুন পেজ কখন যোগ হবে?',now-86400000),
      msg(admin.id,u2.id,'text','ইনশাআল্লাহ শীঘ্রই! জাযাকাল্লাহ খাইরান 🤲',now-86000000),
    ];
    s('messages',ms);

    s('pages',[
      {id:'p1',title:'নূর নেটে স্বাগতম',body:'আস-সালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু।\n\nনূর নেট একটি বিশেষ ইসলামিক কমিউনিটি প্ল্যাটফর্ম। এখানে মুসলিম ভাই-বোনেরা একে অপরের সাথে যোগাযোগ করতে পারেন, জ্ঞান ভাগ করে নিতে পারেন এবং ইসলামের আলো ছড়িয়ে দিতে পারেন।\n\nআমাদের লক্ষ্য মুসলিম উম্মাহকে একটি সুন্দর ডিজিটাল প্ল্যাটফর্মে একত্রিত করা।',tag:'ঘোষণা',author:'অ্যাডমিন',authorId:admin.id,cover:'',createdAt:now-864000000,views:248},
      {id:'p2',title:'ইসলামের পাঁচটি স্তম্ভ',body:'ইসলামের পাঁচটি মূল স্তম্ভ:\n\n১. শাহাদাহ — লা ইলাহা ইল্লাল্লাহ, মুহাম্মাদুর রাসূলুল্লাহ।\n\n২. সালাত — দৈনিক পাঁচ ওয়াক্ত নামাজ (ফজর, যোহর, আসর, মাগরিব, ইশা)।\n\n৩. জাকাত — নিসাব পরিমাণ সম্পদে ২.৫% বার্ষিক দান।\n\n৪. সাওম — রমজান মাসে রোজা পালন।\n\n৫. হজ — সামর্থ্যবান মুসলিমের জন্য মক্কায় হজ পালন।\n\nএই পাঁচটি স্তম্ভের উপর একজন মুসলিমের জীবন গড়ে ওঠে।',tag:'শিক্ষা',author:'অ্যাডমিন',authorId:admin.id,cover:'',createdAt:now-432000000,views:189},
      {id:'p3',title:'রমজানের ফজিলত',body:'রমজান হলো বরকতের মাস। আল্লাহ তায়ালা এই মাসে কুরআন নাজিল করেছেন।\n\nরমজানের বিশেষ ফজিলত:\n• শয়তানকে শিকলবদ্ধ করা হয়\n• জান্নাতের দরজা খুলে দেওয়া হয়\n• জাহান্নামের দরজা বন্ধ করা হয়\n• লাইলাতুল কদর — হাজার মাসের চেয়ে উত্তম\n\nরাসূল (সা.) বলেছেন: যে ব্যক্তি ঈমান ও সওয়াবের আশায় রমজানে রোজা রাখে তার পূর্ববর্তী গুনাহ মাফ হয়ে যায়।',tag:'ইসলাম',author:'অ্যাডমিন',authorId:admin.id,cover:'',createdAt:now-172800000,views:134},
    ]);

    s('posts',[
      {id:'f1',userId:admin.id,body:'আস-সালামু আলাইকুম! নূর নেটে সবাইকে স্বাগতম 🌙 আল্লাহ আমাদের সবাইকে একসাথে নেক কাজে সহায়তা করুন। আমীন।',img:'',likes:[],comments:[],createdAt:now-3600000*5},
      {id:'f2',userId:u1.id,body:'সুবহানাল্লাহ! আজকের ফজরের নামাজ কতটা শান্তিময় ছিল। আল্লাহর কাছে শুকরিয়া। 🤲',img:'',likes:[admin.id],comments:[{userId:admin.id,text:'মাশাআল্লাহ! আল্লাহ কবুল করুন।',ts:now-3600000*4}],createdAt:now-3600000*4},
    ]);

    s('activity',[
      {text:'সিস্টেম চালু হয়েছে',icon:'ti-power',ts:now-7200000},
      {text:'অ্যাডমিন অ্যাকাউন্ট সক্রিয়',icon:'ti-shield-check',ts:now-7100000},
      {text:'৩টি ডেমো অ্যাকাউন্ট তৈরি',icon:'ti-users',ts:now-7000000},
    ]);
    s('settings',{registration:true,fileSharing:true,maintenance:false});
    s('seeded',true);
  }

  function mkUser(name,username,email,password,role,color) {
    const ini = name.split(' ').map(w=>w[0]).filter(Boolean).join('').substring(0,2)||name[0];
    return {id:'u_'+Math.random().toString(36).slice(2,10),name,username,email,password,role,color,initials:ini,bio:'',createdAt:Date.now()};
  }

  function msg(from,to,type,text,ts,extra={}) {
    return {id:'m_'+Math.random().toString(36).slice(2,12),from,to,type,text,ts,read:false,...extra};
  }

  const convKey = (a,b) => [a,b].sort().join('::');
  const users = () => g('users')||[];
  const saveUsers = u => s('users',u);
  const byId = id => users().find(u=>u.id===id);
  const byEmail = e => users().find(u=>u.email===e);
  const byUsername = u => users().find(x=>x.username===u);
  const others = myId => users().filter(u=>u.id!==myId);

  function addUser(name,username,email,password) {
    const all = users();
    if (all.find(u=>u.email===email)) return {err:'এই ইমেইল ইতিমধ্যে নিবন্ধিত।'};
    if (all.find(u=>u.username===username)) return {err:'এই ইউজারনেম ইতিমধ্যে ব্যবহৃত।'};
    const u = mkUser(name,username,email,password,'user',COLORS[all.length%COLORS.length]);
    all.push(u); saveUsers(all);
    addAct(`নতুন সদস্য: ${name}`,'ti-user-plus');
    return {user:u};
  }

  function removeUser(id) {
    saveUsers(users().filter(u=>u.id!==id));
    const ms = msgs(); Object.keys(ms).forEach(k=>{if(k.includes(id))delete ms[k];}); s('messages',ms);
  }

  const me = () => g('me');
  const setMe = u => s('me',u);
  const clearMe = () => d('me');

  const msgs = () => g('messages')||{};
  const saveMsgs = m => s('messages',m);

  function getConv(a,b) { return msgs()[convKey(a,b)]||[]; }
  function sendMsg(from,to,content) {
    const m = msgs(); const k = convKey(from,to); if(!m[k])m[k]=[];
    const obj = msg(from,to,content.type||'text',content.text||'',Date.now(),{fileName:content.fileName||null,fileSize:content.fileSize||null,fileData:content.fileData||null,mimeType:content.mimeType||null});
    m[k].push(obj); saveMsgs(m);
    addAct(`${byId(from)?.name||'?'} → বার্তা`,'ti-message');
    return obj;
  }
  function markRead(myId,otherId) {
    const m=msgs(),k=convKey(myId,otherId);
    if(m[k]){m[k].forEach(x=>{if(x.from!==myId)x.read=true;});saveMsgs(m);}
  }
  function deleteConv(a,b){const m=msgs();delete m[convKey(a,b)];saveMsgs(m);}
  function unreadFor(myId){let n=0;Object.values(msgs()).forEach(c=>c.forEach(x=>{if(x.to===myId&&!x.read)n++;}));return n;}
  function convUnread(myId,otherId){return getConv(myId,otherId).filter(x=>x.from!==myId&&!x.read).length;}
  function lastMsg(a,b){const c=getConv(a,b);return c[c.length-1]||null;}
  function allConvs(myId){
    return others(myId).map(u=>({user:u,last:lastMsg(myId,u.id),unread:convUnread(myId,u.id)}))
      .sort((a,b)=>(b.last?.ts||0)-(a.last?.ts||0));
  }

  const pages = () => g('pages')||[];
  const savePages = p => s('pages',p);
  function addPage(title,body,tag,cover,authorId){
    const a=byId(authorId);
    const p={id:'p_'+Date.now(),title,body,tag,cover:cover||'',author:a?.name||'অ্যাডমিন',authorId,createdAt:Date.now(),views:0};
    const all=pages();all.push(p);savePages(all);addAct(`নতুন পেজ: "${title}"`,'ti-file-plus');return p;
  }
  function deletePage(id){savePages(pages().filter(p=>p.id!==id));addAct('পেজ মুছে ফেলা হয়েছে','ti-trash');}
  function viewPage(id){const ps=pages(),p=ps.find(x=>x.id===id);if(p){p.views=(p.views||0)+1;savePages(ps);}}

  const posts = () => g('posts')||[];
  const savePosts = p => s('posts',p);
  function addPost(userId,body,img){
    const p={id:'f_'+Date.now(),userId,body,img:img||'',likes:[],comments:[],createdAt:Date.now()};
    const all=posts();all.unshift(p);savePosts(all);addAct(`${byId(userId)?.name||'?'} পোস্ট করেছেন`,'ti-edit');return p;
  }
  function toggleLike(postId,userId){
    const ps=posts(),p=ps.find(x=>x.id===postId);if(!p)return;
    const i=p.likes.indexOf(userId);if(i>-1)p.likes.splice(i,1);else p.likes.push(userId);savePosts(ps);
  }
  function addComment(postId,userId,text){
    const ps=posts(),p=ps.find(x=>x.id===postId);if(!p)return;
    p.comments.push({userId,text,ts:Date.now()});savePosts(ps);
  }
  function deletePost(id){savePosts(posts().filter(p=>p.id!==id));}

  const activity = () => g('activity')||[];
  function addAct(text,icon='ti-activity'){const a=activity();a.unshift({text,icon,ts:Date.now()});s('activity',a.slice(0,40));}
  const settings = () => g('settings')||{registration:true,fileSharing:true,maintenance:false};
  const saveSettings = v => s('settings',v);
  function stats(){const m=msgs();let tm=0;Object.values(m).forEach(c=>tm+=c.length);return{users:users().length,messages:tm,pages:pages().length,posts:posts().length,convs:Object.keys(m).length};}

  const fmtTime = ts=>{const d=new Date(ts);return d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0');};
  const fmtDate = ts=>new Date(ts).toLocaleDateString('bn-BD',{year:'numeric',month:'long',day:'numeric'});
  const fmtRel = ts=>{const d=Date.now()-ts;if(d<60000)return 'এইমাত্র';if(d<3600000)return Math.floor(d/60000)+' মিনিট';if(d<86400000)return Math.floor(d/3600000)+' ঘণ্টা';return fmtDate(ts);};
  const bn = n=>String(n).replace(/[0-9]/g,d=>'০১২৩৪৫৬৭৮৯'[d]);
  const esc = t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const fsize = b=>{if(!b)return '';if(b<1024)return b+'B';if(b<1048576)return Math.round(b/1024)+'KB';return (b/1048576).toFixed(1)+'MB';};

  return {seed,g,s,d,convKey,users,saveUsers,byId,byEmail,byUsername,others,addUser,removeUser,me,setMe,clearMe,msgs,getConv,sendMsg,markRead,deleteConv,unreadFor,convUnread,lastMsg,allConvs,pages,savePages,addPage,deletePage,viewPage,posts,addPost,toggleLike,addComment,deletePost,activity,addAct,settings,saveSettings,stats,fmtTime,fmtDate,fmtRel,bn,esc,fsize,COLORS};
})();

/* ══════════════ TOAST ══════════════ */
const T = {
  show(msg,type='info',ms=3400){
    const ic={success:'ti-circle-check',error:'ti-alert-circle',info:'ti-info-circle'};
    const el=document.createElement('div');el.className=`toast ${type}`;
    el.innerHTML=`<i class="ti ${ic[type]||ic.info}"></i><span>${msg}</span>`;
    document.getElementById('toasts').appendChild(el);
    setTimeout(()=>{el.style.animation='toastOut .28s ease forwards';setTimeout(()=>el.remove(),300);},ms);
  },
  ok:(m,ms)=>T.show(m,'success',ms),
  err:(m,ms)=>T.show(m,'error',ms),
  info:(m,ms)=>T.show(m,'info',ms),
};

/* ══════════════ AUTH ══════════════ */
const A = {
  login(){
    const id=q('liUser').value.trim(),pw=q('liPass').value;
    const err=q('liErr'); err.textContent='';
    if(!id||!pw){err.textContent='সব তথ্য পূরণ করুন।';return;}
    const u=DB.users().find(x=>(x.email===id||x.username===id)&&x.password===pw);
    if(!u){err.textContent='ইমেইল বা পাসওয়ার্ড সঠিক নয়।';return;}
    const btn=q('liBtn');btn.classList.add('loading');btn.querySelector('span').textContent='লগইন হচ্ছে...';
    setTimeout(()=>{DB.setMe(u);DB.addAct(`${u.name} লগইন`,'ti-login');App.launch(u);},500);
  },
  register(){
    const name=q('rgName').value.trim(),user=q('rgUser').value.trim().replace('@',''),
          email=q('rgEmail').value.trim(),pass=q('rgPass').value;
    const err=q('rgErr'),ok=q('rgOk');err.textContent='';ok.textContent='';
    if(!name||!user||!email||!pass){err.textContent='সব তথ্য পূরণ করুন।';return;}
    if(pass.length<6){err.textContent='পাসওয়ার্ড কমপক্ষে ৬ অক্ষর।';return;}
    if(!/^[a-z0-9_]+$/i.test(user)){err.textContent='ইউজারনেমে শুধু a-z, 0-9, _ ব্যবহার করুন।';return;}
    const res=DB.addUser(name,user,email,pass);
    if(res.err){err.textContent=res.err;return;}
    ok.textContent='অ্যাকাউন্ট তৈরি হয়েছে! লগইন করুন।';
    ['rgName','rgUser','rgEmail','rgPass'].forEach(id=>{q(id).value='';});
    setTimeout(()=>A.showLogin(),1600);
  },
  logout(){const me=DB.me();if(me)DB.addAct(`${me.name} লগআউট`,'ti-logout');DB.clearMe();App.showAuth();},
  showLogin(){q('regCard').classList.add('hidden');q('loginCard').classList.remove('hidden');},
  showReg(){q('loginCard').classList.add('hidden');q('regCard').classList.remove('hidden');},
  toggleEye(inputId,btn){const el=q(inputId);el.type=el.type==='password'?'text':'password';btn.querySelector('i').className=el.type==='password'?'ti ti-eye':'ti ti-eye-off';},
  checkPass(input){
    const v=input.value,fill=q('passFill');if(!v){fill.style.width='0%';return;}
    let str=0;if(v.length>=6)str++;if(v.length>=10)str++;if(/[A-Z]/.test(v)&&/[0-9]/.test(v))str++;
    const colors=['#ef4444','#f97316','#22c55e'];const pcts=['33%','66%','100%'];
    fill.style.width=pcts[str-1]||'15%';fill.style.background=colors[str-1]||'#ef4444';
  },
};

/* ══════════════ UI HELPER ══════════════ */
const U = {
  goto(view){
    qs('.view').forEach(v=>v.classList.remove('active'));qs('.nav-item').forEach(b=>b.classList.remove('active'));
    const el=q('v'+cap(view));if(el){el.classList.add('active');el.classList.add('vt');}
    const nb=q('ni-'+view);if(nb)nb.classList.add('active');
    U.closeNav();
    if(view==='pages')P.render();
    if(view==='prayer')PR.init();
    if(view==='members')M.render();
    if(view==='admin')AD.init();
    if(view==='feed')F.render();
    if(view==='chat')C.refreshContacts();
    U.updateDot();
  },
  toggleNav(){const n=q('leftNav'),o=q('navOverlay');n.classList.toggle('open');o.classList.toggle('hidden');},
  closeNav(){const n=q('leftNav'),o=q('navOverlay');n.classList.remove('open');o.classList.add('hidden');},
  openProfile(){
    const me=DB.me();if(!me)return;
    const myMsgs=Object.values(DB.msgs()).reduce((a,c)=>a+c.filter(m=>m.from===me.id).length,0);
    q('profileInner').innerHTML=`
      <div class="pm-av" style="background:${me.color}">${me.initials||me.name[0]}</div>
      <div class="pm-name">${DB.esc(me.name)} ${me.role==='admin'?'👑':''}</div>
      <div class="pm-user">@${me.username}</div>
      <div class="pm-email">${me.email}</div>
      <div class="pm-stats">
        <div><div class="pm-stat-n">${DB.bn(myMsgs)}</div><div class="pm-stat-l">বার্তা</div></div>
        <div><div class="pm-stat-n">${DB.bn(DB.others(me.id).length)}</div><div class="pm-stat-l">সদস্য</div></div>
        <div><div class="pm-stat-n">${DB.posts().filter(p=>p.userId===me.id).length}</div><div class="pm-stat-l">পোস্ট</div></div>
      </div>
      <button class="btn-logout" onclick="A.logout()"><i class="ti ti-logout"></i> লগ আউট</button>`;
    q('profileLayer').classList.remove('hidden');
  },
  closeProfile(){q('profileLayer').classList.add('hidden');},
  openNewChat(){
    const me=DB.me();if(!me)return;
    C._renderNCList(DB.others(me.id));
    q('newChatLayer').classList.remove('hidden');
    setTimeout(()=>q('ncSearch').focus(),80);
  },
  closeNewChat(){q('newChatLayer').classList.add('hidden');},
  openNewPage(){q('newPageLayer').classList.remove('hidden');setTimeout(()=>q('pgTitle').focus(),80);},
  closeNewPage(){q('newPageLayer').classList.add('hidden');['pgTitle','pgBody','pgCover'].forEach(id=>q(id).value='');},
  openNewPost(){
    const me=DB.me();if(!me)return;
    q('postAuthorRow').innerHTML=`<div style="width:36px;height:36px;border-radius:50%;background:${me.color};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0">${me.initials||me.name[0]}</div><div><div style="font-size:14px;font-weight:700">${DB.esc(me.name)}</div><div style="font-size:12px;color:var(--text2)">পোস্ট করুন</div></div>`;
    q('newPostLayer').classList.remove('hidden');
    setTimeout(()=>q('postBody').focus(),80);
  },
  closeNewPost(){q('newPostLayer').classList.add('hidden');q('postBody').value='';q('postImgPreview').innerHTML='';F._pendingImg=null;},
  openLightbox(src,cap){q('lightboxImg').src=src;q('lightboxCaption').textContent=cap||'';q('lightbox').classList.remove('hidden');},
  closeLightbox(){q('lightbox').classList.add('hidden');q('lightboxImg').src='';},
  updateDot(){const me=DB.me();if(!me)return;const n=DB.unreadFor(me.id);const dot=q('unreadDot');if(dot){if(n>0){dot.textContent=n>9?'9+':DB.bn(n);dot.classList.remove('hidden');}else dot.classList.add('hidden');}},
  setNavAv(user){const el=q('navAv');if(!el)return;el.textContent=user.initials||user.name[0];el.style.background=user.color;const mav=q('mobileAv');if(mav){mav.textContent=user.initials||user.name[0];mav.style.background=user.color;}},
};

/* ══════════════ CHAT ══════════════ */
const C = (() => {
  let cur=null,attOpen=false,emojiOpen=false,searchOpen=false,pendingAtt=null;
  const EMOJIS={
    islamic:['☪️','🕌','🕋','🤲','📿','🌙','⭐','🌟','✨','💚','🌿','🕊️','📖','🔆','🌄','بِسْمِ','ﷻ','🤍','🌹','💫'],
    common:['😊','😂','❤️','😍','😭','😅','🥺','😎','🤣','😆','👍','👏','🙌','💯','🔥','💪','🎉','🎊','✅','💡'],
    nature:['🌿','🍃','🌸','🌺','🌻','🌴','🏔️','🌊','☀️','🌈','🦋','🌱','🍀','🌾','🌵','🦚','🌍','🌅','🌄','❄️'],
  };
  let curTab='islamic';

  function init(){refreshContacts();buildEmoji('islamic');setInterval(U.updateDot,6000);}

  function refreshContacts(filter=''){
    const me=DB.me();if(!me)return;
    const sc=q('contactsScroll');sc.innerHTML='';
    let convs=DB.allConvs(me.id);
    if(filter)convs=convs.filter(c=>c.user.name.toLowerCase().includes(filter)||c.user.username.toLowerCase().includes(filter));
    if(!convs.length){sc.innerHTML=`<div class="contacts-empty-state"><i class="ti ti-message-off"></i><span>${filter?'কোনো ফলাফল নেই':'কোনো বার্তা নেই'}</span></div>`;return;}
    convs.forEach(({user,last,unread},i)=>{
      const el=document.createElement('div');el.className='contact-item'+(cur?.id===user.id?' active':'');el.id='ci_'+user.id;
      el.style.cssText=`animation:msgSlide .2s ease ${i*.04}s both`;
      let prev='বার্তা পাঠান...';
      if(last){const t=last.type;prev=t==='text'?DB.esc(last.text.substring(0,34))+(last.text.length>34?'...':''):t==='image'?'📷 ছবি':t==='video'?'🎥 ভিডিও':t==='pdf'?'📄 PDF':t==='audio'?'🎵 অডিও':'📎 ফাইল';}
      el.innerHTML=`<div class="ci-av" style="background:${user.color}">${user.initials||user.name[0]}<div class="ci-online"></div></div>
        <div class="ci-info"><div class="ci-name">${DB.esc(user.name)}${user.role==='admin'?'<span class="admin-chip">অ্যাডমিন</span>':''}</div><div class="ci-preview">${prev}</div></div>
        <div class="ci-right"><div class="ci-time">${last?DB.fmtRel(last.ts):''}</div>${unread?`<div class="ci-badge">${unread>9?'9+':DB.bn(unread)}</div>`:''}</div>`;
      el.onclick=()=>openConv(user);sc.appendChild(el);
    });
  }

  function filterContacts(){const v=q('cSearch').value;q('cClear').classList.toggle('hidden',!v);refreshContacts(v.toLowerCase());}
  function clearSearch(){q('cSearch').value='';q('cClear').classList.add('hidden');refreshContacts();}

  function _renderNCList(users){
    const list=q('ncList');list.innerHTML='';
    if(!users.length){list.innerHTML='<div style="text-align:center;color:var(--text2);padding:20px;font-size:14px">কোনো সদস্য পাওয়া যায়নি</div>';return;}
    users.forEach(u=>{
      const el=document.createElement('div');el.className='nc-item';
      el.innerHTML=`<div class="nc-item-av" style="background:${u.color}">${u.initials||u.name[0]}</div><div><div class="nc-item-name">${DB.esc(u.name)} ${u.role==='admin'?'👑':''}</div><div class="nc-item-sub">@${u.username}</div></div>`;
      el.onclick=()=>{U.closeNewChat();openConv(u);};list.appendChild(el);
    });
  }
  function filterNC(){const q2=q('ncSearch').value.toLowerCase();const me=DB.me();_renderNCList(DB.others(me.id).filter(u=>u.name.toLowerCase().includes(q2)||u.username.toLowerCase().includes(q2)));}

  function openConv(user){
    cur=user;
    /* Mobile: slide sidebar out */
    q('chatSidebar').classList.add('slide-out');
    q('chatEmpty').classList.add('hidden');
    const cv=q('chatConv');cv.classList.remove('hidden');cv.style.display='flex';
    /* Header */
    const av=q('convAv');av.style.background=user.color;av.style.color='#fff';av.style.borderRadius='50%';av.style.width='40px';av.style.height='40px';av.style.display='flex';av.style.alignItems='center';av.style.justifyContent='center';av.style.fontWeight='700';av.style.fontSize='15px';av.textContent=user.initials||user.name[0];
    q('convName').textContent=user.name+(user.role==='admin'?' 👑':'');
    qs('.contact-item').forEach(el=>el.classList.remove('active'));
    const ci=q('ci_'+user.id);if(ci)ci.classList.add('active');
    DB.markRead(DB.me().id,user.id);
    renderMsgs();U.updateDot();refreshContacts(q('cSearch').value.toLowerCase());
    setTimeout(()=>q('msgBox').focus(),120);
  }

  function closeConv(){
    cur=null;q('chatSidebar').classList.remove('slide-out');q('chatConv').classList.add('hidden');q('chatEmpty').classList.remove('hidden');
    qs('.contact-item').forEach(el=>el.classList.remove('active'));
    closeAtt();closeEmoji();closeSrch();removeAtt();
  }

  function renderMsgs(){
    if(!cur)return;
    const me=DB.me(),msgs=DB.getConv(me.id,cur.id),inner=q('msgsInner');
    inner.innerHTML=`<div class="msg-bismillah">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>`;
    if(!msgs.length){inner.innerHTML+=`<div style="text-align:center;color:var(--text2);font-size:14px;padding:24px">আস-সালামু আলাইকুম বলে শুরু করুন 🤝</div>`;return;}
    let lastD='',lastFrom='';
    msgs.forEach((m,idx)=>{
      const isOut=m.from===me.id;
      const sender=isOut?me:(DB.byId(m.from)||cur);
      const d=new Date(m.ts).toLocaleDateString('bn-BD');
      if(d!==lastD){const sep=document.createElement('div');sep.className='msg-date-sep';sep.innerHTML=`<div class="msg-date-pill">${d}</div>`;inner.appendChild(sep);lastD=d;lastFrom='';}
      const sameF=lastFrom===m.from;lastFrom=m.from;
      const row=document.createElement('div');
      row.className=`msg-row ${isOut?'out':'in'}${sameF?' hide-av':''}`;row.id='msg_'+m.id;
      const av=document.createElement('div');av.className='msg-mini-av';av.style.background=sender.color||'#1a56db';av.textContent=sender.initials||sender.name[0];
      const bWrap=document.createElement('div');bWrap.appendChild(buildBubble(m,isOut));
      row.appendChild(av);row.appendChild(bWrap);inner.appendChild(row);
    });
    const mc=q('messages');setTimeout(()=>{mc.scrollTop=mc.scrollHeight;},40);
  }

  function buildBubble(m,isOut){
    const w=document.createElement('div');
    const meta=`<div class="bubble-meta"><span class="btime">${DB.fmtTime(m.ts)}</span>${isOut?'<span class="btick"><i class="ti ti-checks"></i></span>':''}</div>`;
    if(m.type==='text'){
      w.className='bubble';w.innerHTML=linkify(DB.esc(m.text))+meta;
    } else if(m.type==='image'){
      w.className='bubble img-bubble';w.onclick=()=>{if(m.fileData)U.openLightbox(m.fileData,m.fileName);};
      if(m.fileData)w.innerHTML=`<img src="${m.fileData}" alt="${DB.esc(m.fileName||'ছবি')}" loading="lazy">`+meta;
      else w.innerHTML=`<div class="img-placeholder"><i class="ti ti-photo" style="font-size:36px"></i><span>${DB.esc(m.fileName||'ছবি')}</span></div>`+meta;
    } else if(m.type==='pdf'){
      w.className='bubble';
      w.innerHTML=`<div class="file-bubble" onclick="C.dlFile('${m.id}')"><div class="fb-icon" style="background:#b71c1c30"><i class="ti ti-file-type-pdf" style="color:#ef9a9a;font-size:22px"></i></div><div class="fb-info"><div class="fb-name">${DB.esc(m.fileName||'doc.pdf')}</div><div class="fb-meta">PDF · ${DB.fsize(m.fileSize)}</div></div><i class="ti ti-download fb-dl"></i></div>`+meta;
    } else if(m.type==='video'){
      w.className='bubble';
      w.innerHTML=`<div class="file-bubble" onclick="C.playVid('${m.id}')"><div class="fb-icon" style="background:#1a237e30"><i class="ti ti-video" style="color:#9fa8da;font-size:22px"></i></div><div class="fb-info"><div class="fb-name">${DB.esc(m.fileName||'video.mp4')}</div><div class="fb-meta">ভিডিও · ${DB.fsize(m.fileSize)}</div></div><i class="ti ti-player-play fb-dl"></i></div>`+meta;
    } else if(m.type==='audio'){
      w.className='bubble';
      const bars=Array.from({length:8},(_,i)=>`<div class="wv-bar" style="height:${5+Math.floor(Math.random()*14)}px;animation-delay:${i*.1}s"></div>`).join('');
      w.innerHTML=`<div class="audio-bubble"><button class="audio-play" onclick="C.playAudio('${m.id}')"><i class="ti ti-player-play"></i></button><div class="audio-waveform">${bars}</div><span style="font-size:11px;opacity:.6">${DB.fsize(m.fileSize)||''}</span></div>`+meta;
    } else {
      w.className='bubble';
      w.innerHTML=`<div class="file-bubble" onclick="C.dlFile('${m.id}')"><div class="fb-icon" style="background:#e6510030"><i class="ti ti-file" style="color:#ffb74d;font-size:22px"></i></div><div class="fb-info"><div class="fb-name">${DB.esc(m.fileName||'ফাইল')}</div><div class="fb-meta">${DB.fsize(m.fileSize)||'ফাইল'}</div></div><i class="ti ti-download fb-dl"></i></div>`+meta;
    }
    return w;
  }

  function linkify(t){return t.replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener" style="color:var(--gold2);text-decoration:underline">$1</a>');}

  function send(){
    const me=DB.me();if(!me||!cur)return;
    if(pendingAtt){_sendAtt();return;}
    const box=q('msgBox'),txt=box.value.trim();if(!txt)return;
    DB.sendMsg(me.id,cur.id,{type:'text',text:txt});
    box.value='';box.style.height='auto';
    const sb=q('sendBtn');sb.style.transform='scale(1.3)';setTimeout(()=>sb.style.transform='',150);
    renderMsgs();refreshContacts(q('cSearch').value.toLowerCase());U.updateDot();
  }

  function _sendAtt(){
    const me=DB.me();if(!me||!cur||!pendingAtt)return;
    const txt=q('msgBox').value.trim();
    const content={...pendingAtt};if(txt)content.text=txt;
    DB.sendMsg(me.id,cur.id,content);
    q('msgBox').value='';removeAtt();renderMsgs();refreshContacts();U.updateDot();
  }

  function onKey(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}
  function grow(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,120)+'px';}
  function onScroll(){/* future: load more */}

  function pickFile(type){
    closeAtt();
    const ids={image:'fi-image',video:'fi-video',pdf:'fi-pdf',audio:'fi-audio',file:'fi-file'};
    q(ids[type])?.click();
  }
  function gotFile(input,type){
    const file=input.files[0];if(!file)return;input.value='';
    if(file.size>12*1024*1024){T.err('ফাইল ১২MB এর বেশি হতে পারবে না।');return;}
    const reader=new FileReader();
    reader.onload=e=>{
      pendingAtt={type,fileName:file.name,fileSize:file.size,mimeType:file.type,fileData:e.target.result};
      showAttPreview(type,file.name,type==='image'?e.target.result:null);
      T.info(`"${file.name}" যোগ করা হয়েছে`);
    };
    reader.readAsDataURL(file);
  }
  function showAttPreview(type,name,imgSrc){
    const icons={image:'ti-photo',video:'ti-video',pdf:'ti-file-type-pdf',audio:'ti-microphone',file:'ti-file'};
    const ap=q('attPreview'),apc=q('attPreviewContent');
    if(imgSrc)apc.innerHTML=`<img class="att-prev-img" src="${imgSrc}" alt=""><div><strong>${DB.esc(name)}</strong></div>`;
    else apc.innerHTML=`<i class="ti ${icons[type]||'ti-file'}" style="font-size:22px;color:var(--gold2)"></i><div><strong>${DB.esc(name)}</strong><div style="font-size:11px;color:var(--text2)">${type.toUpperCase()}</div></div>`;
    ap.classList.remove('hidden');
    q('msgBox').placeholder='ক্যাপশন যোগ করুন (ঐচ্ছিক)...';
  }
  function removeAtt(){pendingAtt=null;q('attPreview').classList.add('hidden');q('attPreviewContent').innerHTML='';q('msgBox').placeholder='বার্তা লিখুন... (সালামের মাধ্যমে শুরু করুন ☪️)';}
  function toggleAtt(){attOpen=!attOpen;q('attPopup').classList.toggle('hidden',!attOpen);q('attToggle').classList.toggle('active',attOpen);if(attOpen){closeEmoji();}}
  function closeAtt(){attOpen=false;q('attPopup')?.classList.add('hidden');q('attToggle')?.classList.remove('active');}
  function buildEmoji(tab){const grid=q('emojiGrid');if(!grid)return;grid.innerHTML=(EMOJIS[tab]||EMOJIS.common).map(e=>`<button class="emj" onclick="C.insertEmoji('${e}')">${e}</button>`).join('');}
  function emojiTab(tab,btn){curTab=tab;qs('.emoji-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');buildEmoji(tab);}
  function toggleEmoji(){emojiOpen=!emojiOpen;q('emojiPanel').classList.toggle('hidden',!emojiOpen);if(emojiOpen)closeAtt();}
  function closeEmoji(){emojiOpen=false;q('emojiPanel')?.classList.add('hidden');}
  function insertEmoji(e){const box=q('msgBox');const p=box.selectionStart;box.value=box.value.slice(0,p)+e+box.value.slice(p);box.selectionStart=box.selectionEnd=p+e.length;box.focus();}
  function toggleSearch(){searchOpen=!searchOpen;q('msgSearchBar').classList.toggle('hidden',!searchOpen);if(searchOpen)setTimeout(()=>q('msgSearchIn').focus(),80);}
  function closeSrch(){searchOpen=false;q('msgSearchBar')?.classList.add('hidden');if(q('msgSearchIn'))q('msgSearchIn').value='';qs('.msg-row').forEach(r=>r.classList.remove('search-hl'));}
  function searchMsgs(){
    const qv=q('msgSearchIn').value.trim().toLowerCase();
    qs('.msg-row').forEach(r=>{r.classList.remove('search-hl');if(qv&&r.textContent.toLowerCase().includes(qv))r.classList.add('search-hl');});
    const first=document.querySelector('.search-hl');if(first)first.scrollIntoView({behavior:'smooth',block:'center'});
  }
  function clearConv(){
    if(!cur)return;if(!confirm(`"${cur.name}"-এর সব বার্তা মুছে ফেলবেন?`))return;
    DB.deleteConv(DB.me().id,cur.id);renderMsgs();refreshContacts();T.ok('কথোপকথন মুছে ফেলা হয়েছে।');
  }
  function dlFile(msgId){
    const me=DB.me();if(!me||!cur)return;
    const m=DB.getConv(me.id,cur.id).find(x=>x.id===msgId);
    if(!m?.fileData){T.info('ফাইলটি সংরক্ষিত নেই');return;}
    const a=document.createElement('a');a.href=m.fileData;a.download=m.fileName||'file';a.click();
  }
  function playVid(msgId){
    const me=DB.me();if(!me||!cur)return;
    const m=DB.getConv(me.id,cur.id).find(x=>x.id===msgId);
    if(!m?.fileData){T.info('ভিডিওটি সংরক্ষিত নেই');return;}
    const overlay=document.createElement('div');overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:1000;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px';
    const vid=document.createElement('video');vid.src=m.fileData;vid.controls=true;vid.style.cssText='max-width:90vw;max-height:85vh;border-radius:12px';
    const closeBtn=document.createElement('button');closeBtn.innerHTML='<i class="ti ti-x"></i>';closeBtn.style.cssText='position:absolute;top:14px;right:14px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.12);border:none;color:#fff;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center';closeBtn.onclick=()=>overlay.remove();overlay.append(vid,closeBtn);document.body.appendChild(overlay);vid.play();
  }
  function playAudio(msgId){
    const me=DB.me();if(!me||!cur)return;
    const m=DB.getConv(me.id,cur.id).find(x=>x.id===msgId);
    if(!m?.fileData){T.info('অডিওটি সংরক্ষিত নেই');return;}
    new Audio(m.fileData).play();T.info(`▶ ${m.fileName||'অডিও'}`);
  }

  return {init,refreshContacts,filterContacts,clearSearch,_renderNCList,filterNC,openConv,closeConv,renderMsgs,send,onKey,grow,onScroll,pickFile,gotFile,removeAtt,toggleAtt,closeAtt,emojiTab,toggleEmoji,closeEmoji,insertEmoji,toggleSearch,closeSrch,searchMsgs,clearConv,dlFile,playVid,playAudio};
})();

/* ══════════════ FEED ══════════════ */
const F = (() => {
  let _pendingImg=null;
  function render(){
    const me=DB.me(),ps=DB.posts(),list=q('feedList');
    list.innerHTML='';
    if(!ps.length){list.innerHTML='<div class="feed-empty"><i class="ti ti-mood-empty" style="font-size:48px;display:block;margin-bottom:8px;opacity:.4"></i><p>কোনো পোস্ট নেই। প্রথম পোস্টটি আপনি করুন!</p></div>';return;}
    ps.forEach((p,i)=>{
      const user=DB.byId(p.userId)||{name:'?',initials:'?',color:'#1a56db'};
      const liked=p.likes.includes(me?.id);
      const card=document.createElement('div');card.className='feed-card';card.style.cssText=`animation:fadeSlide .25s ease ${i*.05}s both`;
      card.innerHTML=`<div class="feed-card-head"><div class="feed-card-av" style="background:${user.color}">${user.initials||user.name[0]}</div><div class="feed-card-meta"><div class="fn">${DB.esc(user.name)} ${user.role==='admin'?'👑':''}</div><div class="ft">${DB.fmtRel(p.createdAt)}</div></div></div>
        ${p.body?`<div class="feed-card-body">${DB.esc(p.body)}</div>`:''}
        ${p.img?`<div class="feed-card-img"><img src="${p.img}" onclick="U.openLightbox(this.src,'ছবি')" loading="lazy"></div>`:''}
        <div class="feed-card-actions">
          <button class="feed-action-btn${liked?' liked':''}" onclick="F.like('${p.id}',this)"><i class="ti ti-heart${liked?'-filled':''}"></i> ${DB.bn(p.likes.length)}</button>
          <button class="feed-action-btn" onclick="F.showComments('${p.id}')"><i class="ti ti-message-2"></i> ${DB.bn(p.comments.length)}</button>
          ${(me?.id===p.userId||me?.role==='admin')?`<button class="feed-action-btn" style="margin-left:auto;color:var(--red)" onclick="F.del('${p.id}')"><i class="ti ti-trash"></i></button>`:''}
        </div>
        ${p.comments.length?`<div class="feed-comments" id="fc_${p.id}" style="display:none;padding:0 14px 12px;border-top:1px solid var(--border)">${p.comments.slice(-3).map(c=>{const cu=DB.byId(c.userId)||{name:'?',initials:'?',color:'#1a56db'};return `<div style="display:flex;gap:7px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--border)"><div style="width:26px;height:26px;border-radius:50%;background:${cu.color};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0">${cu.initials||cu.name[0]}</div><div><div style="font-size:13px;font-weight:600">${DB.esc(cu.name)}</div><div style="font-size:13px;color:var(--text1)">${DB.esc(c.text)}</div></div></div>`;}).join('')}
          <div style="display:flex;gap:7px;margin-top:8px"><input type="text" placeholder="মন্তব্য লিখুন..." style="flex:1;background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:7px 11px;color:var(--text0);font-size:13px;outline:none;font-family:inherit" onkeydown="if(event.key==='Enter')F.addCmt('${p.id}',this)"><button onclick="F.addCmt('${p.id}',this.previousElementSibling)" style="padding:7px 13px;background:var(--blue);border:none;border-radius:8px;color:#fff;font-size:13px;cursor:pointer">পাঠান</button></div>
        </div>`:''}`;
      list.appendChild(card);
    });
  }
  function like(postId,btn){const me=DB.me();if(!me)return;DB.toggleLike(postId,me.id);render();}
  function showComments(postId){const el=q('fc_'+postId);if(el)el.style.display=el.style.display==='none'?'block':'none';}
  function addCmt(postId,input){const me=DB.me();if(!me||!input.value.trim())return;DB.addComment(postId,me.id,input.value.trim());input.value='';render();}
  function del(postId){if(!confirm('পোস্টটি মুছে ফেলবেন?'))return;DB.deletePost(postId);render();T.ok('পোস্ট মুছে ফেলা হয়েছে।');}
  function publish(){const me=DB.me();if(!me)return;const b=q('postBody').value.trim();if(!b&&!_pendingImg){T.err('পোস্টের বিষয়বস্তু দিন।');return;}DB.addPost(me.id,b,_pendingImg||'');U.closeNewPost();_pendingImg=null;U.goto('feed');T.ok('পোস্ট প্রকাশিত হয়েছে!');}
  function pickPostImg(){q('postImgInput').click();}
  function postImgSelected(input){const file=input.files[0];if(!file)return;if(file.size>5*1024*1024){T.err('ছবি ৫MB এর বেশি হতে পারবে না।');return;}const reader=new FileReader();reader.onload=e=>{_pendingImg=e.target.result;q('postImgPreview').innerHTML=`<img src="${e.target.result}" style="max-height:160px;border-radius:8px;margin-top:6px">`;};reader.readAsDataURL(file);input.value='';}
  return {render,like,showComments,addCmt,del,publish,pickPostImg,postImgSelected,get _pendingImg(){return _pendingImg;},set _pendingImg(v){_pendingImg=v;}};
})();

/* ══════════════ PAGES ══════════════ */
const P = (() => {
  let filterQ='';
  function render(){
    q('articleView').classList.add('hidden');
    q('pagesListView').style.display='';
    const ps=DB.pages();const filtered=filterQ?ps.filter(p=>p.title.toLowerCase().includes(filterQ)||p.body.toLowerCase().includes(filterQ)):ps;
    const grid=q('pagesGrid');grid.innerHTML='';
    if(!filtered.length){grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text2)"><i class="ti ti-books" style="font-size:48px;display:block;margin-bottom:8px;opacity:.3"></i><p>${filterQ?'কোনো ফলাফল নেই':'কোনো পেজ নেই। অ্যাডমিন প্যানেল থেকে তৈরি করুন।'}</p></div>`;return;}
    filtered.forEach((p,i)=>{
      const card=document.createElement('div');card.className='page-card';card.style.cssText=`animation:fadeSlide .25s ease ${i*.06}s both`;
      card.innerHTML=`<div class="page-card-cover">${p.cover?`<img src="${p.cover}" loading="lazy">`:`<div class="page-card-cover-placeholder">${{শিক্ষা:'📖',ইসলাম:'☪️',ঘোষণা:'📢',কুরআন:'📿',হাদিস:'🌙'}[p.tag]||'📄'}</div>`}</div>
        <div class="page-card-body"><div class="page-cat">${DB.esc(p.tag||'সাধারণ')}</div><div class="page-card-title">${DB.esc(p.title)}</div><div class="page-card-excerpt">${DB.esc(p.body.substring(0,100))}...</div>
        <div class="page-card-foot"><span>${DB.esc(p.author)} · ${DB.fmtDate(p.createdAt)}</span><div class="page-views-count"><i class="ti ti-eye" style="font-size:13px"></i> ${DB.bn(p.views||0)}</div></div></div>`;
      card.onclick=()=>openArticle(p.id);grid.appendChild(card);
    });
  }
  function filter(){filterQ=q('pgSearch').value.toLowerCase();render();}
  function openArticle(id){
    const p=DB.pages().find(x=>x.id===id);if(!p)return;DB.viewPage(id);
    q('pagesListView').style.display='none';
    const av=q('articleView');av.classList.remove('hidden');
    q('articleBody').innerHTML=`${p.cover?`<img src="${p.cover}" style="width:100%;max-height:300px;object-fit:cover;border-radius:var(--r-xl);margin-bottom:20px" loading="lazy">`:''}
      <div class="page-cat">${DB.esc(p.tag||'সাধারণ')}</div>
      <h1>${DB.esc(p.title)}</h1>
      <div class="article-meta"><i class="ti ti-user"></i>${DB.esc(p.author)}<i class="ti ti-calendar"></i>${DB.fmtDate(p.createdAt)}<i class="ti ti-eye"></i>${DB.bn((p.views||0)+1)} বার পড়া হয়েছে</div>
      <div class="article-text">${DB.esc(p.body)}</div>`;
    av.scrollTop=0;
  }
  function closeArticle(){q('articleView').classList.add('hidden');q('pagesListView').style.display='';render();}
  function create(){
    const title=q('pgTitle').value.trim(),body=q('pgBody').value.trim(),tag=q('pgTag').value,cover=q('pgCover').value.trim();
    if(!title||!body){T.err('শিরোনাম ও বিষয়বস্তু আবশ্যক।');return;}
    const me=DB.me();DB.addPage(title,body,tag,cover,me.id);
    U.closeNewPage();render();T.ok('পেজ প্রকাশিত হয়েছে!');
  }
  return {render,filter,openArticle,closeArticle,create};
})();

/* ══════════════ PRAYER ══════════════ */
const PR = (() => {
  const TIMES=[{n:'ফজর',i:'ti-sunrise',t:'4:52',iq:'৫:১২'},{n:'সূর্যোদয়',i:'ti-sun',t:'6:18',iq:null},{n:'যোহর',i:'ti-sun-high',t:'12:05',iq:'১২:৩০'},{n:'আসর',i:'ti-sun-low',t:'15:48',iq:'৪:১৫'},{n:'মাগরিব',i:'ti-sunset',t:'18:30',iq:'৬:৩৮'},{n:'ইশা',i:'ti-moon-stars',t:'19:50',iq:'৮:২০'}];
  const DHIKRS=['সুবহানাল্লাহ','আলহামদুলিল্লাহ','আল্লাহু আকবার','লা ইলাহা ইল্লাল্লাহ','আস্তাগফিরুল্লাহ','সুবহানাল্লাহি ওয়া বিহামদিহী'];
  let cnt=0,dIdx=0,cdInterval=null;

  function init(){
    renderDate();renderHero();renderGrid();renderDhikr();startCD();animCompass();
  }
  function renderDate(){const el=q('prayerDateStr');if(el)el.textContent=new Date().toLocaleDateString('bn-BD',{weekday:'long',year:'numeric',month:'long',day:'numeric'});}
  function _nextPrayer(){const now=new Date(),nm=now.getHours()*60+now.getMinutes();return TIMES.find(p=>p.iq&&toMins(p.t)>nm)||TIMES[0];}
  function toMins(t){const[h,m]=t.split(':').map(Number);return h*60+m;}
  function renderHero(){
    const np=_nextPrayer(),el=q('nextPrayerHero');if(!el)return;
    el.innerHTML=`<div class="nph-label">পরবর্তী নামাজ</div><div class="nph-name">${np.n}</div><div class="nph-time">${np.t}</div><div class="nph-cd" id="nphCD">হিসাব হচ্ছে...</div>`;
  }
  function startCD(){if(cdInterval)clearInterval(cdInterval);const upd=()=>{const np=_nextPrayer(),el=q('nphCD');if(!el)return;const now=new Date(),nm=now.getHours()*60+now.getMinutes();let diff=toMins(np.t)-nm;if(diff<0)diff+=1440;const h=Math.floor(diff/60),m=diff%60;el.textContent=`${h>0?DB.bn(h)+' ঘণ্টা ':''} ${DB.bn(m)} মিনিট পরে`;};upd();cdInterval=setInterval(upd,30000);}
  function renderGrid(){
    const el=q('prayerGrid');if(!el)return;const now=new Date(),nm=now.getHours()*60+now.getMinutes();
    el.innerHTML=TIMES.map(p=>{const pm=toMins(p.t),isCur=p.iq&&Math.abs(pm-nm)<30,isPast=pm<nm;
      return `<div class="pt-row${isCur?' now':''}" style="${isPast&&!isCur?'opacity:.5':''}">
        <div class="pt-name"><i class="ti ${p.i}"></i> ${p.n}${isCur?'<span style="font-size:11px;background:var(--gold2);color:#000;padding:2px 7px;border-radius:100px;font-weight:700;margin-left:8px">এখন</span>':''}</div>
        <div><div class="pt-time-val">${p.t}</div>${p.iq?`<div class="pt-iqama">ইকামাহ ${p.iq}</div>`:''}</div>
      </div>`;}).join('');
  }
  function animCompass(){const el=q('cArrow');if(el)el.style.transform='rotate(278deg)';}
  function renderDhikr(){const ne=q('dhikrNum'),we=q('dhikrWord'),fe=q('dhikrFill');if(ne)ne.textContent=DB.bn(cnt);if(we)we.textContent=DHIKRS[dIdx];if(fe)fe.style.width=((cnt%33)/33*100)+'%';}
  function tap(){cnt++;renderDhikr();const ne=q('dhikrNum');if(ne){ne.classList.remove('pop');void ne.offsetWidth;ne.classList.add('pop');}if(cnt%33===0)T.ok(`${DB.bn(cnt)} বার! সুবহানাল্লাহ 🌟`);const btn=document.querySelector('.dhikr-tap');if(btn){btn.style.transform='scale(.88)';setTimeout(()=>btn.style.transform='',120);}}
  function nextDhikr(){dIdx=(dIdx+1)%DHIKRS.length;cnt=0;renderDhikr();T.info(DHIKRS[dIdx]);}
  function prevDhikr(){dIdx=(dIdx-1+DHIKRS.length)%DHIKRS.length;cnt=0;renderDhikr();T.info(DHIKRS[dIdx]);}
  function reset(){cnt=0;renderDhikr();}
  return {init,tap,nextDhikr,prevDhikr,reset};
})();

/* ══════════════ MEMBERS ══════════════ */
const M = (() => {
  let filterQ='';
  function render(){
    const me=DB.me();const users=DB.users();
    const filtered=filterQ?users.filter(u=>u.name.toLowerCase().includes(filterQ)||u.username.toLowerCase().includes(filterQ)):users;
    const grid=q('membersGrid');grid.innerHTML='';
    filtered.forEach((u,i)=>{
      const isSelf=u.id===me?.id;
      const card=document.createElement('div');card.className='member-card';card.style.cssText=`animation:fadeSlide .22s ease ${i*.05}s both`;
      card.innerHTML=`<div class="mem-av" style="background:${u.color}">${u.initials||u.name[0]}</div>
        <div class="mem-name">${DB.esc(u.name)} ${u.role==='admin'?'👑':''}</div>
        <div class="mem-username">@${u.username}</div>
        <div class="mem-bio">${DB.esc(u.bio||'')}</div>
        ${isSelf?`<div class="mem-self-badge">আপনি</div>`:u.role!=='admin'||me?.role==='admin'?`<button class="mem-msg-btn" onclick="M.msgUser('${u.id}')"><i class="ti ti-message-2"></i> বার্তা পাঠান</button>`:''}`;
      grid.appendChild(card);
    });
  }
  function filter(){filterQ=q('memSearch').value.toLowerCase();render();}
  function msgUser(userId){const u=DB.byId(userId);if(!u)return;U.goto('chat');setTimeout(()=>C.openConv(u),80);}
  return {render,filter,msgUser};
})();

/* ══════════════ ADMIN ══════════════ */
const AD = (() => {
  function init(){renderTab('dash',null);}
  function tab(name,btn){qs('.atab').forEach(b=>b.classList.remove('active'));if(btn)btn.classList.add('active');else{const b=document.querySelector(`.atab[onclick="AD.tab('${name}',this)"]`);if(b)b.classList.add('active');}renderTab(name);}
  function renderTab(name){const body=q('adminBody');body.innerHTML='';
    if(name==='dash')body.appendChild(renderDash());
    else if(name==='pages')body.appendChild(renderPages());
    else if(name==='users')body.appendChild(renderUsers());
    else if(name==='msgs')body.appendChild(renderMsgs());
    else if(name==='settings')body.appendChild(renderSettings());
  }

  function renderDash(){
    const st=DB.stats(),acts=DB.activity(),div=document.createElement('div');
    div.innerHTML=`<div class="stat-cards-grid">
      ${[{l:'মোট সদস্য',n:st.users,i:'ti-users',c:'#1a56db'},{l:'মোট বার্তা',n:st.messages,i:'ti-message',c:'#059669'},{l:'পেজ',n:st.pages,i:'ti-file-text',c:'#d97706'},{l:'পোস্ট',n:st.posts,i:'ti-edit',c:'#7c3aed'},{l:'কথোপকথন',n:st.convs,i:'ti-message-dots',c:'#be185d'}].map(s=>`<div class="admin-stat"><div class="admin-stat-ico" style="color:${s.c}"><i class="ti ${s.i}"></i></div><div class="admin-stat-n">${DB.bn(s.n)}</div><div class="admin-stat-l">${s.l}</div></div>`).join('')}
    </div>
    <div class="admin-form-box"><h3><i class="ti ti-activity"></i> সাম্প্রতিক কার্যক্রম</h3>
      ${acts.slice(0,15).map(a=>`<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--text1)"><i class="ti ${a.icon||'ti-activity'}" style="color:var(--text2);font-size:15px;flex-shrink:0"></i><span style="flex:1">${DB.esc(a.text)}</span><span style="font-size:11px;color:var(--text3);white-space:nowrap">${DB.fmtRel(a.ts)}</span></div>`).join('')}
    </div>`;
    return div;
  }

  function renderPages(){
    const ps=DB.pages(),div=document.createElement('div');
    div.innerHTML=`<div class="admin-form-box"><h3><i class="ti ti-plus"></i> নতুন পেজ তৈরি করুন</h3>
      <button class="btn-glow" onclick="U.openNewPage()"><i class="ti ti-file-plus"></i> পেজ তৈরির ফর্ম খুলুন</button>
    </div>
    <div class="admin-form-box"><h3><i class="ti ti-list"></i> সকল পেজ (${DB.bn(ps.length)}টি)</h3>
      ${ps.length?ps.map(p=>`<div class="admin-page-row">
        <div class="apr-info"><div class="apr-title">${DB.esc(p.title)}</div><div class="apr-meta">${p.author} · ${DB.fmtDate(p.createdAt)} · <i class="ti ti-eye" style="font-size:12px"></i> ${DB.bn(p.views||0)}</div></div>
        <div class="apr-actions">
          <button class="btn-sm-p" onclick="P.openArticle('${p.id}');U.goto('pages')"><i class="ti ti-eye"></i></button>
          <button class="btn-sm-d" onclick="AD.deletePage('${p.id}')"><i class="ti ti-trash"></i></button>
        </div>
      </div>`).join(''):'<p style="color:var(--text2);font-size:14px">কোনো পেজ নেই।</p>'}
    </div>`;
    return div;
  }
  function deletePage(id){if(!confirm('পেজটি মুছে ফেলবেন?'))return;DB.deletePage(id);tab('pages',null);T.ok('পেজ মুছে ফেলা হয়েছে।');}

  function renderUsers(){
    const users=DB.users(),me=DB.me(),div=document.createElement('div');
    div.innerHTML=`<div class="admin-form-box"><h3><i class="ti ti-users"></i> সকল সদস্য (${DB.bn(users.length)}জন)</h3>
      <div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>সদস্য</th><th>ইউজারনেম</th><th>ইমেইল</th><th>ভূমিকা</th><th>যোগদান</th><th></th></tr></thead>
      <tbody>${users.map(u=>`<tr>
        <td><div class="user-cell-row"><div class="user-cell-av" style="background:${u.color}">${u.initials||u.name[0]}</div>${DB.esc(u.name)}</div></td>
        <td style="color:var(--gold2)">@${u.username}</td>
        <td style="font-size:12px">${u.email}</td>
        <td>${u.role==='admin'?'<span class="rbadge-admin">অ্যাডমিন</span>':'<span class="rbadge-user">সদস্য</span>'}</td>
        <td style="font-size:12px">${DB.fmtDate(u.createdAt||Date.now())}</td>
        <td>${u.id!==me?.id&&u.role!=='admin'?`<button class="btn-sm-d" onclick="AD.deleteUser('${u.id}')"><i class="ti ti-user-minus"></i></button>`:'—'}</td>
      </tr>`).join('')}</tbody></table></div></div>`;
    return div;
  }
  function deleteUser(id){const u=DB.byId(id);if(!u)return;if(!confirm(`"${u.name}" কে সরিয়ে দেবেন?`))return;DB.removeUser(id);tab('users',null);T.ok(`${u.name} সরানো হয়েছে।`);}

  function renderMsgs(){
    const ms=DB.msgs(),div=document.createElement('div');
    const entries=Object.entries(ms).filter(([,c])=>c.length).sort(([,a],[,b])=>b[b.length-1].ts-a[a.length-1].ts);
    div.innerHTML=`<div class="admin-form-box"><h3><i class="ti ti-messages"></i> সব কথোপকথন (${DB.bn(entries.length)}টি)</h3>
      ${entries.length?entries.map(([key,conv])=>{const [id1,id2]=key.split('::');const u1=DB.byId(id1)||{name:'মুছে ফেলা',initials:'?',color:'#666'};const u2=DB.byId(id2)||{name:'মুছে ফেলা',initials:'?',color:'#666'};const last=conv[conv.length-1];
        return `<div class="admin-msg-row">
          <div class="amr-head"><div class="amr-from">
            <span style="color:${u1.color}">${DB.esc(u1.name)}</span> ↔ <span style="color:${u2.color}">${DB.esc(u2.name)}</span>
            <span style="font-size:11px;color:var(--text3);margin-left:6px">(${DB.bn(conv.length)}টি বার্তা)</span>
          </div><div class="amr-time">${DB.fmtRel(last.ts)}</div></div>
          <div class="amr-text">${last.type==='text'?DB.esc(last.text.substring(0,80)):'📎 '+last.type}</div>
          <div class="amr-foot"><button class="btn-sm-d" onclick="AD.deleteConv('${id1}','${id2}')"><i class="ti ti-trash"></i> মুছুন</button></div>
        </div>`;}).join(''):'<p style="color:var(--text2)">কোনো বার্তা নেই।</p>'}
    </div>`;
    return div;
  }
  function deleteConv(id1,id2){if(!confirm('এই কথোপকথনটি মুছে ফেলবেন?'))return;DB.deleteConv(id1,id2);tab('msgs',null);T.ok('মুছে ফেলা হয়েছে।');}

  function renderSettings(){
    const st=DB.settings(),div=document.createElement('div');
    div.innerHTML=`<div class="admin-form-box"><h3><i class="ti ti-settings"></i> সাইট সেটিংস</h3>
      ${[{k:'registration',l:'নতুন নিবন্ধন',s:'নতুন অ্যাকাউন্ট তৈরির অনুমতি'},{k:'fileSharing',l:'ফাইল শেয়ারিং',s:'ছবি, ভিডিও, PDF পাঠানোর অনুমতি'},{k:'maintenance',l:'রক্ষণাবেক্ষণ মোড',s:'শুধুমাত্র অ্যাডমিন প্রবেশ করতে পারবেন'}].map(item=>`
        <div class="toggle-row">
          <div class="toggle-info"><div class="t-label">${item.l}</div><div class="t-sub">${item.s}</div></div>
          <div class="toggle-sw${st[item.k]?' on':''}" onclick="AD.toggle('${item.k}',this)"></div>
        </div>`).join('')}
    </div>
    <div class="danger-zone"><h4><i class="ti ti-alert-triangle"></i> বিপদজনক এলাকা</h4>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn-sm-d" onclick="AD.clearActs()"><i class="ti ti-trash"></i> কার্যক্রম লগ মুছুন</button>
        <button class="btn-sm-d" onclick="AD.fullReset()"><i class="ti ti-refresh"></i> সব ডেটা রিসেট</button>
      </div>
    </div>`;
    return div;
  }
  function toggle(key,el){const st=DB.settings();st[key]=!st[key];DB.saveSettings(st);el.classList.toggle('on',st[key]);T.info(`${key}: ${st[key]?'চালু':'বন্ধ'}`);}
  function clearActs(){if(!confirm('কার্যক্রম লগ মুছে ফেলবেন?'))return;DB.s('activity',[]);DB.addAct('লগ মুছে ফেলা হয়েছে','ti-trash');tab('settings',null);T.ok('লগ মুছে ফেলা হয়েছে।');}
  function fullReset(){if(!confirm('সব ডেটা মুছে রিসেট করবেন? আপনি লগআউট হবেন।'))return;['seeded','users','messages','pages','posts','activity','settings','me'].forEach(k=>DB.d(k));A.logout();T.info('রিসেট সম্পন্ন। পুনরায় লগইন করুন।');}
  return {init,tab,deletePage,deleteUser,deleteConv,toggle,clearActs,fullReset};
})();

/* ══════════════ APP BOOTSTRAP ══════════════ */
const App = {
  launch(user){
    q('authScreen').classList.add('hidden');q('appScreen').classList.remove('hidden');
    U.setNavAv(user);
    /* Show/hide admin gated items */
    qs('.admin-gated').forEach(el=>el.classList.toggle('hidden',user.role!=='admin'));
    C.init();F.render();U.goto('chat');U.updateDot();
    /* Refresh dot periodically */
    setInterval(U.updateDot,8000);
  },
  showAuth(){
    q('appScreen').classList.add('hidden');q('authScreen').classList.remove('hidden');
    q('loginIdentifier'||'liUser')&&(q('liUser').value='');
    q('liPass')&&(q('liPass').value='');
    q('liErr')&&(q('liErr').textContent='');
    const btn=q('liBtn');if(btn){btn.classList.remove('loading');btn.querySelector('span').textContent='প্রবেশ করুন';}
  }
};

/* ══════════════ UTILS ══════════════ */
function q(id){return document.getElementById(id);}
function qs(sel){return document.querySelectorAll(sel);}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}

/* ══════════════ GLOBAL EVENTS ══════════════ */
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){U.closeProfile();U.closeNewChat();U.closeNewPage();U.closeNewPost();U.closeLightbox();C.closeAtt();C.closeEmoji();C.closeSrch();}
});
/* Close modals on overlay click */
['profileLayer','newChatLayer','newPageLayer','newPostLayer'].forEach(id=>{
  q(id)?.addEventListener('click',function(e){if(e.target===this)this.classList.add('hidden');});
});

/* ══════════════ INIT ══════════════ */
(function boot(){
  DB.seed();
  const me=DB.me();
  if(me){
    const still=DB.byId(me.id);
    if(still){App.launch(still);return;}
    DB.clearMe();
  }
  q('authScreen').classList.remove('hidden');
  q('appScreen').classList.add('hidden');
  setTimeout(()=>q('liUser')?.focus(),400);
})();
