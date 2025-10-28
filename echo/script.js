
let posts = []
const users = JSON.parse(localStorage.getItem("echoUsers")) || {}
const currentUsername = localStorage.getItem("echoCurrentUser")
if (!currentUsername || !users[currentUsername]) {
  window.location.href = "login.html"
}

const currentUser = users[currentUsername]
const userProfile = {
  name: currentUser.name,
  bio: currentUser.bio,
  avatar: currentUser.avatar,
  city: currentUser.city || "",
}

if (!currentUser.friends) currentUser.friends = []
if (!currentUser.friendRequests) currentUser.friendRequests = []
if (!currentUser.sentRequests) currentUser.sentRequests = []

function getAllRegisteredUsers() {
  return Object.keys(users)
    .filter((username) => username !== currentUsername)
    .map((username) => ({
      username: username,
      name: users[username].name,
      avatar: users[username].avatar,
      bio: users[username].bio,
    }))
}

const conversations = currentUser.conversations || {}
let currentChatUser = null


const postInput = document.getElementById("post-input")
const postBtn = document.getElementById("post-btn")
const charCount = document.querySelector(".char-count")
const navItems = document.querySelectorAll(".nav-item")
const views = document.querySelectorAll(".view")
const homeFeed = document.getElementById("home-feed")
const profileFeed = document.getElementById("profile-feed")

const addImageBtn = document.getElementById("add-image-btn")
const imageInput = document.getElementById("image-input")
const imagePreviewContainer = document.getElementById("image-preview-container")
const imagePreview = document.getElementById("image-preview")
const removeImageBtn = document.getElementById("remove-image")
const currentImageData = null

const editProfileBtn = document.getElementById("edit-profile-btn")
const editProfileModal = document.getElementById("edit-profile-modal")
const closeModalBtn = document.getElementById("close-modal")
const saveProfileBtn = document.getElementById("save-profile")
const editNameInput = document.getElementById("edit-name")
const editBioInput = document.getElementById("edit-bio")
const avatarInput = document.getElementById("avatar-input")

const friendsList = document.getElementById("friends-list")
const addFriendModal = document.getElementById("add-friend-modal")
const openAddFriendBtn = document.getElementById("open-add-friend")
const closeAddFriendBtn = document.getElementById("close-add-friend")
const searchUsersInput = document.getElementById("search-users")
const searchResults = document.getElementById("search-results")
const friendRequestsDiv = document.getElementById("friend-requests")

const chatUserName = document.getElementById("chat-user-name")
const chatUserHandle = document.getElementById("chat-user-handle")
const chatModal = document.getElementById("chat-modal")
const chatInput = document.getElementById("chat-input")
const chatMessages = document.getElementById("chat-messages")

function formatMessageTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function updateProfileDisplay() {
  const profileName = document.getElementById("profile-name")
  const profileBio = document.getElementById("profile-bio")
  const profileAvatar = document.getElementById("profile-avatar")
  const profileMeta = document.querySelector(".profile-meta")
  const cityItem = profileMeta.querySelector(".meta-item")
  if (cityItem) {
    cityItem.textContent = userProfile.city ? `📍 ${userProfile.city}` : "📍 localização não definida"
  }

  profileName.textContent = userProfile.name
  profileBio.textContent = userProfile.bio
  profileAvatar.style.backgroundImage = userProfile.avatar ? `url(${userProfile.avatar})` : ""
}

