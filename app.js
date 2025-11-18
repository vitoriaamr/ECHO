/* ============================================
   ECHO • APP.JS — PARTE 1
   Config • Sessão • Auth • Utils
============================================ */

const API = "http://localhost/echo/api/";
let TOKEN = localStorage.getItem("echo_token") || null;
let ME = null;

/* --- Fetch Wrapper --- */
async function request(endpoint, method = "GET", body = null) {
    const cfg = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": TOKEN ? `Bearer ${TOKEN}` : ""
        }
    };
    if (body) cfg.body = JSON.stringify(body);

    const r = await fetch(API + endpoint, cfg);
    return r.json();
}

/* --- Toast --- */
function toast(msg, type = "primary") {
    const el = document.getElementById("toast-body");
    const box = document.getElementById("echoToast");
    const toastObj = new bootstrap.Toast(box);

    el.innerHTML = msg;
    box.className = `toast align-items-center text-bg-${type} border-0`;
    toastObj.show();
}

/* --- Theme --- */
function applyTheme() {
    const t = localStorage.getItem("echo_theme") || "dark";
    document.documentElement.setAttribute("data-bs-theme", t);
}
function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-bs-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", next);
    localStorage.setItem("echo_theme", next);
}

/* ============================================
   LOGIN
============================================ */
async function doLogin() {
    const handle = document.getElementById("login-user").value.trim().toLowerCase();
    const pass   = document.getElementById("login-pass").value.trim();

    if (!handle || !pass) return toast("Preencha usuário e senha", "warning");

    const btn = document.getElementById("btn-login");
    const txt = btn.querySelector(".btn-text");
    const spin = btn.querySelector(".spinner-border");

    btn.disabled = true;
    txt.classList.add("d-none");
    spin.classList.remove("d-none");

    const res = await request("auth/login.php", "POST", { handle, password: pass });

    btn.disabled = false;
    txt.classList.remove("d-none");
    spin.classList.add("d-none");

    if (!res.ok) return toast(res.error || "Erro no login", "danger");

    TOKEN = res.data.token;
    localStorage.setItem("echo_token", TOKEN);
    window.location.href = "home.html";
}

/* ============================================
   REGISTRO
============================================ */
async function doRegister() {
    const name   = document.getElementById("reg-name").value.trim();
    const handle = document.getElementById("reg-user").value.trim().toLowerCase();
    const pass   = document.getElementById("reg-pass").value.trim();

    if (!name || !handle || pass.length < 3)
        return toast("Dados inválidos", "warning");

    const res = await request("auth/register.php", "POST", {
        name, handle, password: pass
    });

    if (!res.ok) return toast(res.error || "Erro ao registrar", "danger");

    TOKEN = res.data.token;
    localStorage.setItem("echo_token", TOKEN);
    window.location.href = "home.html";
}

/* ============================================
   RESET SENHA
============================================ */
async function doReset() {
    const handle = document.getElementById("reset-user").value.trim().toLowerCase();
    const pass   = document.getElementById("reset-pass").value.trim();

    if (!handle || pass.length < 3)
        return toast("Dados inválidos", "warning");

    const res = await request("auth/reset_password.php", "POST", {
        handle, password: pass
    });

    if (!res.ok) return toast(res.error, "danger");

    toast("Senha atualizada!", "success");
}

/* ============================================
   SESSION / ME
============================================ */
async function loadMe() {
    if (!TOKEN) return null;

    const res = await request("me.php");

    if (!res.ok) {
        TOKEN = null;
        localStorage.removeItem("echo_token");
        return null;
    }

    ME = res.data;
    const navName = document.getElementById("nav-name");
    if (navName) navName.innerText = ME.name;

    return ME;
}

/* ============================================
   LOGOUT
============================================ */
function doLogout() {
    TOKEN = null;
    localStorage.removeItem("echo_token");
    window.location.href = "login.html";
}

