/* ============================================================
   ECHO — APP.JS COMPLETO
   PARTE 1/8 — CONFIG, SESSÃO, LOGIN, CADASTRO, RESET, TEMA
   ============================================================ */


/* ============================================================
   1. CONFIGURAÇÃO GERAL
   ============================================================ */

const API_BASE = "http://localhost/echo/api/";

let AUTH_TOKEN = localStorage.getItem("echo_token") || null;
let CURRENT_USER = null;

function api(url, options = {}) {
    return fetch(API_BASE + url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": AUTH_TOKEN ? `Bearer ${AUTH_TOKEN}` : ""
        },
        ...options
    }).then(r => r.json());
}

function isLogged() {
    return AUTH_TOKEN !== null;
}


/* ============================================================
   2. TOAST (ALERTAS BONITOS)
   ============================================================ */

function showAlert(msg, type = "info") {
    const body = document.getElementById("toast-body");
    const toast = new bootstrap.Toast(document.getElementById("echoToast"));
    const box = document.getElementById("echoToast");

    body.innerHTML = msg;
    box.className = `toast align-items-center text-bg-${type} border-0`;

    toast.show();
}


/* ============================================================
   3. LOGIN
   ============================================================ */

async function doLogin() {
    const handle = document.getElementById("login-user").value.trim().toLowerCase();
    const password = document.getElementById("login-pass").value;

    if (!handle || !password) {
        showAlert("Preencha usuário e senha.", "warning");
        return;
    }

    const btn = document.getElementById("btn-login");
    const txt = btn.querySelector(".btn-text");
    const spin = btn.querySelector(".spinner-border");

    btn.disabled = true;
    txt.classList.add("d-none");
    spin.classList.remove("d-none");

    const res = await api("auth/login.php", {
        method: "POST",
        body: JSON.stringify({ handle, password })
    });

    btn.disabled = false;
    txt.classList.remove("d-none");
    spin.classList.add("d-none");

    if (!res.ok) {
        showAlert(res.error || "Erro ao fazer login.", "danger");
        return;
    }

    AUTH_TOKEN = res.data.token;
    localStorage.setItem("echo_token", AUTH_TOKEN);

    window.location.href = "home.html";
}


/* ============================================================
   4. REGISTRO
   ============================================================ */

async function doRegister() {
    const name = document.getElementById("reg-name").value.trim();
    const handle = document.getElementById("reg-user").value.trim().toLowerCase();
    const password = document.getElementById("reg-pass").value;

    if (!name || !handle || password.length < 3) {
        showAlert("Preencha todos os campos (mínimo 3 caracteres).", "warning");
        return;
    }

    const res = await api("auth/register.php", {
        method: "POST",
        body: JSON.stringify({ name, handle, password })
    });

    if (!res.ok) {
        showAlert(res.error, "danger");
        return;
    }

    AUTH_TOKEN = res.data.token;
    localStorage.setItem("echo_token", AUTH_TOKEN);

    window.location.href = "home.html";
}


/* ============================================================
   5. RESET DE SENHA
   ============================================================ */

async function doResetPassword() {
    const handle = document.getElementById("reset-user").value.trim().toLowerCase();
    const newPass = document.getElementById("reset-pass").value;

    if (!handle || newPass.length < 3) {
        showAlert("Preencha corretamente para redefinir a senha.", "warning");
        return;
    }

    const res = await api("auth/reset_password.php", {
        method: "POST",
        body: JSON.stringify({ handle, password: newPass })
    });

    if (!res.ok) {
        showAlert(res.error, "danger");
        return;
    }

    showAlert("Senha atualizada com sucesso!", "success");
}


/* ============================================================
   6. BUSCAR USUÁRIO LOGADO (ME)
   ============================================================ */

async function loadMe() {
    if (!AUTH_TOKEN) return null;

    const res = await api("me.php");

    if (!res.ok) {
        localStorage.removeItem("echo_token");
        AUTH_TOKEN = null;
        return null;
    }

    CURRENT_USER = res.data;

    // Atualizar navbar
    const navName = document.getElementById("nav-name");
    if (navName) navName.innerText = CURRENT_USER.name;

    return CURRENT_USER;
}


/* ============================================================
   7. LOGOUT
   ============================================================ */

function doLogout() {
    localStorage.removeItem("echo_token");
    AUTH_TOKEN = null;
    CURRENT_USER = null;
    window.location.href = "index.html";
}


/* ============================================================
   8. CONTROLE DE TEMA (DARK / LIGHT)
   ============================================================ */

let CURRENT_THEME = localStorage.getItem("echo_theme") || "dark";

function applyTheme() {
    document.documentElement.setAttribute("data-bs-theme", CURRENT_THEME);
    localStorage.setItem("echo_theme", CURRENT_THEME);

    const btn = document.getElementById("btn-theme");
    if (btn) {
        btn.innerHTML = CURRENT_THEME === "dark"
            ? `<i class="bi bi-sun"></i>`
            : `<i class="bi bi-moon"></i>`;
    }
}

function toggleTheme() {
    CURRENT_THEME = CURRENT_THEME === "dark" ? "light" : "dark";
    applyTheme();
}