function renderHomeFeed() {
  if (posts.length === 0) {
    homeFeed.innerHTML = `
      <div class="empty-state">
        <p>nenhum post ainda</p>
        <span class="empty-subtitle">comece postando algo</span>
      </div>
    `
    return
  }

  homeFeed.innerHTML = posts
    .map(
      (post, index) => `
    <div class="post-item">
      <div class="post-avatar">
        ${userProfile.avatar ? `<img src="${userProfile.avatar}" alt="Avatar">` : userProfile.name.charAt(0).toUpperCase()}
      </div>
      <div class="post-content">
        <div class="post-header">
          <span class="post-author">${userProfile.name}</span>
          <span class="post-handle">@${currentUsername}</span>
          <span class="post-time">· agora</span>
        </div>
        <div class="post-text">${post.text}</div>
        ${post.image ? `<div class="post-image"><img src="${post.image}" alt="Post Image"></div>` : ""}
        <div class="post-actions">
          <button class="post-action-btn ${post.liked ? "liked" : ""}" onclick="toggleLike(${index})">
            <svg viewBox="0 0 24 24" fill="${post.liked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>${post.likes || 0}</span>
          </button>
          <button class="post-action-btn ${post.reposted ? "reposted" : ""}" onclick="toggleRepost(${index})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="17 1 21 5 17 9"></polyline>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
              <polyline points="7 23 3 19 7 15"></polyline>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            </svg>
            <span>${post.reposts || 0}</span>
          </button>
          <button class="post-action-btn delete-btn" onclick="showDeleteModal(${index})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
    )
    .join("")
}

function renderProfileFeed() {
  if (posts.length === 0) {
    profileFeed.innerHTML = `
      <div class="empty-state">
        <p>nenhum post ainda</p>
        <span class="empty-subtitle">seus posts aparecerão aqui</span>
      </div>
    `
    return
  }

  profileFeed.innerHTML = posts
    .map(
      (post, index) => `
    <div class="post-item">
      <div class="post-avatar">
        ${userProfile.avatar ? `<img src="${userProfile.avatar}" alt="Avatar">` : userProfile.name.charAt(0).toUpperCase()}
      </div>
      <div class="post-content">
        <div class="post-header">
          <span class="post-author">${userProfile.name}</span>
          <span class="post-handle">@${currentUsername}</span>
          <span class="post-time">· agora</span>
        </div>
        <div class="post-text">${post.text}</div>
        ${post.image ? `<div class="post-image"><img src="${post.image}" alt="Post Image"></div>` : ""}
        <div class="post-actions">
          <button class="post-action-btn ${post.liked ? "liked" : ""}" onclick="toggleLike(${index})">
            <svg viewBox="0 0 24 24" fill="${post.liked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>${post.likes || 0}</span>
          </button>
          <button class="post-action-btn ${post.reposted ? "reposted" : ""}" onclick="toggleRepost(${index})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="17 1 21 5 17 9"></polyline>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
              <polyline points="7 23 3 19 7 15"></polyline>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            </svg>
            <span>${post.reposts || 0}</span>
          </button>
          <button class="post-action-btn delete-btn" onclick="showDeleteModal(${index})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
    )
    .join("")
}

function openChat(username) {
  const friend = users[username]
  if (!friend) return

  currentChatUser = {
    username: username,
    name: friend.name,
    avatar: friend.avatar,
  }

  chatUserName.textContent = currentChatUser.name
  chatUserHandle.textContent = `@${username}`

  if (!conversations[username]) {
    conversations[username] = []
  }

  renderChatMessages()
  chatModal.classList.add("active")
  chatInput.focus()
}

function renderChatMessages() {
  if (!currentChatUser) return

  const messages = conversations[currentChatUser.username] || []

  if (messages.length === 0) {
    chatMessages.innerHTML = `
      <div class="chat-empty-state">
        <p>nenhuma mensagem ainda</p>
        <span>comece a conversa com ${currentChatUser.name}</span>
      </div>
    `
    return
  }

  chatMessages.innerHTML = messages
    .map((msg) => {
      const isSent = msg.sender === "me"
      const avatarContent = isSent
        ? userProfile.avatar
          ? `<img src="${userProfile.avatar}" alt="Avatar">`
          : userProfile.name.charAt(0).toUpperCase()
        : currentChatUser.avatar
          ? `<img src="${currentChatUser.avatar}" alt="Avatar">`
          : currentChatUser.name.charAt(0).toUpperCase()

      return `
      <div class="chat-message ${isSent ? "sent" : "received"}">
        <div class="message-avatar">
          ${avatarContent}
        </div>
        <div class="message-content">
          <div class="message-bubble">${msg.text}</div>
          <span class="message-time">${formatMessageTime(msg.timestamp)}</span>
        </div>
      </div>
    `
    })
    .join("")

  
  chatMessages.scrollTop = chatMessages.scrollHeight
}