/* ============================================
   INIT BOOTSTRAP
============================================ */
document.addEventListener("DOMContentLoaded", async () => {
    applyTheme();

    /* página de login */
    if (document.getElementById("form-login")) {
        document.getElementById("form-login")
            .addEventListener("submit", e => (e.preventDefault(), doLogin()));

        document.getElementById("form-register")
            ?.addEventListener("submit", e => (e.preventDefault(), doRegister()));

        document.getElementById("form-reset")
            ?.addEventListener("submit", e => (e.preventDefault(), doReset()));

        return;
    }

    /* página HOME */
    if (!TOKEN) return window.location.href = "login.html";

    await loadMe();
});
/* ============================================
   POSTS — Criar
============================================ */
async function createPost() {
    const text = document.getElementById("composer-text").value.trim();
    const imgFile = document.getElementById("composer-image").files[0];

    if (!text && !imgFile)
        return toast("Escreva algo ou envie uma imagem", "warning");

    let imageBase64 = null;

    if (imgFile) {
        imageBase64 = await new Promise((resolve) => {
            const r = new FileReader();
            r.onloadend = () => resolve(r.result);
            r.readAsDataURL(imgFile);
        });
    }

    const res = await request("posts/create.php", "POST", {
        content: text,
        image: imageBase64,
        visibility: document.getElementById("composer-vis").value
    });

    if (!res.ok) return toast(res.error, "danger");

    document.getElementById("composer-text").value = "";
    document.getElementById("composer-image").value = "";
    toast("Publicado!", "success");

    loadFeed();
}

/* ============================================
   POSTS — Renderização
============================================ */
function renderPost(p) {
    const img = p.image_url 
        ? `<img src="${p.image_url}" class="img-fluid rounded mt-2">`
        : "";

    return `
    <div class="card shadow-sm mb-3">
        <div class="card-body">

            <div class="d-flex align-items-center gap-2 mb-2">
                <img src="${p.avatar || 'default.png'}" class="rounded-circle" width="42" height="42">
                <div>
                    <div class="fw-bold">${p.name}</div>
                    <div class="text-secondary small">@${p.handle}</div>
                </div>
            </div>

            <p class="mb-2">${p.content}</p>

            ${img}

            <div class="d-flex gap-3 mt-3">

                <button class="btn btn-outline-primary btn-sm"
                    onclick="toggleLike(${p.id})">
                    <i class="bi bi-heart${p.liked ? '-fill' : ''}"></i> 
                    ${p.likes}
                </button>

                <button class="btn btn-outline-secondary btn-sm"
                    onclick="openComments(${p.id})">
                    <i class="bi bi-chat-left-text"></i>
                    ${p.comments}
                </button>

                <button class="btn btn-outline-success btn-sm"
                    onclick="toggleSave(${p.id})">
                    <i class="bi bi-bookmark${p.saved ? '-fill' : ''}"></i>
                </button>

                ${p.author_id == ME.id 
                    ? `<button class="btn btn-outline-danger btn-sm"
                           onclick="deletePost(${p.id})">
                           <i class="bi bi-trash"></i>
                       </button>`
                    : ""
                }
            </div>
        </div>
    </div>`;
}

/* ============================================
   POSTS — FEED
============================================ */
async function loadFeed() {
    const box = document.getElementById("feed");
    if (!box) return;

    box.innerHTML = `<div class="text-center py-5 text-secondary">Carregando...</div>`;

    const res = await request("posts/feed.php");

    if (!res.ok) {
        box.innerHTML = `<div class="text-danger text-center py-5">${res.error}</div>`;
        return;
    }

    if (!res.data.length) {
        box.innerHTML = `<div class="text-center py-5 text-secondary">Nenhum post ainda</div>`;
        return;
    }

    box.innerHTML = res.data.map(renderPost).join("");
}

/* ============================================
   POSTS — EXPLORAR
============================================ */
async function loadExplore() {
    const box = document.getElementById("explore");
    if (!box) return;

    box.innerHTML = `<div class="text-center py-5 text-secondary">Carregando...</div>`;

    const res = await request("posts/explore.php");

    if (!res.ok) {
        box.innerHTML = `<div class="text-danger text-center py-5">${res.error}</div>`;
        return;
    }

    if (!res.data.length) {
        box.innerHTML = `<div class="text-center py-5 text-secondary">Nada para explorar</div>`;
        return;
    }

    box.innerHTML = res.data.map(renderPost).join("");
}

/* ============================================
   POSTS — LIKE
============================================ */
async function toggleLike(id) {
    const res = await request("posts/toggle_like.php", "POST", { id });

    if (!res.ok) return toast(res.error, "danger");

    loadFeed();
    loadExplore();
}

/* ============================================
   POSTS — SAVE
============================================ */
async function toggleSave(id) {
    const res = await request("posts/toggle_save.php", "POST", { id });

    if (!res.ok) return toast(res.error, "danger");

    toast(res.data.saved ? "Salvo!" : "Removido dos salvos", "primary");
}

/* ============================================
   POSTS — DELETE
============================================ */
async function deletePost(id) {
    if (!confirm("Deseja excluir este post?")) return;

    const res = await request("posts/delete.php", "POST", { id });

    if (!res.ok) return toast(res.error, "danger");

    toast("Post removido", "success");
    loadFeed();
}