/* ============================================================
   9. INICIALIZAÇÃO GLOBAL
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {
    applyTheme();

    // PÁGINA DE LOGIN
    if (document.getElementById("form-login")) {
        document.getElementById("form-login").addEventListener("submit", e => {
            e.preventDefault();
            doLogin();
        });

        document.getElementById("form-register").addEventListener("submit", e => {
            e.preventDefault();
            doRegister();
        });

        document.getElementById("form-reset").addEventListener("submit", e => {
            e.preventDefault();
            doResetPassword();
        });

        return; // o resto é só para home.html
    }

    // HOME.HTML → deve estar logado
    if (!isLogged()) {
        window.location.href = "index.html";
        return;
    }

    await loadMe();
});
// ========================================================
// SISTEMA DE AMIZADES — ECHO (Solicitações, amigos, comum)
// ========================================================

// Armazena informações locais
let friends = [];
let friendRequests = [];
let suggestions = [];

// -----------------------------------------------
// 1) Buscar amigos do usuário atual
// -----------------------------------------------
async function loadFriends() {
    const res = await apiGet("friends/list.php");
    if (!res.ok) return;

    friends = res.data.friends;
    friendRequests = res.data.requests;
    suggestions = res.data.suggestions;

    renderFriendsList();
    renderFriendRequests();
    renderSuggestions();
}

// Painel lateral — amigos
function renderFriendsList() {
    const el = document.querySelector("#friends-list");
    if (!el) return;

    el.innerHTML = friends.map(f => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>@${f.handle}</span>
            <button class="btn btn-sm btn-dark" onclick="openChat('${f.handle}')">
                <i class="bi bi-chat-dots"></i>
            </button>
        </li>
    `).join("");
}

// Solicitações pendentes
function renderFriendRequests() {
    const el = document.querySelector("#friend-requests");
    if (!el) return;

    if (friendRequests.length === 0) {
        el.innerHTML = `<li class="list-group-item text-secondary">Nenhuma solicitação.</li>`;
        return;
    }

    el.innerHTML = friendRequests.map(fr => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>@${fr.handle}</span>
            <div class="btn-group">
                <button class="btn btn-sm btn-success" onclick="acceptFriend('${fr.handle}')">
                    Aceitar
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="denyFriend('${fr.handle}')">
                    Recusar
                </button>
            </div>
        </li>
    `).join("");
}

// Sugestões de amizade
function renderSuggestions() {
    const el = document.querySelector("#explore-suggest");
    if (!el) return;

    el.innerHTML = suggestions.map(s => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <strong>@${s.handle}</strong><br>
                <small class="text-secondary">${s.mutuals} amigo(s) em comum</small>
            </div>
            <button class="btn btn-sm btn-primary" onclick="sendFriendRequest('${s.handle}')">
                Adicionar
            </button>
        </li>
    `).join("");
}

// -----------------------------------------------
// 2) Solicitar amizade
// -----------------------------------------------
async function sendFriendRequest(handle) {
    const res = await apiPost("friends/request.php", { handle });

    if (!res.ok) return toast("Erro: " + res.error);
    toast("Solicitação enviada");

    loadFriends();
}

// -----------------------------------------------
// 3) Aceitar amizade
// -----------------------------------------------
async function acceptFriend(handle) {
    const res = await apiPost("friends/accept.php", { handle });
    if (!res.ok) return toast(res.error);
    toast("Agora vocês são amigos!");
    loadFriends();
    loadFeed(); // libera os posts
}

// -----------------------------------------------
// 4) Recusar amizade
// -----------------------------------------------
async function denyFriend(handle) {
    const res = await apiPost("friends/deny.php", { handle });
    if (!res.ok) return toast(res.error);
    toast("Solicitação recusada");
    loadFriends();
}

// -----------------------------------------------
// 5) Cancelar amizade (unfriend)
// -----------------------------------------------
async function removeFriend(handle) {
    const res = await apiPost("friends/remove.php", { handle });
    if (!res.ok) return toast(res.error);
    toast("Amizade removida.");
    loadFriends();
    loadFeed();
}

// -----------------------------------------------
// 6) Amigos em comum (no perfil)
// -----------------------------------------------
function renderMutualFriends(targetHandle, container) {
    // Localiza sugestão que contém esse user
    const match = suggestions.find(s => s.handle === targetHandle);
    if (!match || match.mutuals === 0) {
        container.classList.add("d-none");
        return;
    }

    container.innerHTML = `
        <small class="text-secondary">${match.mutuals} amigo(s) em comum</small>
    `;
    container.classList.remove("d-none");
}

// -----------------------------------------------
// 7) Botões do perfil
// -----------------------------------------------
async function updateProfileFriendButton(viewedHandle) {
    const btnAdd = document.querySelector("#profile-view-add");
    const btnMsg = document.querySelector("#profile-view-message");
    const btnEdit = document.querySelector("#profile-view-edit");

    const me = window.currentUser;

    // você está vendo seu próprio perfil
    if (me.handle === viewedHandle) {
        btnAdd.classList.add("d-none");
        btnMsg.classList.add("d-none");
        btnEdit.classList.remove("d-none");
        return;
    }

    btnEdit.classList.add("d-none");

    // Já é amigo?
    const isFriend = friends.some(f => f.handle === viewedHandle);
    const hasRequested = friendRequests.some(r => r.handle === viewedHandle);
    const iRequested = suggestions.some(s => s.handle === viewedHandle && s.requested === true);

    // É amigo → mostrar chat
    if (isFriend) {
        btnAdd.classList.add("d-none");
        btnMsg.classList.remove("d-none");
        btnMsg.innerHTML = "Mensagem";
        btnMsg.onclick = () => openChat(viewedHandle);
        return;
    }

    // Ele te pediu amizade
    if (hasRequested) {
        btnAdd.classList.remove("d-none");
        btnAdd.innerHTML = "Aceitar solicitação";
        btnAdd.onclick = () => acceptFriend(viewedHandle);
        btnMsg.classList.add("d-none");
        return;
    }

    // Você já mandou solicitação
    if (iRequested) {
        btnAdd.classList.remove("d-none");
        btnAdd.innerHTML = "Solicitação enviada";
        btnAdd.disabled = true;
        btnMsg.classList.add("d-none");
        return;
    }

    // Não são amigos ainda
    btnAdd.classList.remove("d-none");
    btnAdd.innerHTML = "Adicionar";
    btnAdd.disabled = false;
    btnAdd.onclick = () => sendFriendRequest(viewedHandle);

    // Chat restrito → solicitar conversa
    btnMsg.classList.remove("d-none");
    btnMsg.innerHTML = "Solicitar conversa";
    btnMsg.onclick = () => sendFriendRequest(viewedHandle);
}


/* ============================================================
   ECHO — APP.JS COMPLETO
   PARTE 2/8 — SPA, NAVEGAÇÃO, SIDEBAR, NAVBAR
   ============================================================ */


/* ============================================================
   1. CONTROLAR TODAS AS “TELAS” (VIEWS DO SPA)
   ============================================================ */

const VIEWS = [
    "view-home",
    "view-explore",
    "view-notifications",
    "view-messages",
    "view-saved",
    "view-profile",
    "view-about"
];

