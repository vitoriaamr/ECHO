
const users = JSON.parse(localStorage.getItem("echoUsers")) || {
  vitoria: {
    username: "vitoria",
    password: "123",
    name: "vitória",
    bio: "bio vazia",
    avatar: null,
    posts: [],
    conversations: {},
  },
  gabriel: {
    username: "gabriel",
    password: "123",
    name: "gabriel",
    bio: "bio vazia",
    avatar: null,
    posts: [],
    conversations: {},
  },
}


localStorage.setItem("echoUsers", JSON.stringify(users))

const loginForm = document.getElementById("login-form")
const registerForm = document.getElementById("register-form")
const showRegisterBtn = document.getElementById("show-register")
const showLoginBtn = document.getElementById("show-login")
const loginBtn = document.getElementById("login-btn")
const registerBtn = document.getElementById("register-btn")
const authError = document.getElementById("auth-error")

function showError(message) {
  authError.textContent = message
  authError.classList.add("show")
  setTimeout(() => {
    authError.classList.remove("show")
  }, 3000)
}

showRegisterBtn.addEventListener("click", (e) => {
  e.preventDefault()
  loginForm.classList.remove("active")
  registerForm.classList.add("active")
})

showLoginBtn.addEventListener("click", (e) => {
  e.preventDefault()
  registerForm.classList.remove("active")
  loginForm.classList.add("active")
})

loginBtn.addEventListener("click", () => {
  const username = document.getElementById("login-username").value.trim().toLowerCase()
  const password = document.getElementById("login-password").value

  if (!username || !password) {
    showError("preencha todos os campos")
    return
  }

  const user = users[username]
  if (!user) {
    showError("usuário não encontrado")
    return
  }

  if (user.password !== password) {
    showError("senha incorreta")
    return
  }

  localStorage.setItem("echoCurrentUser", username)
  window.location.href = "home.html"
})

registerBtn.addEventListener("click", () => {
  const name = document.getElementById("register-name").value.trim()
  const username = document.getElementById("register-username").value.trim().toLowerCase()
  const password = document.getElementById("register-password").value

  if (!name || !username || !password) {
    showError("preencha todos os campos")
    return
  }

  if (username.length < 3) {
    showError("usuário deve ter pelo menos 3 caracteres")
    return
  }

  if (password.length < 3) {
    showError("senha deve ter pelo menos 3 caracteres")
    return
  }

  if (users[username]) {
    showError("usuário já existe")
    return
  }


  users[username] = {
    username: username,
    password: password,
    name: name,
    bio: "bio vazia",
    avatar: null,
    posts: [],
    conversations: {},
  }

  localStorage.setItem("echoUsers", JSON.stringify(users))
  localStorage.setItem("echoCurrentUser", username)
  window.location.href = "home.html"
})


document.getElementById("login-password").addEventListener("keypress", (e) => {
  if (e.key === "Enter") loginBtn.click()
})

document.getElementById("register-password").addEventListener("keypress", (e) => {
  if (e.key === "Enter") registerBtn.click()
})