function sendMessage() {
  const text = chatInput.value.trim()
  if (!text || !currentChatUser) return

  const message = {
    text: text,
    sender: "me",
    timestamp: new Date().toISOString(),
  }

  conversations[currentChatUser.username].push(message)


  currentUser.conversations = conversations
  users[currentUsername] = currentUser
  localStorage.setItem("echoUsers", JSON.stringify(users))

  setTimeout(
    () => {
      const responses = [
        "entendi!",
        "interessante...",
        "concordo totalmente",
        "não tinha pensado nisso",
        "faz sentido",
        "vou pensar sobre isso",
        "obrigado por compartilhar",
        "legal!",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const reply = {
        text: randomResponse,
        sender: "them",
        timestamp: new Date().toISOString(),
      }

      conversations[currentChatUser.username].push(reply)
      currentUser.conversations = conversations
      users[currentUsername] = currentUser
      localStorage.setItem("echoUsers", JSON.stringify(users))
      renderChatMessages()
    },
    Math.random() * 2000 + 1000,
  )

  chatInput.value = ""
  renderChatMessages()
}

openAddFriendBtn.addEventListener("click", () => {
  addFriendModal.classList.add("active")
  renderFriendRequests()
  searchUsersInput.value = ""
  searchResults.innerHTML = ""
})

closeAddFriendBtn.addEventListener("click", () => {
  addFriendModal.classList.remove("active")
})

addFriendModal.addEventListener("click", (e) => {
  if (e.target === addFriendModal) {
    addFriendModal.classList.remove("active")
  }
})

searchUsersInput.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase()

  if (query.length === 0) {
    searchResults.innerHTML = ""
    return
  }

  const allUsers = getAllRegisteredUsers()
  const filtered = allUsers.filter(
    (user) => user.username.toLowerCase().includes(query) || user.name.toLowerCase().includes(query),
  )

  if (filtered.length === 0) {
    searchResults.innerHTML = '<div class="empty-friends">nenhum usuário encontrado</div>'
    return
  }

  searchResults.innerHTML = filtered
    .map((user) => {
      const isFriend = currentUser.friends.includes(user.username)
      const requestSent = currentUser.sentRequests.includes(user.username)

      let buttonHTML = ""
      if (isFriend) {
        buttonHTML = '<button class="btn-add" disabled>amigos</button>'
      } else if (requestSent) {
        buttonHTML = '<button class="btn-add" disabled>solicitação enviada</button>'
      } else {
        buttonHTML = `<button class="btn-add" onclick="sendFriendRequest('${user.username}')">adicionar</button>`
      }

      return `
      <div class="search-result-item">
        <div class="user-avatar">
          ${user.avatar ? `<img src="${user.avatar}" alt="Avatar">` : user.name.charAt(0).toUpperCase()}
        </div>
        <div class="user-info">
          <span class="user-name">${user.name}</span>
          <span class="user-handle">@${user.username}</span>
        </div>
        ${buttonHTML}
      </div>
    `
    })
    .join("")
})

function sendFriendRequest(targetUsername) {
  if (!users[targetUsername]) return

  
  if (!currentUser.sentRequests.includes(targetUsername)) {
    currentUser.sentRequests.push(targetUsername)
  }

  if (!users[targetUsername].friendRequests) {
    users[targetUsername].friendRequests = []
  }
  if (!users[targetUsername].friendRequests.includes(currentUsername)) {
    users[targetUsername].friendRequests.push(currentUsername)
  }

 
  users[currentUsername] = currentUser
  localStorage.setItem("echoUsers", JSON.stringify(users))

  
  searchUsersInput.dispatchEvent(new Event("input"))
}

function renderFriendRequests() {
  if (!currentUser.friendRequests || currentUser.friendRequests.length === 0) {
    friendRequestsDiv.innerHTML = '<div class="empty-friends">nenhuma solicitação pendente</div>'
    return
  }

  friendRequestsDiv.innerHTML = currentUser.friendRequests
    .map((username) => {
      const user = users[username]
      if (!user) return ""

      return `
      <div class="friend-request-item">
        <div class="user-avatar">
          ${user.avatar ? `<img src="${user.avatar}" alt="Avatar">` : user.name.charAt(0).toUpperCase()}
        </div>
        <div class="user-info">
          <span class="user-name">${user.name}</span>
          <span class="user-handle">@${username}</span>
        </div>
        <div class="request-actions">
          <button class="btn-accept" onclick="acceptFriendRequest('${username}')">aceitar</button>
          <button class="btn-reject" onclick="rejectFriendRequest('${username}')">recusar</button>
        </div>
      </div>
    `
    })
    .join("")
}