function showView(viewId) {
    VIEWS.forEach(v => {
        const el = document.getElementById(v);
        if (el) el.classList.add("d-none");
    });

    const el = document.getElementById(viewId);
    if (el) {
        el.classList.remove("d-none");
        el.scrollTop = 0;
    }

    highlightSidebar(viewId);
    highlightNavbar(viewId);
}


/* ============================================================
   2. DESTACAR O ITEM CORRETO DA SIDEBAR
   ============================================================ */

function highlightSidebar(viewId) {
    const buttons = document.querySelectorAll("aside .list-group-item");

    buttons.forEach(btn => {
        if (btn.dataset.view === viewId.replace("view-", "")) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}


/* ============================================================
   3. DESTACAR O ITEM CERTO DA NAVBAR SUPERIOR
   ============================================================ */

function highlightNavbar(viewId) {
    const navItems = document.querySelectorAll("nav .nav-link");

    navItems.forEach(link => {
        if (link.dataset.view === viewId.replace("view-", "")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}


/* ============================================================
   4. EVENTOS DA NAVBAR / SIDEBAR (CLICK → TROCA DE TELA)
   ============================================================ */

function attachNavigationEvents() {
    // Navbar
    document.querySelectorAll("nav .nav-link").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const view = link.dataset.view;
            if (view) {
                showView("view-" + view);

                if (view === "home") loadTimeline(1);
                if (view === "explore") loadExploreTrends();
                if (view === "notifications") loadNotifications();
                if (view === "messages") loadConversations();
                if (view === "saved") loadSaved();
            }
        });
    });

    // Sidebar
    document.querySelectorAll("aside .list-group-item").forEach(item => {
        item.addEventListener("click", () => {
            const view = item.dataset.view;
            if (view) {
                showView("view-" + view);

                if (view === "home") loadTimeline(1);
                if (view === "explore") loadExploreTrends();
                if (view === "notifications") loadNotifications();
                if (view === "messages") loadConversations();
                if (view === "saved") loadSaved();
            }
        });
    });
}


/* ============================================================
   5. BOTÕES ESPECIAIS DA NAVBAR
   ============================================================ */

function attachNavbarButtons() {
    // Trocar tema
    const themeBtn = document.getElementById("btn-theme");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

    // Sair
    const logoutBtn = document.getElementById("btn-logout");
    if (logoutBtn) logoutBtn.addEventListener("click", doLogout);

    // Abrir perfil
    const profileBtn = document.getElementById("btn-open-profile");
    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            openProfile(CURRENT_USER.handle);
        });
    }
}


/* ============================================================
   6. INICIALIZAÇÃO DAS VIEWS
   ============================================================ */

function initSPA() {
    attachNavigationEvents();
    attachNavbarButtons();
    showView("view-home");
}
/* ============================================================
   ECHO — APP.JS COMPLETO
   PARTE 3/8 — FEED, POSTS, PAGINAÇÃO, EXPLORAR, TENDÊNCIAS
   ============================================================ */


/* ============================================================
   1. POSTAR (ECHOAR)
   ============================================================ */

async function createPost() {
    const content = document.getElementById("composer-text").value.trim();
    const visibility = document.getElementById("composer-visibility").value;
    const isMomento = document.getElementById("composer-momento").checked;
    const imgInput = document.getElementById("composer-image");

    if (isMomento) {
        return createMomento();
    }

    if (!content) {
        showAlert("Escreva alguma coisa antes de postar!", "warning");
        return;
    }

    let media = null;

    if (imgInput.files.length > 0) {
        const file = imgInput.files[0];
        media = await fileToBase64(file);
    }

    const res = await api("posts/create.php", {
        method: "POST",
        body: JSON.stringify({
            handle: CURRENT_USER.handle,
            content,
            visibility,
            media
        })
    });

    if (!res.ok) {
        showAlert("Erro ao criar post.", "danger");
        return;
    }

    document.getElementById("composer-text").value = "";
    imgInput.value = "";
    document.getElementById("composer-visibility").value = "public";

    showAlert("Publicado!", "success");

    loadTimeline(1, true);
}


/* ============================================================
   2. CONVERTER IMG → BASE64
   ============================================================ */

function fileToBase64(file) {
    return new Promise(res => {
        const reader = new FileReader();
        reader.onload = e => res(e.target.result);
        reader.readAsDataURL(file);
    });
}


/* ============================================================
   3. TIMELINE / FEED PRINCIPAL (SÓ AMIGOS)
   ============================================================ */

let CURRENT_PAGE = 1;
let LAST_PAGE_REACHED = false;

async function loadTimeline(page = 1, replace = true) {
    if (page === 1) {
        LAST_PAGE_REACHED = false;
        CURRENT_PAGE = 1;
    }

    const feed = document.getElementById("feed");
    const emptyBox = document.getElementById("feed-empty");
    const skeleton = document.getElementById("feed-skeleton");

    skeleton.classList.remove("d-none");
    emptyBox.classList.add("d-none");

    const res = await api(`posts/friends_feed.php?page=${page}`);

    skeleton.classList.add("d-none");

    if (!res.ok) {
        showAlert("Erro ao carregar feed.", "danger");
        return;
    }

    const posts = res.data.posts;

    // Se não tem mais posts
    if (posts.length < 10) LAST_PAGE_REACHED = true;

    if (replace) feed.innerHTML = "";

    if (posts.length === 0 && page === 1) {
        emptyBox.classList.remove("d-none");
        return;
    }

    posts.forEach(p => feed.appendChild(renderPost(p)));
}


/* ============================================================
   4. RENDERIZAR UM POST
   ============================================================ */

