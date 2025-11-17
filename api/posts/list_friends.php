<?php
require_once __DIR__ . '/../_init.php';

$u = Auth::requireUser();
$pdo = Database::pdo();

// Página atual
$page = max(1, (int)($_GET['page'] ?? 1));
$per_page = 10;
$offset = ($page - 1) * $per_page;

// -------------------------
// 1) Obter lista de amigos
// -------------------------
$stmt = $pdo->prepare("
    SELECT 
        CASE 
            WHEN user1 = ? THEN user2
            ELSE user1
        END AS friend_id
    FROM friendships
    WHERE (user1 = ? OR user2 = ?)
      AND status = 'accepted'
");
$stmt->execute([$u['id'], $u['id'], $u['id']]);
$friend_ids = array_column($stmt->fetchAll(), 'friend_id');

// Sempre incluir o próprio usuário
$friend_ids[] = $u['id'];

if (count($friend_ids) == 0) {
    json_ok([
        "posts" => [],
        "has_more" => false
    ]);
}

// Cria placeholders para IN(...)
$placeholders = implode(',', array_fill(0, count($friend_ids), '?'));

// ------------------------------
// 2) Buscar posts dos amigos
//    com algoritmo de relevância
// ------------------------------
$sql = "
SELECT 
    p.id,
    p.author_id,
    p.content,
    p.media,
    p.visibility,
    p.created_at,
    u.handle,
    u.name,

    -- contagem de curtidas
    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes,

    -- contagem de comentários
    (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments,

    -- score de relevância
    (
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) * 2 +
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) * 4 -
        TIMESTAMPDIFF(HOUR, p.created_at, NOW())
    ) AS score

FROM posts p
JOIN users u ON u.id = p.author_id
WHERE p.author_id IN ($placeholders)
ORDER BY score DESC, p.created_at DESC
LIMIT $per_page OFFSET $offset
";

$stmt = $pdo->prepare($sql);
$stmt->execute($friend_ids);

$posts = $stmt->fetchAll();

// ------------------------------
// 3) Verificar se há mais posts
// ------------------------------
$stmt2 = $pdo->prepare("
    SELECT COUNT(*)
    FROM posts
    WHERE author_id IN ($placeholders)
");
$stmt2->execute($friend_ids);

$total_posts = (int)$stmt2->fetchColumn();

$has_more = ($offset + $per_page) < $total_posts;

json_ok([
    "posts" => $posts,
    "has_more" => $has_more
]);