function acceptFriendRequest(username) {
 
  if (!currentUser.friends.includes(username)) {
    currentUser.friends.push(username)
  }
  if (!users[username].friends) {
    users[username].friends = []
  }
  if (!users[username].friends.includes(currentUsername)) {
    users[username].friends.push(currentUsername)
  }

  
  currentUser.friendRequests = currentUser.friendRequests.filter((u) => u !== username)
  if (users[username].sentRequests) {
    users[username].sentRequests = users[username].sentRequests.filter((u) => u !== currentUsername)
  }

 
  users[currentUsername] = currentUser
  localStorage.setItem("echoUsers", JSON.stringify(users))

  renderFriendRequests()
  renderFriendsList()
}

function rejectFriendRequest(username) {
 
  currentUser.friendRequests = currentUser.friendRequests.filter((u) => u !== username)
  if (users[username].sentRequests) {
    users[username].sentRequests = users[username].sentRequests.filter((u) => u !== currentUsername)
  }


  users[currentUsername] = currentUser
  localStorage.setItem("echoUsers", JSON.stringify(users))


  renderFriendRequests()
}

function toggleLike(index) {
  if (!posts[index].liked) {
    posts[index].liked = true
    posts[index].likes = (posts[index].likes || 0) + 1
  } else {
    posts[index].liked = false
    posts[index].likes = Math.max(0, (posts[index].likes || 0) - 1)
  }
  savePosts()
  renderHomeFeed()
  renderProfileFeed()
}

function toggleRepost(index) {
  if (!posts[index].reposted) {
    posts[index].reposted = true
    posts[index].reposts = (posts[index].reposts || 0) + 1
  } else {
    posts[index].reposted = false
    posts[index].reposts = Math.max(0, (posts[index].reposts || 0) - 1)
  }
  savePosts()
  renderHomeFeed()
  renderProfileFeed()
}

function showDeleteModal(postIndex) {
  const modal = document.getElementById("delete-modal")
  modal.classList.add("active")

  const confirmBtn = document.getElementById("confirm-delete")
  const cancelBtn = document.getElementById("cancel-delete")

  const handleConfirm = () => {
    posts.splice(postIndex, 1)
    savePosts()
    renderHomeFeed()
    renderProfileFeed()
    updatePostsCount()
    modal.classList.remove("active")
    confirmBtn.removeEventListener("click", handleConfirm)
    cancelBtn.removeEventListener("click", handleCancel)
  }

  const handleCancel = () => {
    modal.classList.remove("active")
    confirmBtn.removeEventListener("click", handleConfirm)
    cancelBtn.removeEventListener("click", handleCancel)
  }

  confirmBtn.addEventListener("click", handleConfirm)
  cancelBtn.addEventListener("click", handleCancel)

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      handleCancel()
    }
  })
}

function savePosts() {
  currentUser.posts = posts
  users[currentUsername] = currentUser
  localStorage.setItem("echoUsers", JSON.stringify(users))
}


window.toggleLike = toggleLike
window.toggleRepost = toggleRepost
window.showDeleteModal = showDeleteModal

function renderFriendsList() {
  if (currentUser.friends.length === 0) {
    friendsList.innerHTML = '<div class="empty-friends">nenhum amigo ainda<br>adicione amigos para conversar</div>'
    return
  }

  friendsList.innerHTML = currentUser.friends
    .map((friendUsername) => {
      const friend = users[friendUsername]
      if (!friend) return ""

      return `
        <div class="user-item" data-username="${friendUsername}">
          <div class="user-avatar">
            ${friend.avatar ? `<img src="${friend.avatar}" alt="Avatar">` : friend.name.charAt(0).toUpperCase()}
          </div>
          <div class="user-info">
            <span class="user-name">${friend.name}</span>
            <span class="user-handle">@${friendUsername}</span>
          </div>
          <div class="user-status"></div>
        </div>
      `
    })
    .join("")

  document.querySelectorAll("#friends-list .user-item").forEach((item) => {
    item.addEventListener("click", () => {
      const username = item.getAttribute("data-username")
      openChat(username)
    })
  })
}

postInput.addEventListener("input", () => {
  const length = postInput.value.length
  charCount.textContent = `${length}/280`
  postBtn.disabled = length === 0
})

