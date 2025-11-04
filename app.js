/* ===== Toast helper ===== */
const toastEl = document.getElementById('echoToast');
const toastBody = document.getElementById('toast-body');
const Toast = toastEl ? new bootstrap.Toast(toastEl) : null;
function notify(msg){ if(!Toast) return; toastBody.textContent = msg; Toast.show(); }

/* ===== Seed de usuários (apenas 1ª vez) ===== */
(() => {
  const seed = {
    vitoria: { username:'vitoria', password:'123', name:'Vitória', bio:'bio vazia', city:'', avatar:null, posts:[], conversations:{}, friends:[], requests:[] },
    gabriel: { username:'gabriel', password:'123', name:'Gabriel', bio:'bio vazia', city:'', avatar:null, posts:[], conversations:{}, friends:[], requests:[] }
  };
  if (!localStorage.getItem('echoUsers')) localStorage.setItem('echoUsers', JSON.stringify(seed));
})();

/* ===== Página de Login (index.html) ===== */
(() => {
  const loginForm = document.getElementById('form-login');
  const regForm = document.getElementById('form-register');
  const err = document.getElementById('auth-alert');

  if (loginForm){
    const user = document.getElementById('login-user');
    const pass = document.getElementById('login-pass');
    const caps = document.getElementById('caps-hint');
    const btn = document.getElementById('btn-login');
    const btnText = btn?.querySelector('.btn-text');
    const btnSpin = btn?.querySelector('.spinner-border');

    document.getElementById('toggle-pass')?.addEventListener('click', () => {
      const show = pass.type === 'password';
      pass.type = show ? 'text' : 'password';
      const icon = document.querySelector('#toggle-pass i');
      icon.className = show ? 'bi bi-eye-slash' : 'bi bi-eye';
    });
    ['keydown','keyup'].forEach(ev => pass.addEventListener(ev, e => {
      if (!('getModifierState' in e)) return;
      caps.hidden = !e.getModifierState('CapsLock');
    }));
    document.getElementById('fill-demo')?.addEventListener('click', () => {
      user.value = 'gabriel'; pass.value = '123'; user.focus();
    });

    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      loginForm.classList.add('was-validated');
      if (!user.value.trim() || !pass.value) return;

      btn.disabled = true; btnText.classList.add('d-none'); btnSpin.classList.remove('d-none');

      const users = JSON.parse(localStorage.getItem('echoUsers')||'{}');
      const ok = users[user.value.toLowerCase()]?.password === pass.value;

      setTimeout(()=>{
        if (ok){
          localStorage.setItem('echoCurrentUser', user.value.toLowerCase());
          showAlert('Bem-vindo! Redirecionando…', 'success');
          location.href = 'home.html';
        } else {
          showAlert('Usuário ou senha incorretos.', 'danger');
          btn.disabled = false; btnText.classList.remove('d-none'); btnSpin.classList.add('d-none');
        }
      }, 400);
    });

    function showAlert(msg, type='primary'){
      err.className = `alert alert-${type}`;
      err.textContent = msg;
      err.classList.remove('d-none');
    }

    const forgotForm = document.getElementById('form-forgot');
    forgotForm?.addEventListener('submit', (e)=>{
      e.preventDefault();
      const u = document.getElementById('forgot-user').value.trim().toLowerCase();
      const users = JSON.parse(localStorage.getItem('echoUsers')||'{}');
      const fb = document.getElementById('forgot-feedback');
      if (users[u]) {
        const token = Math.random().toString(36).slice(2,8).toUpperCase();
        fb.className = 'alert alert-success';
        fb.textContent = `Token gerado: ${token} (na Fase 2 será enviado por e-mail).`;
      } else {
        fb.className = 'alert alert-warning';
        fb.textContent = 'Usuário não encontrado.';
      }
      fb.classList.remove('d-none');
    });

    pass.addEventListener('keypress', (e)=> { if (e.key==='Enter') loginForm.requestSubmit(); });
  }

  if (regForm){
    regForm.addEventListener('submit',(e)=>{
      e.preventDefault();
      regForm.classList.add('was-validated');
      const name = document.getElementById('reg-name').value.trim();
      const user = document.getElementById('reg-user').value.trim().toLowerCase();
      const pass = document.getElementById('reg-pass').value;
      if (!name || user.length<3 || pass.length<3) return;
      const users = JSON.parse(localStorage.getItem('echoUsers')||'{}');
      if (users[user]) { alert('Usuário já existe'); return; }
      users[user] = { username:user, password:pass, name, bio:'bio vazia', city:'', avatar:null, posts:[], conversations:{}, friends:[], requests:[] };
      localStorage.setItem('echoUsers', JSON.stringify(users));
      localStorage.setItem('echoCurrentUser', user);
      location.href = 'home.html';
    });
  }
})();