function renderPost(p) {
    const div = document.createElement("div");
    div.className = "card shadow-sm";

    const date = new Date(p.created_at).toLocaleString("pt-BR");

    let mediaBlock = "";
    if (p.media) {
        mediaBlock = `
            <img src="data:image/jpeg;base64,${p.media}"
                 class="img-fluid rounded mt-2">
        `;
    }

    const visIcon =
        p.visibility === "public" ? "bi-globe" :
        p.visibility === "friends" ? "bi-people" :
        "bi-lock";

    div.innerHTML = `
        <div class="card-body">
            <div class="d-flex">
                <img src="https://ui-avatars.com/api/?name=${p.name}"
                     class="rounded-circle me-2" width="48">

                <div>
                    <strong>@${p.handle}</strong>
                    <br>
                    <small class="text-secondary">
                        <i class="bi ${visIcon}"></i> ${date}
                    </small>
                </div>
            </div>

            <p class="mt-2">${escapeHtml(p.content)}</p>

            ${mediaBlock}

            <div class="d-flex gap-3 mt-3">
                <button class="btn btn-outline-primary btn-sm"
                        onclick="toggleLike(${p.id})">
                    <i class="bi bi-heart"></i> Curtir
                </button>

                <button class="btn btn-outline-secondary btn-sm"
                        onclick="openContextNotes(${p.id})">
                    <i class="bi bi-info-circle"></i> Contexto
                </button>

                <button class="btn btn-outline-danger btn-sm"
                        onclick="toggleSave(${p.id})">
                    <i class="bi bi-bookmark"></i>
                </button>
            </div>
        </div>
    `;

    return div;
}


/* ============================================================
   5. ESCAPAR HTML (segurança)
   ============================================================ */

function escapeHtml(txt) {
    return txt.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}


/* ============================================================
   6. CARREGAR MAIS POSTS
   ============================================================ */

async function loadMoreFeed() {
    if (LAST_PAGE_REACHED) {
        showAlert("Não há mais posts.", "secondary");
        return;
    }

    CURRENT_PAGE++;
    loadTimeline(CURRENT_PAGE, false);
}


/* ============================================================
   7. EXPLORAR (Ver posts públicos)
   ============================================================ */

async function loadExploreTrends() {
    const ul = document.getElementById("explore-trends");
    ul.innerHTML = `<li class="list-group-item text-center">Carregando...</li>`;

    const res = await api("explore/trends.php");

    if (!res.ok) {
        ul.innerHTML = `<li class="list-group-item text-danger">Erro ao carregar tendências</li>`;
        return;
    }

    ul.innerHTML = "";

    res.data.forEach(tag => {
        ul.innerHTML += `
            <li class="list-group-item explore-tag"
                onclick="searchExplore('${tag.tag}')">
                #${tag.tag} — <small>${tag.count} posts</small>
            </li>
        `;
    });
}


/* ============================================================
   8. BUSCAR NO EXPLORAR
   ============================================================ */

async function searchExplore(query) {
    const box = document.getElementById("explore-results");
    box.innerHTML = `<div class="text-center text-secondary">Carregando...</div>`;

    const res = await api("explore/search.php", {
        method: "POST",
        body: JSON.stringify({ query })
    });

    if (!res.ok) {
        box.innerHTML = `<p class="text-danger">Erro na busca</p>`;
        return;
    }

    box.innerHTML = "";

    res.data.forEach(p => {
        box.appendChild(renderPost(p));
    });
}
/* ============================================================
   ECHO — APP.JS COMPLETO
   PARTE 4/8 — LIKES, SALVAR, CONTEXTO, DELETE, MOMENTOS
   ============================================================ */


/* ============================================================
   1. LIKE / DESLIKE
   ============================================================ */

async function toggleLike(postId) {
    const res = await api("posts/like.php", {
        method: "POST",
        body: JSON.stringify({ post_id: postId })
    });

    if (!res.ok) {
        showAlert("Erro ao curtir.", "danger");
        return;
    }

    const msg = res.data.liked ? "Curtido ❤️" : "Descurtido 💔";
    showAlert(msg, "success");

    // Atualiza feed (somente o post afetado)
    loadTimeline(CURRENT_PAGE, true);
}


/* ============================================================
   2. SALVAR / REMOVER DOS SALVOS
   ============================================================ */

async function toggleSave(postId) {
    const res = await api("bookmarks/toggle.php", {
        method: "POST",
        body: JSON.stringify({ post_id: postId })
    });

    if (!res.ok) {
        showAlert("Erro ao salvar.", "danger");
        return;
    }

    const msg = res.data.saved ? "Salvo 🔖" : "Removido dos salvos";
    showAlert(msg, "primary");
}


/* ============================================================
   3. LISTAR SALVOS
   ============================================================ */

async function loadSaved() {
    const box = document.getElementById("saved-list");
    box.innerHTML = `<div class="text-center text-secondary">Carregando...</div>`;

    const res = await api("bookmarks/list.php");

    if (!res.ok) {
        box.innerHTML = `<p class="text-danger">Erro ao carregar salvos.</p>`;
        return;
    }

    box.innerHTML = "";
    res.data.forEach(p => box.appendChild(renderPost(p)));
}


/* ============================================================
   4. DELETAR POST (APENAS SE FOR O AUTOR)
   ============================================================ */

async function deletePost(postId) {
    if (!confirm("Deseja mesmo excluir este post?")) return;

    const res = await api("posts/delete.php", {
        method: "POST",
        body: JSON.stringify({ post_id: postId })
    });

    if (!res.ok) {
        showAlert("Erro ao excluir.", "danger");
        return;
    }

    showAlert("Post removido com sucesso.", "success");
    loadTimeline(1, true);
}


/* ============================================================
   5. CONTEXTO (NOTAS DE CONTEXTO, IGUAL TWITTER/X)
   ============================================================ */

let CURRENT_CONTEXT_POST = null;

function openContextNotes(postId) {
    CURRENT_CONTEXT_POST = postId;
    loadContextNotes(postId);
    const modal = new bootstrap.Modal(document.getElementById("modalContext"));
    modal.show();
}

async function loadContextNotes(postId) {
    const list = document.getElementById("context-list");
    list.innerHTML = `<div class="text-secondary text-center">Carregando...</div>`;

    const res = await api(`context/list.php?post_id=${postId}`);

    if (!res.ok) {
        list.innerHTML = `<p class="text-danger">Erro ao carregar.</p>`;
        return;
    }

    if (res.data.length === 0) {
        list.innerHTML = `<p class="text-secondary">Nenhuma nota de contexto ainda.</p>`;
        return;
    }

    list.innerHTML = "";
    res.data.forEach(n => list.appendChild(renderContextNote(n)));
}