addImageBtn.addEventListener("click", () => {
  imageInput.click()
})

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      imagePreview.src = event.target.result
      imagePreviewContainer.style.display = "block"
    }
    reader.readAsDataURL(file)
  }
})

removeImageBtn.addEventListener("click", () => {
  imageInput.value = ""
  imagePreview.src = ""
  imagePreviewContainer.style.display = "none"
})

postBtn.addEventListener("click", () => {
  const text = postInput.value.trim()
  if (text) {
    const newPost = {
      text: text,
      image: imagePreview.src || null,
      timestamp: new Date().toISOString(),
      likes: 0,
      reposts: 0,
      liked: false,
      reposted: false,
    }
    posts.unshift(newPost)
    savePosts()
    postInput.value = ""
    imageInput.value = ""
    imagePreview.src = ""
    imagePreviewContainer.style.display = "none"
    charCount.textContent = "0/280"
    postBtn.disabled = true
    renderHomeFeed()
    renderProfileFeed()
    updatePostsCount()
  }
})

function updatePostsCount() {
  const postsCount = document.getElementById("posts-count")
  postsCount.textContent = posts.length
}

editProfileBtn.addEventListener("click", () => {
  editNameInput.value = userProfile.name
  editBioInput.value = userProfile.bio
  document.getElementById("edit-city").value = userProfile.city || ""
  editProfileModal.classList.add("active")
})

closeModalBtn.addEventListener("click", () => {
  editProfileModal.classList.remove("active")
})

editProfileModal.addEventListener("click", (e) => {
  if (e.target === editProfileModal) {
    editProfileModal.classList.remove("active")
  }
})

saveProfileBtn.addEventListener("click", () => {
  userProfile.name = editNameInput.value.trim() || userProfile.name
  userProfile.bio = editBioInput.value.trim() || userProfile.bio
  userProfile.city = document.getElementById("edit-city").value.trim() || ""

  if (avatarInput.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userProfile.avatar = e.target.result
      currentUser.name = userProfile.name
      currentUser.bio = userProfile.bio
      currentUser.avatar = userProfile.avatar
      currentUser.city = userProfile.city
      users[currentUsername] = currentUser
      localStorage.setItem("echoUsers", JSON.stringify(users))
      updateProfileDisplay()
      renderHomeFeed()
      renderProfileFeed()
      editProfileModal.classList.remove("active")
    }
    reader.readAsDataURL(avatarInput.files[0])
  } else {
    currentUser.name = userProfile.name
    currentUser.bio = userProfile.bio
    currentUser.city = userProfile.city
    users[currentUsername] = currentUser
    localStorage.setItem("echoUsers", JSON.stringify(users))
    updateProfileDisplay()
    renderHomeFeed()
    renderProfileFeed()
    editProfileModal.classList.remove("active")
  }
})

navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault()
    const viewName = item.getAttribute("data-view")


    navItems.forEach((nav) => nav.classList.remove("active"))
    views.forEach((view) => view.classList.remove("active"))


    item.classList.add("active")
    const targetView = document.getElementById(`${viewName}-view`)
    if (targetView) {
      targetView.classList.add("active")
    }
  })
})

function logout() {
  if (confirm("deseja sair da sua conta?")) {
    localStorage.removeItem("echoCurrentUser")
    window.location.href = "index.html"
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (currentUser.posts) {
    posts = currentUser.posts
  }

  updateProfileDisplay()
  renderHomeFeed()
  renderProfileFeed()
  updatePostsCount()
  renderFriendsList()

  const profileInfo = document.querySelector(".profile-info")
  const logoutBtn = document.createElement("button")
  logoutBtn.className = "btn-logout"
  logoutBtn.textContent = "sair"
  logoutBtn.addEventListener("click", logout)
  const editBtn = document.querySelector(".btn-edit-profile")
  profileInfo.insertBefore(logoutBtn, editBtn)
})

document.getElementById("close-chat").addEventListener("click", () => {
  chatModal.classList.remove("active")
  currentChatUser = null
})

chatModal.addEventListener("click", (e) => {
  if (e.target === chatModal) {
    chatModal.classList.remove("active")
    currentChatUser = null
  }
})

document.getElementById("send-message-btn").addEventListener("click", sendMessage)

chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
})

window.sendFriendRequest = sendFriendRequest
window.acceptFriendRequest = acceptFriendRequest
window.rejectFriendRequest = rejectFriendRequest
