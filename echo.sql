DROP DATABASE IF EXISTS echo;
CREATE DATABASE echo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE echo;

/* ============================================================
   USERS
   ============================================================ */
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  handle VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  bio VARCHAR(160) DEFAULT '',
  city VARCHAR(80) DEFAULT '',
  avatar LONGBLOB NULL,
  privacy ENUM('public','private') DEFAULT 'private',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

/* ============================================================
   SESSIONS
   ============================================================ */
CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token CHAR(64) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* ============================================================
   FRIEND REQUESTS
   ============================================================ */
CREATE TABLE friend_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_id INT NOT NULL,
  to_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(from_id,to_id),
  FOREIGN KEY (from_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_id) REFERENCES users(id) ON DELETE CASCADE
);

/* ============================================================
   FRIENDS
   ============================================================ */
CREATE TABLE friends (
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(user_id, friend_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
);

/* ============================================================
   POSTS
   ============================================================ */
CREATE TABLE posts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  author_id INT NOT NULL,
  content TEXT NOT NULL,
  media LONGBLOB NULL,
  visibility ENUM('public','private') DEFAULT 'private',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

/* ============================================================
   LIKES
   ============================================================ */
CREATE TABLE post_likes (
  post_id BIGINT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id,user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* ============================================================
   REPOSTS
   ============================================================ */
CREATE TABLE post_reposts (
  post_id BIGINT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id,user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* ============================================================
   BOOKMARKS
   ============================================================ */
CREATE TABLE bookmarks (
  user_id INT NOT NULL,
  post_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id,post_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

/* ============================================================
   NOTIFICATIONS
   ============================================================ */
CREATE TABLE notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('like','repost','friend_request','message','context_note') NOT NULL,
  from_user INT NULL,
  post_id BIGINT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* ============================================================
   MESSAGES + MESSAGE REQUESTS
   ============================================================ */
CREATE TABLE messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  from_user INT NOT NULL,
  to_user INT NOT NULL,
  body VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_user) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE message_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_user INT NOT NULL,
  to_user INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(from_user,to_user),
  FOREIGN KEY (from_user) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_user) REFERENCES users(id) ON DELETE CASCADE
);

/* ============================================================
   MOMENTOS (STORIES)
   ============================================================ */
CREATE TABLE momentos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  author_id INT NOT NULL,
  media LONGBLOB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expire_at TIMESTAMP NOT NULL,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

/* ============================================================
   CONTEXT NOTES
   ============================================================ */
CREATE TABLE context_notes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  post_id BIGINT NOT NULL,
  author_id INT NOT NULL,
  body VARCHAR(400) NOT NULL,
  score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE context_votes (
  note_id BIGINT NOT NULL,
  user_id INT NOT NULL,
  value TINYINT NOT NULL,
  PRIMARY KEY (note_id,user_id),
  FOREIGN KEY (note_id) REFERENCES context_notes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* ============================================================
   FAKE USERS (SENHA: 123)
   ============================================================ */
INSERT INTO users (handle,name,password_hash,privacy,city,bio) VALUES
('gabriel','Gabriel Negri','$2y$10$0yJ3FADb8R3aGm1v25cNQe3s1rR2fIv1.0m3k8aO3m2TqvTzI1lQO','private','Presidente Prudente','Criador do Echo'),
('vitoria','Vitória Almeida','$2y$10$0yJ3FADb8R3aGm1v25cNQe3s1rR2fIv1.0m3k8aO3m2TqvTzI1lQO','private','Presidente Prudente','Apaixonada por design'),
('ana','Ana Clara','$2y$10$0yJ3FADb8R3aGm1v25cNQe3s1rR2fIv1.0m3k8aO3m2TqvTzI1lQO','public','São Paulo','Fotógrafa'),
('bruno','Bruno Lopes','$2y$10$0yJ3FADb8R3aGm1v25cNQe3s1rR2fIv1.0m3k8aO3m2TqvTzI1lQO','public','Curitiba','Gamer e streamer'),
('carla','Carla Mendes','$2y$10$0yJ3FADb8R3aGm1v25cNQe3s1rR2fIv1.0m3k8aO3m2TqvTzI1lQO','private','Rio de Janeiro','Musculação e dieta'),
('diego','Diego Souza','$2y$10$0yJ3FADb8R3aGm1v25cNQe3s1rR2fIv1.0m3k8aO3m2TqvTzI1lQO','public','Belo Horizonte','Programador'),
('elisa','Elisa Martins','$2y$10$0yJ3FADb8R3aGm1v25cNQe3s1rR2fIv1.0m3k8aO3m2TqvTzI1lQO','public','Salvador','Estudante de medicina'),
('felipe','Felipe Rocha','$2y$10$0yJ3FADb8R3aGm1v25cNQe3s1rR2fIv1.0m3k8aO3m2TqvTzI1lQO','public','Florianópolis','Surfista');

/* ============================================================
   FRIENDSHIPS
   ============================================================ */
INSERT INTO friends VALUES
(1,2),(2,1),
(1,3),(3,1),
(2,3),(3,2),
(4,5),(5,4),
(6,7),(7,6);

/* ============================================================
   PUBLIC POSTS (para EXPLORAR)
   ============================================================ */
INSERT INTO posts (author_id,content,visibility) VALUES
(3,'Foto nova no meu portfólio!','public'),
(4,'Zerei o novo jogo ontem 🔥','public'),
(6,'Dica de programação: aprenda async/await','public'),
(7,'Hoje foi dia de plantão no hospital 😷','public'),
(8,'Ondas perfeitas hoje em Floripa 🌊','public');

/* ============================================================
   PRIVATE POSTS (feed de amigos)
   ============================================================ */
INSERT INTO posts (author_id,content,visibility) VALUES
(1,'Primeiro post no Echo!','private'),
(2,'Estudando Figma hoje 😄','private'),
(3,'Só amigos podem ver isso 😊','private'),
(5,'Treino pesado ✔','private');