function renderContextNote(n) {
    const div = document.createElement("div");
    div.className = "card card-body";

    div.innerHTML = `
        <strong>@${n.handle}</strong>
        <p class="mb-1">${escapeHtml(n.body)}</p>
        <div class="d-flex gap-2">
            <button class="btn btn-outline-success btn-sm" onclick="voteContext(${n.id},1)">
                👍
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="voteContext(${n.id},-1)">
                👎
            </button>
            <span class="ms-auto text-secondary">Score: ${n.score}</span>
        </div>
    `;
    return div;
}

async function saveContextNote() {
    const body = document.getElementById("context-body").value.trim();
    if (!body) return;

    const res = await api("context/create.php", {
        method: "POST",
        body: JSON.stringify({
            post_id: CURRENT_CONTEXT_POST,
            body
        })
    });

    if (!res.ok) {
        showAlert("Erro ao enviar contexto.", "danger");
        return;
    }

    document.getElementById("context-body").value = "";
    loadContextNotes(CURRENT_CONTEXT_POST);
}

async function voteContext(id, value) {
    const res = await api("context/vote.php", {
        method: "POST",
        body: JSON.stringify({ note_id: id, value })
    });

    if (!res.ok) {
        showAlert("Erro ao votar.", "danger");
        return;
    }

    loadContextNotes(CURRENT_CONTEXT_POST);
}


/* ============================================================
   6. MOMENTOS (STORIES QUE EXPIRAM EM 24H)
   ============================================================ */

async function createMomento() {
    const fileInput = document.getElementById("composer-image");

    if (fileInput.files.length === 0) {
        showAlert("Selecione uma imagem para criar um Momento.", "warning");
        return;
    }

    const file = fileInput.files[0];
    const base64 = await fileToBase64(file);

    const res = await api("momentos/create.php", {
        method: "POST",
        body: JSON.stringify({
            media: base64
        })
    });

    if (!res.ok) {
        showAlert("Erro ao criar Momento.", "danger");
        return;
    }

    showAlert("Momento publicado!", "success");
    loadMomentos();
}

async function loadMomentos() {
    const strip = document.getElementById("momentos-strip");
    if (!strip) return;

    const res = await api("momentos/list.php");

    if (!res.ok) return;

    strip.innerHTML = "";
    res.data.forEach(m => strip.appendChild(renderMomento(m)));
}

function renderMomento(m) {
    const div = document.createElement("div");

    div.innerHTML = `
        <div class="text-center">
            <img src="https://ui-avatars.com/api/?name=${m.name}"
                 class="momento-avatar">
            <div class="small text-secondary">@${m.handle}</div>
        </div>
    `;

    return div;
}
/* ============================================================
   ECHO — APP.JS COMPLETO
   PARTE 5/8 — AMIGOS, SOLICITAÇÕES, SUGESTÕES, AMIGOS EM COMUM
   ============================================================ */


/* ============================================================
   1. LISTAR AMIGOS (HOME — COLUNA DIREITA)
   ============================================================ */

async function loadFriendsList() {
    const box = document.getElementById("friends-list");
    if (!box) return;

    box.innerHTML = `<div class="text-secondary text-center p-2">Carregando...</div>`;

    const res = await api("friends/list.php");

    if (!res.ok) {
        box.innerHTML = `<div class="text-danger p-2">Erro ao carregar amigos.</div>`;
        return;
    }

    box.innerHTML = "";
    res.data.forEach(f => {
        box.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>@${f.handle}</strong><br>
                    <small class="text-secondary">${f.name}</small>
                </div>
                <button class="btn btn-dark btn-sm"
                        onclick="openChat('${f.handle}')">
                    <i class="bi bi-chat"></i>
                </button>
            </li>
        `;
    });
}


/* ============================================================
   2. SOLICITAR AMIZADE
   ============================================================ */

async function sendFriendRequest(handle) {
    const res = await api("friends/request.php", {
        method: "POST",
        body: JSON.stringify({ handle })
    });

    if (!res.ok) {
        showAlert(res.error || "Erro ao enviar pedido.", "danger");
        return;
    }

    showAlert("Solicitação enviada!", "success");
}


/* ============================================================
   3. LISTAR SOLICITAÇÕES RECEBIDAS (MODAL)
   ============================================================ */

async function loadFriendRequests() {
    const box = document.getElementById("friend-requests");
    if (!box) return;

    box.innerHTML = `<li class="list-group-item text-center text-secondary">Carregando...</li>`;

    const res = await api("friends/requests.php");

    if (!res.ok) {
        box.innerHTML = `<li class="list-group-item text-danger">Erro ao carregar.</li>`;
        return;
    }

    if (res.data.length === 0) {
        box.innerHTML = `<li class="list-group-item text-secondary">Nenhuma solicitação.</li>`;
        return;
    }

    box.innerHTML = "";
    res.data.forEach(r => {
        box.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>@${r.handle}</strong><br>
                    <small>${r.name}</small>
                </div>
                <div class="btn-group">
                    <button class="btn btn-success btn-sm"
                            onclick="acceptFriend('${r.handle}')">
                        Aceitar
                    </button>
                    <button class="btn btn-danger btn-sm"
                            onclick="rejectFriend('${r.handle}')">
                        Recusar
                    </button>
                </div>
            </li>
        `;
    });
}


/* ============================================================
   4. ACEITAR / RECUSAR SOLICITAÇÃO
   ============================================================ */

async function acceptFriend(handle) {
    const res = await api("friends/accept.php", {
        method: "POST",
        body: JSON.stringify({ handle })
    });

    if (!res.ok) {
        showAlert(res.error, "danger");
        return;
    }

    showAlert("Agora vocês são amigos!", "success");
    loadFriendsList();
    loadFriendRequests();
}

async function rejectFriend(handle) {
    const res = await api("friends/reject.php", {
        method: "POST",
        body: JSON.stringify({ handle })
    });

    if (!res.ok) {
        showAlert(res.error, "danger");
        return;
    }

    showAlert("Solicitação recusada.", "secondary");
    loadFriendRequests();
}


/* ============================================================
   5. REMOVER AMIGO
   ============================================================ */

async function removeFriend(handle) {
    if (!confirm("Deseja mesmo remover este amigo?")) return;

    const res = await api("friends/remove.php", {
        method: "POST",
        body: JSON.stringify({ handle })
    });

    if (!res.ok) {
        showAlert("Erro ao remover.", "danger");
        return;
    }

    showAlert("Amigo removido.", "warning");
    loadFriendsList();
}