/* ===== Aplicação (home.html) ===== */
(() => {
  if (!document.getElementById('feed')) return;

  const current = localStorage.getItem('echoCurrentUser');
  const users = JSON.parse(localStorage.getItem('echoUsers')||'{}');
  if (!current || !users[current]) { location.href = 'index.html'; return; }

  // Header
  document.getElementById('nav-name').textContent = users[current].name || current;

  // Tema claro/escuro
  const btnTheme = document.getElementById('btn-theme');
  const storedTheme = localStorage.getItem('echoTheme') || 'dark';
  if (storedTheme==='light') document.documentElement.setAttribute('data-bs-theme','light');
  btnTheme?.addEventListener('click', ()=>{
    const now = (document.documentElement.getAttribute('data-bs-theme')==='light')?'dark':'light';
    document.documentElement.setAttribute('data-bs-theme', now);
    localStorage.setItem('echoTheme', now);
  });

  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', ()=>{
    localStorage.removeItem('echoCurrentUser');
    location.href = 'index.html';
  });

  // ===== Router de views =====
  const views = {
    home: document.getElementById('view-home'),
    explore: document.getElementById('view-explore'),
    notifications: document.getElementById('view-notifications'),
    messages: document.getElementById('view-messages'),
    saved: document.getElementById('view-saved'),
    about: document.getElementById('view-about'),
    momentos: document.getElementById('view-momentos'),
  };
  function showView(name){
    Object.values(views).forEach(v => v?.classList.add('d-none'));
    // Momentos aparecem juntos com a Home
    if (name==='home'){ views.momentos?.classList.remove('d-none'); }
    views[name]?.classList.remove('d-none');
    document.querySelectorAll('[data-view]').forEach(a=>{
      const v = a.getAttribute('data-view');
      a.classList.toggle('active', v===name);
    });
    if (name==='explore') renderExplore();
    if (name==='notifications') renderNotifications();
    if (name==='messages') renderConversations();
    if (name==='saved') renderSaved();
    if (name==='home') { renderMomentos(); renderFeed(); }
  }
  document.querySelectorAll('[data-view]').forEach(a => {
    a.addEventListener('click', (e)=> { e.preventDefault(); showView(a.getAttribute('data-view')); });
  });
  showView('home');

  // Perfil
  const formProfile = document.getElementById('form-profile');
  if (formProfile){
    formProfile['profile-name'].value = users[current].name || '';
    formProfile['profile-bio'].value = users[current].bio || '';
    formProfile['profile-city'].value = users[current].city || '';
    formProfile.addEventListener('submit', (e)=>{
      e.preventDefault();
      users[current].name = formProfile['profile-name'].value.trim();
      users[current].bio = formProfile['profile-bio'].value.trim();
      users[current].city = formProfile['profile-city'].value.trim();
      const file = document.getElementById('profile-avatar').files?.[0];
      if (file){
        const fr = new FileReader();
        fr.onload = ()=>{ users[current].avatar = fr.result; localStorage.setItem('echoUsers', JSON.stringify(users)); notify('Perfil atualizado'); };
        fr.readAsDataURL(file);
      } else {
        localStorage.setItem('echoUsers', JSON.stringify(users));
        notify('Perfil atualizado');
      }
      document.getElementById('nav-name').textContent = users[current].name || current;
    });
  }

  // Composer
  const txt = document.getElementById('composer-text');
  const img = document.getElementById('composer-image');
  const vis = document.getElementById('composer-visibility');
  const momentoChk = document.getElementById('composer-momento');
  const btnCircleManage = document.getElementById('btn-manage-circles');
  const btnPost = document.getElementById('btn-post');
  const counter = document.getElementById('counter');
  txt?.addEventListener('input', ()=> counter.textContent = String(txt.value.length));
  vis?.addEventListener('change', ()=> btnCircleManage.classList.toggle('d-none', vis.value!=='circle'));

  // Círculos
  let circles = JSON.parse(localStorage.getItem('echoCircles')||'[]');
  function saveCircles(){ localStorage.setItem('echoCircles', JSON.stringify(circles)); }
  const circleList = document.getElementById('circle-list');
  const membersList = document.getElementById('members-list');
  let selectedCircleId = circles[0]?.id ?? null;

  function renderCircles(){
    if (!circleList) return;
    circleList.innerHTML = '';
    circles.forEach(c=>{
      const li = document.createElement('li');
      li.className='list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <div><strong>${c.name}</strong> <small class="text-secondary">(${c.members.length})</small></div>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-secondary" data-select="${c.id}">Selecionar</button>
          <button class="btn btn-outline-danger" data-remove="${c.id}"><i class="bi bi-trash"></i></button>
        </div>`;
      circleList.appendChild(li);
    });
    const cm = circles.find(c=>c.id===selectedCircleId);
    membersList.innerHTML = (cm?.members||[]).map(h=>`<span class="chip">@${h}<span class="x" data-x="${h}">×</span></span>`).join('');
  }
  renderCircles();
  document.getElementById('form-circle')?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('circle-name').value.trim();
    if (!name) return;
    const id = Date.now();
    circles.push({ id, name, members: [] });
    selectedCircleId = id; saveCircles(); renderCircles(); notify('Círculo criado');
    e.target.reset();
  });
  circleList?.addEventListener('click',(e)=>{
    const t = e.target;
    if (t.dataset.select){ selectedCircleId = Number(t.dataset.select); renderCircles(); }
    if (t.dataset.remove){ circles = circles.filter(c=>c.id!==Number(t.dataset.remove)); if(!circles.some(c=>c.id===selectedCircleId)) selectedCircleId=null; saveCircles(); renderCircles(); }
  });
  document.getElementById('add-member')?.addEventListener('click', ()=>{
    if (!selectedCircleId) return alert('Selecione um círculo.');
    const handle = document.getElementById('member-handle').value.trim().replace(/^@/,'');
    if (!handle) return;
    const c = circles.find(x=>x.id===selectedCircleId);
    if (!c.members.includes(handle)) c.members.push(handle);
    document.getElementById('member-handle').value='';
    saveCircles(); renderCircles();
  });
  membersList?.addEventListener('click', e=>{
    const x = e.target.dataset.x;
    if (!x) return;
    const c = circles.find(x=>x.id===selectedCircleId);
    c.members = c.members.filter(h=>h!==x);
    saveCircles(); renderCircles();
  });

  // Posts
  const feedEl = document.getElementById('feed');
  let posts = JSON.parse(localStorage.getItem('echoPosts')||'[]');
  function savePosts(){ localStorage.setItem('echoPosts', JSON.stringify(posts)); }
  function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m]));}

  function canSee(post){
    if (post.visibility==='public') return true;
    if (post.visibility==='followers') return true; // TODO follow real
    if (post.visibility==='circle'){
      const c = circles.find(x=>x.id===post.circleId);
      return post.author===current || c?.members?.includes(current);
    }
    return true;
  }

  function cardHTML(p){
    return `
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-center mb-2">
            <img src="${users[p.author].avatar || 'https://ui-avatars.com/api/?name='+encodeURIComponent(users[p.author].name)}" class="rounded-circle me-2" width="40" height="40" alt="avatar">
            <div><strong>${users[p.author].name}</strong> <span class="text-secondary">@${p.author}</span><br><small class="text-secondary">${new Date(p.createdAt).toLocaleString()}</small></div>
            <span class="ms-auto badge text-bg-secondary">${p.visibility}${p.visibility==='circle'&&p.circleName?' • '+escapeHtml(p.circleName):''}</span>
          </div>
          <p class="mb-2">${escapeHtml(p.content)}</p>
          ${p.media ? `<img src="${p.media}" class="img-fluid rounded mb-2" alt="imagem do post">` : ''}
          <div class="d-flex gap-2 post-actions">
            <button class="btn btn-outline-primary btn-sm" data-like="${p.id}"><i class="bi bi-heart"></i> ${p.likes.length}</button>
            <button class="btn btn-outline-secondary btn-sm" data-repost="${p.id}"><i class="bi bi-arrow-repeat"></i> ${p.reposts.length}</button>
            <button class="btn btn-outline-info btn-sm" data-context="${p.id}"><i class="bi bi-journal-text"></i> Nota</button>
            <button class="btn btn-outline-warning btn-sm" data-save="${p.id}"><i class="bi bi-bookmark"></i></button>
            ${p.author===current ? `<button class="btn btn-outline-danger btn-sm" data-del="${p.id}"><i class="bi bi-trash"></i></button>`:''}
          </div>
        </div>
      </div>`;
  }

  function renderFeed(){
    const visible = posts.filter(canSee).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    feedEl.innerHTML = visible.map(cardHTML).join('');
  }
  renderFeed();

  // Bookmarks
  let saved = JSON.parse(localStorage.getItem('echoSaved')||'{}'); // {user:[postId]}
  function saveSaved(){ localStorage.setItem('echoSaved', JSON.stringify(saved)); }
  function renderSaved(){
    const list = (saved[current]||[]).map(id => posts.find(p=>p.id===id)).filter(Boolean)
      .sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
    const el = document.getElementById('saved-list');
    el.innerHTML = list.length ? list.map(cardHTML).join('') :
      `<div class="card shadow-sm"><div class="card-body text-secondary">Nada salvo ainda.</div></div>`;
  }

  // Notificações
  let notifications = JSON.parse(localStorage.getItem('echoNotif')||'{}'); // {user:[...]}
  function pushNotif(to, notif){
    if (to===current) return;
    notifications[to] = notifications[to] || [];
    notifications[to].unshift({ id: Date.now()+Math.random(), read:false, createdAt:new Date().toISOString(), ...notif });
    localStorage.setItem('echoNotif', JSON.stringify(notifications));
  }
  function markAllRead(user){
    (notifications[user]||[]).forEach(n=> n.read=true);
    localStorage.setItem('echoNotif', JSON.stringify(notifications));
  }
  function clearNotif(user){
    notifications[user]=[]; localStorage.setItem('echoNotif', JSON.stringify(notifications));
  }
  function renderNotifications(){
    const list = notifications[current]||[];
    const el = document.getElementById('notif-list');
    if (!list.length){ el.innerHTML = `<div class="card shadow-sm"><div class="card-body text-secondary">Sem notificações.</div></div>`; return; }
    el.innerHTML = list.map(n=>{
      const p = posts.find(x=>x.id===n.postId);
      const when = new Date(n.createdAt).toLocaleString();
      const icon = n.type==='like' ? 'heart' :
                   n.type==='repost' ? 'arrow-repeat' :
                   n.type==='context_note' ? 'journal-text' :
                   n.type==='friend_request' ? 'person-plus' : 'chat-dots';
      const text = n.type==='like' ? `${n.from} curtiu seu post`
                 : n.type==='repost' ? `${n.from} echoou seu post`
                 : n.type==='context_note' ? `${n.from} adicionou uma nota no seu post`
                 : n.type==='friend_request' ? `${n.from} enviou uma solicitação de amizade`
                 : `Nova mensagem de ${n.from}`;
      return `
        <div class="card shadow-sm ${n.read?'opacity-75':''}">
          <div class="card-body d-flex gap-2 align-items-start">
            <i class="bi bi-${icon} fs-5 text-primary"></i>
            <div class="flex-grow-1">
              <div><strong>@${n.from}</strong> — ${text}</div>
              <small class="text-secondary">${when}</small>
              ${p ? `<div class="mt-2 text-secondary small border-start ps-2">${escapeHtml(p.content).slice(0,140)}</div>` : ''}
            </div>
          </div>
        </div>`;
    }).join('');
    document.getElementById('btn-mark-all')?.addEventListener('click', ()=>{ markAllRead(current); renderNotifications(); });
    document.getElementById('btn-clear-notif')?.addEventListener('click', ()=>{ clearNotif(current); renderNotifications(); });
  }

  // Explorar
  function hashtagsFrom(content){
    return (content.match(/#\w+/g) || []).map(s=> s.toLowerCase());
  }
  function computeTrends(){
    const map = {};
    posts.forEach(p => hashtagsFrom(p.content).forEach(tag => map[tag]=(map[tag]||0)+1));
    return Object.entries(map).sort((a,b)=> b[1]-a[1]).slice(0,10);
  }
  function renderExplore(){
    const trends = computeTrends();
    document.getElementById('explore-trends').innerHTML = trends.length ? trends.map(([tag,count])=>
      `<li class="list-group-item d-flex justify-content-between align-items-center">
        <button class="btn btn-link p-0 text-decoration-none" data-tag="${tag}">${tag}</button>
        <span class="badge text-bg-secondary">${count}</span>
      </li>`).join('') : `<li class="list-group-item text-secondary">Sem tendências.</li>`;

    const counts = {};
    posts.forEach(p=> counts[p.author]=(counts[p.author]||0)+1);
    const top = Object.entries(counts).sort((a,b)=> b[1]-a[1]).slice(0,5).map(([u,c])=>({u,c}));
    document.getElementById('explore-suggest').innerHTML = top.length ? top.map(x=>
      `<li class="list-group-item d-flex justify-content-between align-items-center">
        <span><strong>${users[x.u].name}</strong> <span class="text-secondary">@${x.u}</span></span>
        <span class="badge text-bg-dark">${x.c} posts</span>
      </li>`).join('') : `<li class="list-group-item text-secondary">Sem sugestões.</li>`;

    const resultsEl = document.getElementById('explore-results');
    function doSearch(q){
      q = q.trim();
      let list = posts;
      if (q.startsWith('#')){
        const tag = q.toLowerCase();
        list = posts.filter(p => hashtagsFrom(p.content).includes(tag));
      } else if (q){
        const k = q.toLowerCase();
        list = posts.filter(p => p.content.toLowerCase().includes(k));
      }
      resultsEl.innerHTML = list.length ? list.slice().sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt)).map(cardHTML).join('') :
        `<div class="card shadow-sm"><div class="card-body text-secondary">Nenhum resultado.</div></div>`;
    }
    document.getElementById('explore-btn')?.addEventListener('click', ()=>{
      const q = document.getElementById('explore-query').value; doSearch(q);
    });
    document.getElementById('explore-trends')?.addEventListener('click', (e)=>{
      const tag = e.target.closest('button')?.dataset.tag; if(!tag) return;
      document.getElementById('explore-query').value = tag; doSearch(tag);
    });
    doSearch('');
  }

  // Conversas (lista)
  function renderConversations(){
    const ul = document.getElementById('convo-list');
    const conv = users[current].conversations || {};
    const items = Object.keys(conv).map(h => {
      const msgs = conv[h]; const last = msgs[msgs.length-1];
      const preview = last ? (last.text||'').slice(0,36) : 'Sem mensagens';
      return { h, preview, at: last?.at || 0 };
    }).sort((a,b)=> b.at - a.at);
    ul.innerHTML = items.length ? items.map(i=>`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <div><strong>@${i.h}</strong></div>
          <small class="text-secondary">${i.preview}</small>
        </div>
        <button class="btn btn-sm btn-outline-primary" data-chat="${i.h}" data-bs-toggle="modal" data-bs-target="#modalChat">Abrir</button>
      </li>`).join('') :
      `<li class="list-group-item text-secondary">Nenhuma conversa.</li>`;
  }

  // MOMENTOS (stories simples que expiram em 24h)
  const strip = document.getElementById('momentos-strip');
  let momentos = JSON.parse(localStorage.getItem('echoMomentos')||'[]'); // [{id,author,media,createdAt,expireAt}]
  function saveMomentos(){ localStorage.setItem('echoMomentos', JSON.stringify(momentos)); }
  function renderMomentos(){
    if (!strip) return;
    const now = Date.now();
    momentos = momentos.filter(m => new Date(m.expireAt).getTime() > now); // limpa expirados
    saveMomentos();
    document.getElementById('view-momentos').classList.toggle('d-none', momentos.length===0);
    strip.innerHTML = momentos.map(m => `
      <div class="text-center">
        <img src="${m.media}" class="momento-avatar" alt="@${m.author}">
        <div class="small mt-1">@${m.author}</div>
      </div>`).join('');
  }
  renderMomentos();

  // Publicar (post ou momento)
  btnPost?.addEventListener('click', ()=>{
    const content = (txt.value||'').trim();
    const asMoment = momentoChk.checked;
    if (asMoment){
      if (!img.files?.[0]) { alert('Selecione uma imagem para o Momento.'); return; }
      btnPost.disabled = true; btnPost.textContent = 'Publicando...';
      const fr = new FileReader();
      fr.onload = ()=>{
        const media = fr.result;
        const now = new Date();
        const expire = new Date(now.getTime() + 24*60*60*1000);
        momentos.unshift({ id: Date.now(), author: current, media, createdAt: now.toISOString(), expireAt: expire.toISOString() });
        saveMomentos(); renderMomentos();
        txt.value=''; img.value=''; momentoChk.checked=false; document.getElementById('counter').textContent='0';
        notify('Momento publicado');
        setTimeout(()=>{ btnPost.disabled = false; btnPost.textContent='Echoar'; }, 400);
      };
      fr.readAsDataURL(img.files[0]);
      return;
    }

    if (!content) return;
    btnPost.disabled = true; btnPost.textContent = 'Publicando...';

    let media = null;
    const finish = () => {
      const circleId = (vis.value==='circle') ? selectedCircleId : null;
      const circleName = (vis.value==='circle') ? (circles.find(c=>c.id===circleId)?.name || '') : '';
      posts.unshift({ id: Date.now(), author: current, content, media, visibility: vis.value, circleId, circleName, likes:[], reposts:[], createdAt: new Date().toISOString() });
      savePosts(); renderFeed(); txt.value=''; img.value=''; document.getElementById('counter').textContent='0'; notify('Publicado');
      setTimeout(()=>{ btnPost.disabled = false; btnPost.textContent = 'Echoar'; }, 400);
    };
    if (img.files?.[0]){
      const fr = new FileReader();
      fr.onload = ()=> { media = fr.result; finish(); };
      fr.readAsDataURL(img.files[0]);
    } else finish();
  });

  // Ações do feed
  feedEl?.addEventListener('click', (e)=>{
    const t = e.target.closest('button'); if(!t) return;
    const like = t.dataset.like, repost = t.dataset.repost, del = t.dataset.del, ctx = t.dataset.context, sv = t.dataset.save;

    if (like){
      const p = posts.find(x=>x.id===Number(like));
      const i = p.likes.indexOf(current);
      if (i>=0) p.likes.splice(i,1); else { p.likes.push(current); pushNotif(p.author, {type:'like', from: current, postId: p.id}); }
      savePosts(); renderFeed();
    }
    if (repost){
      const p = posts.find(x=>x.id===Number(repost));
      const i = p.reposts.indexOf(current);
      if (i>=0) p.reposts.splice(i,1); else { p.reposts.push(current); pushNotif(p.author, {type:'repost', from: current, postId: p.id}); }
      savePosts(); renderFeed();
    }
    if (sv){
      const list = saved[current] || [];
      const id = Number(sv);
      const idx = list.indexOf(id);
      if (idx>=0) list.splice(idx,1); else list.push(id);
      saved[current] = list; saveSaved(); notify(idx>=0?'Removido dos salvos':'Salvo');
    }
    if (del){
      posts = posts.filter(x=>x.id!==Number(del));
      savePosts(); renderFeed(); notify('Post excluído');
    }
    if (ctx){ openContext(Number(ctx)); }
  });

  // Notas de contexto
  const modalContext = document.getElementById('modalContext');
  const contextList = document.getElementById('context-list');
  const contextBody = document.getElementById('context-body');
  const contextSave = document.getElementById('context-save');
  let contextNotes = JSON.parse(localStorage.getItem('echoContextNotes')||'[]');
  let ctxPostId = null;

  function saveNotes(){ localStorage.setItem('echoContextNotes', JSON.stringify(contextNotes)); }
  function renderContext(postId){
    const notes = contextNotes.filter(n=>n.postId===postId).sort((a,b)=>b.score-a.score);
    contextList.innerHTML = notes.length ? notes.map(n=>`
      <div class="border rounded p-2">
        <div class="small text-secondary mb-1">@${n.author} • ${new Date(n.createdAt).toLocaleString()}</div>
        <div class="mb-2">${escapeHtml(n.body)}</div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-success btn-sm" data-up="${n.id}">Útil (+)</button>
          <button class="btn btn-outline-warning btn-sm" data-down="${n.id}">Não útil (−)</button>
          <span class="ms-auto badge text-bg-dark">Score: ${n.score}</span>
        </div>
      </div>`).join('') : `<div class="text-secondary">Sem notas ainda.</div>`;
  }
  function openContext(postId){
    ctxPostId = postId; renderContext(postId);
    const m = new bootstrap.Modal(modalContext); m.show();
  }
  contextSave?.addEventListener('click', ()=>{
    const body = (contextBody.value||'').trim();
    if (!body) return;
    contextNotes.push({ id: Date.now(), postId: ctxPostId, author: current, body, score: 0, createdAt: new Date().toISOString() });
    const target = posts.find(p=>p.id===ctxPostId)?.author;
    if (target) pushNotif(target, {type:'context_note', from: current, postId: ctxPostId});
    contextBody.value=''; saveNotes(); renderContext(ctxPostId); notify('Nota adicionada');
  });
  contextList?.addEventListener('click', (e)=>{
    const t = e.target;
    const up = t.dataset.up, down = t.dataset.down;
    if (!up && !down) return;
    const id = Number(up||down);
    const n = contextNotes.find(x=>x.id===id); if (!n) return;
    n.score += up?1:-1; saveNotes(); renderContext(n.postId);
  });

  // Amigos + chat
  const friendsUl = document.getElementById('friends-list');
  const reqUl = document.getElementById('friend-requests');
  const friendsList = document.getElementById('friends');
  const convoEl = document.getElementById('chat-messages');
  let me = users[current];

  function renderFriendsSidebar(){
    friendsUl.innerHTML = (me.friends||[]).map(h=>`<li class="list-group-item d-flex justify-content-between align-items-center">
      <span>@${h}</span>
      <button class="btn btn-sm btn-outline-primary" data-chat="${h}" data-bs-toggle="modal" data-bs-target="#modalChat">Chat</button>
    </li>`).join('') || `<li class="list-group-item text-secondary">Sem amigos</li>`;
  }
  renderFriendsSidebar();

  document.getElementById('friend-add')?.addEventListener('click', ()=>{
    const h = document.getElementById('friend-handle').value.trim().replace(/^@/,'');
    if (!h || !users[h]) return alert('Usuário não encontrado');
    const other = users[h];
    other.requests = other.requests||[];
    if (!other.requests.includes(current)) other.requests.push(current);
    localStorage.setItem('echoUsers', JSON.stringify(users));
    pushNotif(h, {type:'friend_request', from: current});
    notify('Solicitação enviada');
  });

  function renderRequests(){
    const reqs = me.requests||[];
    reqUl.innerHTML = reqs.length? reqs.map(h=>`
      <li class="list-group-item d-flex justify-content-between">
        <span>@${h}</span>
        <span class="btn-group btn-group-sm">
          <button class="btn btn-outline-success" data-acc="${h}">Aceitar</button>
          <button class="btn btn-outline-danger" data-rej="${h}">Recusar</button>
        </span>
      </li>`).join('') : `<li class="list-group-item text-secondary">Sem solicitações</li>`;
  }
  renderRequests();

  reqUl?.addEventListener('click', (e)=>{
    const t = e.target;
    const acc = t.dataset.acc, rej = t.dataset.rej;
    if (!acc && !rej) return;
    const h = acc||rej;
    me.requests = (me.requests||[]).filter(x=>x!==h);
    if (acc){
      me.friends = me.friends||[]; if (!me.friends.includes(h)) me.friends.push(h);
      users[h].friends = users[h].friends||[]; if (!users[h].friends.includes(current)) users[h].friends.push(current);
    }
    users[current] = me; localStorage.setItem('echoUsers', JSON.stringify(users));
    renderRequests(); renderFriendsSidebar();
  });

  // Abrir chat
  document.getElementById('friends-list')?.addEventListener('click',(e)=>{
    const h = e.target.dataset.chat; if(!h) return;
    openChat(h);
  });
  function openChat(h){
    document.getElementById('chat-with').textContent='@'+h;
    renderChat(h);
  }
  function renderChat(h){
    me = users[current]; me.conversations = me.conversations||{};
    const msgs = me.conversations[h]||[];
    convoEl.innerHTML = msgs.map(m=>`
      <div class="mb-2 ${m.sender==='me'?'text-end':''}">
        <span class="badge rounded-pill ${m.sender==='me'?'text-bg-primary':'text-bg-secondary'}">${escapeHtml(m.text)}</span>
      </div>`).join('');
  }
  document.getElementById('chat-send')?.addEventListener('click', ()=>{
    const h = document.getElementById('chat-with').textContent.replace('@','');
    const input = document.getElementById('chat-input');
    const text = input.value.trim(); if(!text) return;
    me.conversations = me.conversations||{}; me.conversations[h] = me.conversations[h]||[];
    me.conversations[h].push({ sender:'me', text, at: Date.now() });
    users[current]=me; localStorage.setItem('echoUsers', JSON.stringify(users));
    input.value=''; renderChat(h);
    // resposta simulada
    setTimeout(()=>{
      const other = users[h]; other.conversations = other.conversations||{}; other.conversations[current]=other.conversations[current]||[];
      other.conversations[current].push({ sender:'them', text:'👍', at: Date.now() });
      localStorage.setItem('echoUsers', JSON.stringify(users));
      renderChat(h);
    },500);
  });

})();
