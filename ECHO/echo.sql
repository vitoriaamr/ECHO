CREATE DATABASE IF NOT EXISTS echo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE echo;

-- Usuários
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  handle VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  bio VARCHAR(160) DEFAULT '',
  city VARCHAR(80) DEFAULT '',
  avatar LONGBLOB NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Sessões (token)
CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token CHAR(64) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Posts
CREATE TABLE posts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  author_id INT NOT NULL,
  content TEXT NOT NULL,
  media LONGBLOB NULL,
  visibility ENUM('public','followers','circle') DEFAULT 'public',
  circle_id BIGINT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Likes
CREATE TABLE post_likes (
  post_id BIGINT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id,user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Reposts
CREATE TABLE post_reposts (
  post_id BIGINT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id,user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bookmarks (Salvos)
CREATE TABLE bookmarks (
  user_id INT NOT NULL,
  post_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id,post_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Círculos
CREATE TABLE circles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  name VARCHAR(80) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE circle_members (
  circle_id BIGINT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (circle_id,user_id),
  FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Notas de contexto
CREATE TABLE context_notes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  post_id BIGINT NOT NULL,
  author_id INT NOT NULL,
  body VARCHAR(400) NOT NULL,
  score INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE context_votes (
  note_id BIGINT NOT NULL,
  user_id INT NOT NULL,
  value TINYINT NOT NULL, -- +1 ou -1
  PRIMARY KEY (note_id,user_id),
  FOREIGN KEY (note_id) REFERENCES context_notes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Notificações
CREATE TABLE notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,   -- destinatário
  type ENUM('like','repost','context_note','friend_request','message') NOT NULL,
  from_user INT NULL,
  post_id BIGINT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Mensagens
CREATE TABLE messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  from_user INT NOT NULL,
  to_user INT NOT NULL,
  body VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_user) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Momentos (expiram em 24h)
CREATE TABLE momentos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  author_id INT NOT NULL,
  media LONGBLOB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expire_at TIMESTAMP NOT NULL,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Usuários demo
INSERT INTO users (handle,name,password_hash) VALUES
('gabriel','Gabriel',  '$2y$10$0yJ3FADb8R3aGm1v25cNQe3s1rR2fIv1.0m3k8aO3m2TqvTzI1lQO'), -- '123'
('vitoria','Vitória',  '$2y$10$0yJ3FADb8R3aGm1v25cNQe3s1rR2fIv1.0m3k8aO3m2TqvTzI1lQO'); -- '123'