/* ============================================================
   6. SUGESTÕES DE AMIZADE (IGUAL FACEBOOK)
   ============================================================ */

async function loadFriendSuggestions() {
    const box = document.getElementById("explore-suggest");
    if (!box) return;

    box.innerHTML = `<li class="list-group-item text-center text-secondary">Carregando...</li>`;

    const res = await api("friends/suggestions.php");

    if (!res.ok) {
        box.innerHTML = `<li class="list-group-item text-danger">Erro ao carregar sugestões</li>`;
        return;
    }

    if (res.data.length === 0) {
        box.innerHTML = `<li class="list-group-item text-secondary">Sem sugestões.</li>`;
        return;
    }

    box.innerHTML = "";
    res.data.forEach(s => {
        box.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">

                <div>
                    <strong>@${s.handle}</strong><br>
                    <small class="text-secondary">${s.name}</small><br>
                    <small class="text-info">${s.mutuals} amigos em comum</small>
                </div>

                <button class="btn btn-primary btn-sm"
                        onclick="sendFriendRequest('${s.handle}')">
                    Adicionar
                </button>
            </li>
        `;
    });
}


/* ============================================================
   7. PERFIL – VER AMIGOS EM COMUM
   ============================================================ */

async function loadMutualFriends(handle) {
    const res = await api(`friends/mutual.php?handle=${handle}`);

    if (!res.ok) return 0;

    return res.data.count;
}
/* ============================================================
   ECHO — APP.JS COMPLETO
   PARTE 6/8 — MENSAGENS + SOLICITAR CONVERSA (FACEBOOK STYLE)
   ============================================================ */


/* ============================================================
   1. ABRIR CHAT DE UM USUÁRIO
   ============================================================ */

async function openChat(handle) {
    currentChatUser = handle;

    // Carrega status da amizade + conversa
    const res = await api(`messages/status.php?with=${handle}`);

    if (!res.ok) {
        showAlert("Erro ao abrir conversa", "danger");
        return;
    }

    const box = document.getElementById("chat-box");
    const sendBox = document.getElementById("chat-send-box");

    /* Caso NÃO sejam amigos */
    if (!res.data.is_friend) {

        if (res.data.pending === false) {
            // ainda não há solicitação
            box.innerHTML = `
                <div class="p-3 text-center text-secondary">
                    <h5>@${handle}</h5>
                    <p>Você ainda não é amigo dessa pessoa.</p>
                    <button class="btn btn-primary"
                        onclick="requestChat('${handle}')">
                        Solicitar conversa
                    </button>
                </div>
            `;
        } else if (res.data.pending === "sent") {
            // você enviou solicitação
            box.innerHTML = `
                <div class="p-3 text-center text-secondary">
                    <h5>@${handle}</h5>
                    <p>Sua solicitação de conversa está pendente.</p>
                </div>
            `;
        } else if (res.data.pending === "received") {
            // você recebeu solicitação → aparece aceitar
            box.innerHTML = `
                <div class="p-3 text-center">
                    <h5>@${handle}</h5>
                    <p>Essa pessoa quer conversar com você.</p>

                    <button class="btn btn-success btn-sm"
                        onclick="acceptChat('${handle}')">
                        Aceitar conversa
                    </button>

                    <button class="btn btn-danger btn-sm"
                        onclick="rejectChat('${handle}')">
                        Recusar
                    </button>
                </div>
            `;
        }

        sendBox.classList.add("d-none");
        return;
    }

    /* Se são amigos → carregar histórico */
    sendBox.classList.remove("d-none");
    loadMessages(handle);
}


/* ============================================================
   2. SOLICITAR CONVERSA
   ============================================================ */

async function requestChat(handle) {
    const res = await api("messages/request_chat.php", {
        method: "POST",
        body: JSON.stringify({ handle })
    });

    if (!res.ok) {
        showAlert(res.error, "danger");
        return;
    }

    showAlert("Solicitação enviada!", "success");
    openChat(handle);
}


/* ============================================================
   3. ACEITAR OU RECUSAR SOLICITAÇÃO
   ============================================================ */

async function acceptChat(handle) {
    const res = await api("messages/accept_chat.php", {
        method: "POST",
        body: JSON.stringify({ handle })
    });

    if (!res.ok) {
        showAlert(res.error, "danger");
        return;
    }

    showAlert("Conversa liberada!", "success");
    openChat(handle);
}

async function rejectChat(handle) {
    const res = await api("messages/reject_chat.php", {
        method: "POST",
        body: JSON.stringify({ handle })
    });

    if (!res.ok) {
        showAlert(res.error, "danger");
        return;
    }

    showAlert("Solicitação recusada.", "secondary");
    openChat(handle);
}


/* ============================================================
   4. CARREGAR MENSAGENS DO CHAT
   ============================================================ */

async function loadMessages(handle) {
    const box = document.getElementById("chat-messages");
    box.innerHTML = `<div class="text-secondary text-center p-2">Carregando...</div>`;

    const res = await api(`messages/thread.php?with=${handle}`);

    if (!res.ok) {
        box.innerHTML = `<div class="text-danger p-2">Erro ao carregar mensagens.</div>`;
        return;
    }

    box.innerHTML = "";

    res.data.forEach(msg => {
        const mine = msg.from_handle === myUser.handle;

        box.innerHTML += `
            <div class="msg ${mine ? "msg-me" : "msg-other"}">
                <div class="msg-body">${escapeHTML(msg.body)}</div>
                <div class="msg-time">${formatDate(msg.created_at)}</div>
            </div>
        `;
    });

    box.scrollTop = box.scrollHeight;
}


/* ============================================================
   5. ENVIAR MENSAGEM
   ============================================================ */

async function sendMessage() {
    const input = document.getElementById("chat-input");
    const msg = input.value.trim();

    if (msg === "" || !currentChatUser) return;

    input.value = "";

    const res = await api("messages/send.php", {
        method: "POST",
        body: JSON.stringify({
            to: currentChatUser,
            body: msg
        })
    });

    if (!res.ok) {
        showAlert("Erro ao enviar mensagem.", "danger");
        return;
    }

    loadMessages(currentChatUser);
}
/* ============================================================
   ECHO — APP.JS COMPLETO  
   PARTE 7/8 — EXPLORAR • TENDÊNCIAS • SUGESTÕES • PERIS PÚBLICOS
   ============================================================ */


/* ============================================================
   1. EXPLORAR: POSTS PÚBLICOS
   ============================================================ */

async function loadExplore() {
    const box = document.getElementById("explore-posts");
    box.innerHTML = `<div class="p-3 text-secondary">Carregando...</div>`;

    const res = await api(`explore/public_posts.php`);

    if (!res.ok) {
        box.innerHTML = `<div class="text-danger p-3">Erro ao carregar explorar.</div>`;
        return;
    }

    box.innerHTML = "";

    res.data.forEach(post => {
        box.innerHTML += renderPost(post, false); 
    });
}


/* ============================================================
   2. TENDÊNCIAS (baseado em hashtags e engajamento)
   ============================================================ */

async function loadExploreTrends() {
    const card = document.getElementById("explore-trends");
    if (!card) return;

    const res = await api("explore/trends.php");

    if (!res.ok) {
        card.innerHTML = `<div class="p-2 text-secondary">Sem dados.</div>`;
        return;
    }

    card.innerHTML = "";

    res.data.forEach(t => {
        card.innerHTML += `
            <div class="trend-item p-2">
                <strong>${t.tag}</strong><br>
                <span class="text-secondary small">${t.count} posts</span>
            </div>
        `;
    });
}


/* ============================================================
   3. SUGESTÕES DE AMIZADE (Facebook Style)
   ============================================================ */

async function loadFriendSuggestions() {
    const box = document.getElementById("suggestions-box");
    if (!box) return;

    box.innerHTML = `<div class="p-3 text-secondary">Carregando sugestões...</div>`;

    const res = await api("friends/suggestions.php");

    if (!res.ok) {
        box.innerHTML = `<div class="text-danger p-3">Erro ao carregar sugestões.</div>`;
        return;
    }

    box.innerHTML = "";

    res.data.forEach(s => {
        box.innerHTML += renderSuggestion(s);
    });
}

function renderSuggestion(user) {
    const mutual = user.mutual > 0 ?
        `<div class="small text-secondary">${user.mutual} amigos em comum</div>` :
        `<div class="small text-secondary">• Novo no Echo</div>`;

    return `
        <div class="card mb-2 shadow-sm">
            <div class="card-body d-flex align-items-center gap-2">

                <img src="${user.avatar ?? 'assets/default-avatar.png'}"
                     class="rounded-circle"
                     width="48" height="48">

                <div class="flex-grow-1">
                    <div class="fw-bold">@${user.handle}</div>
                    ${mutual}
                </div>

                <button class="btn btn-primary btn-sm"
                        onclick="sendFriendRequest('${user.handle}')">
                    Adicionar
                </button>
            </div>
        </div>
    `;
}


/* ============================================================
   4. PERFIL PÚBLICO / PRIVADO
   ============================================================ */

async function openProfile(handle) {
    showView("view-profile");

    const box = document.getElementById("profile-body");
    box.innerHTML = `<div class="p-3 text-secondary">Carregando perfil...</div>`;

    const res = await api(`profile/get.php?handle=${handle}`);

    if (!res.ok) {
        box.innerHTML = `<div class="text-danger p-3">Erro ao carregar perfil.</div>`;
        return;
    }

    const p = res.data;
    CURRENT_PROFILE = p;

    renderProfileHeader(p);
    renderProfilePosts(p);
}


/* ============================================================
   5. RENDERIZAÇÃO DO TOPO DO PERFIL (Capa + Avatar + Botões)
   ============================================================ */

function renderProfileHeader(p) {
    const box = document.getElementById("profile-header");

    const mutual = p.mutual > 0
        ? `<span class="text-secondary small">${p.mutual} amigos em comum</span>`
        : `<span class="text-secondary small opacity-50">Perfil</span>`;

    let actionBtn = "";

    if (p.handle === myUser.handle) {
        actionBtn = `<button class="btn btn-secondary btn-sm" onclick="editProfile()">Editar perfil</button>`;
    }
    else if (p.is_friend) {
        actionBtn = `
            <button class="btn btn-danger btn-sm" onclick="removeFriend('${p.handle}')">
                Remover amigo
            </button>
        `;
    }
    else if (p.friend_request === "sent") {
        actionBtn = `<button class="btn btn-secondary btn-sm" disabled>Pedido enviado</button>`;
    }
    else if (p.friend_request === "received") {
        actionBtn = `
            <button class="btn btn-primary btn-sm" onclick="acceptFriend('${p.handle}')">Aceitar</button>
            <button class="btn btn-danger btn-sm" onclick="rejectFriend('${p.handle}')">Recusar</button>
        `;
    }
    else {
        actionBtn = `
            <button class="btn btn-primary btn-sm" onclick="sendFriendRequest('${p.handle}')">
                Adicionar amigo
            </button>
        `;
    }

    box.innerHTML = `
        <div class="profile-wrapper">

            <div class="profile-cover"></div>

            <div class="profile-avatar-box">
                <img src="${p.avatar ?? 'assets/default-avatar.png'}"
                     class="profile-avatar">
            </div>

            <div class="profile-info text-center">
                <h3>${p.name}</h3>
                <p>@${p.handle}</p>
                ${mutual}
                <div class="mt-2">${actionBtn}</div>
            </div>
        </div>
    `;
}


/* ============================================================
   6. CARREGAR POSTS DO PERFIL (PUBLIC / PRIVATE)
   ============================================================ */

function renderProfilePosts(p) {
    const postsBox = document.getElementById("profile-posts");

    if (!p.can_view_posts) {
        postsBox.innerHTML = `
            <div class="p-4 text-center text-secondary">
                Os posts deste perfil são privados.
                <br>
                Adicione como amigo para ver.
            </div>
        `;
        return;
    }

    postsBox.innerHTML = "";

    if (p.posts.length === 0) {
        postsBox.innerHTML = `
            <div class="text-secondary text-center p-3">Nenhum post.</div>
        `;
        return;
    }

    p.posts.forEach(post => {
        postsBox.innerHTML += renderPost(post, false);
    });
}


/* ============================================================
   7. ENVIAR SOLICITAÇÃO DE AMIZADE
   ============================================================ */

async function sendFriendRequest(handle) {
    const res = await api("friends/request.php", {
        method: "POST",
        body: JSON.stringify({ handle })
    });

    if (!res.ok) {
        showAlert(res.error, "danger");
        return;
    }

    showAlert("Pedido enviado!", "success");
    openProfile(handle);
}


/* ============================================================
   8. ACEITAR / RECUSAR / REMOVER AMIZADE
   ============================================================ */

async function acceptFriend(handle) {
    await api("friends/accept.php", {
        method: "POST",
        body: JSON.stringify({ handle })
    });
    openProfile(handle);
}

async function rejectFriend(handle) {
    await api("friends/reject.php", {
        method: "POST",
        body: JSON.stringify({ handle })
    });
    openProfile(handle);
}

async function removeFriend(handle) {
    await api("friends/remove.php", {
        method: "POST",
        body: JSON.stringify({ handle })
    });
    openProfile(handle);
}
/* ============================================================
   ECHO — APP.JS COMPLETO
   PARTE 8/8 — CONFIGURAÇÕES, PERFIL, PRIVACIDADE, TEMA
   ============================================================ */


/* ============================================================
   1. TEMA (DARK/LIGHT)
   ============================================================ */

function toggleTheme() {
    const html = document.documentElement;

    const now = html.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-bs-theme", now);

    localStorage.setItem("echo-theme", now);
}

(function applySavedTheme() {
    const saved = localStorage.getItem("echo-theme");
    if (saved) document.documentElement.setAttribute("data-bs-theme", saved);
})();


/* ============================================================
   2. ABRIR CONFIGURAÇÕES
   ============================================================ */

function openSettings() {
    showView("view-about");

    const box = document.getElementById("settings-box");

    box.innerHTML = `
        <h3 class="fw-bold mb-3">Configurações</h3>

        <div class="card mb-3">
            <div class="card-body">
                <h5 class="mb-2">Privacidade</h5>
                <p class="text-secondary small">
                    Controle quem pode ver seus posts.
                </p>

                <select id="privacy-select" class="form-select" onchange="updatePrivacy()">
                    <option value="public">Público</option>
                    <option value="private">Apenas amigos</option>
                </select>
            </div>
        </div>

        <div class="card mb-3">
            <div class="card-body">
                <h5 class="mb-2">Perfil</h5>

                <label>Nome:</label>
                <input id="edit-name" class="form-control mb-2" value="${myUser.name}">

                <label>Bio:</label>
                <textarea id="edit-bio" class="form-control mb-2">${myUser.bio ?? ""}</textarea>

                <label>Trocar avatar:</label>
                <input id="edit-avatar" type="file" accept="image/*" class="form-control mb-2">

                <button class="btn btn-primary w-100" onclick="saveProfileChanges()">
                    Salvar alterações
                </button>
            </div>
        </div>

        <div class="card">
            <div class="card-body">

                <h5 class="mb-2">Tema</h5>
                <button class="btn btn-secondary w-100" onclick="toggleTheme()">
                    Alternar tema
                </button>
            </div>
        </div>
    `;

    document.getElementById("privacy-select").value = myUser.privacy;
}


/* ============================================================
   3. ALTERAR PRIVACIDADE DA CONTA
   ============================================================ */

async function updatePrivacy() {
    const mode = document.getElementById("privacy-select").value;

    const res = await api("profile/set_privacy.php", {
        method: "POST",
        body: JSON.stringify({ privacy: mode })
    });

    if (!res.ok) {
        showAlert(res.error, "danger");
        return;
    }

    myUser.privacy = mode;
    showAlert("Privacidade atualizada!", "success");
}


/* ============================================================
   4. EDITAR PERFIL COMPLETO (NOME, BIO, AVATAR)
   ============================================================ */

async function saveProfileChanges() {
    const name = document.getElementById("edit-name").value.trim();
    const bio  = document.getElementById("edit-bio").value.trim();
    const file = document.getElementById("edit-avatar").files[0];

    let avatarBase64 = null;

    if (file) {
        avatarBase64 = await fileToBase64(file);
    }

    const res = await api("profile/update.php", {
        method: "POST",
        body: JSON.stringify({
            name,
            bio,
            avatar: avatarBase64
        })
    });

    if (!res.ok) {
        showAlert(res.error, "danger");
        return;
    }

    showAlert("Perfil atualizado!", "success");

    myUser.name = name;
    myUser.bio = bio;
    if (avatarBase64) myUser.avatar = avatarBase64;

    openProfile(myUser.handle);
}


/* ============================================================
   5. NOTIFICAÇÕES DE NOVAS ATIVIDADES
   ============================================================ */

async function checkNotifications() {
    const res = await api("notifications/list.php");

    if (!res.ok) return;

    const hasUnread = res.data.some(n => n.is_read == 0);

    const bell = document.getElementById("nav-notifications");

    if (bell) {
        if (hasUnread) {
            bell.classList.add("text-warning");
        } else {
            bell.classList.remove("text-warning");
        }
    }
}

// Checar a cada 20s
setInterval(checkNotifications, 20000);


/* ============================================================
   6. MARCAR TODAS AS NOTIFICAÇÕES COMO LIDAS
   ============================================================ */

async function clearAllNotifications() {
    await api("notifications/mark_all.php", { method: "POST" });
    loadNotifications();
}


/* ============================================================
   7. AJUDAS UTILITÁRIAS FINAIS
   ============================================================ */

function escapeHTML(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function fileToBase64(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}


/* ============================================================
   8. FINALIZAÇÃO DO SISTEMA
   ============================================================ */

async function initEcho() {
    const token = localStorage.getItem("echo-token");

    if (!token) {
        showLoginScreen();
        return;
    }

    const res = await api("auth/me.php");

    if (!res.ok) {
        localStorage.removeItem("echo-token");
        showLoginScreen();
        return;
    }

    myUser = res.data;

    loadFriendSuggestions();
    loadNotifications();
    loadTimeline(1);

    initSPA(); 
}


// Inicialização principal
document.addEventListener("DOMContentLoaded", initEcho);
