<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../auth/token.php';

$user = require_auth($pdo);

// FEED GERAL POR ENQUANTO
$stmt = $pdo->query("
SELECT
    p.id, p.content, p.visibility, p.circle_id, p.created_at,
    u.name, u.handle, u.avatar,
    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes,
    (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) AS comments,
    (SELECT COUNT(*) FROM post_saves WHERE post_id = p.id) AS saves,
    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND user_id = {$user['id']}) AS has_liked,
    (SELECT COUNT(*) FROM post_saves WHERE post_id = p.id AND user_id = {$user['id']}) AS has_saved
FROM posts p
JOIN users u ON p.author_id = u.id
ORDER BY p.id DESC
LIMIT 50
");
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

/* Buscar imagens de cada post */
foreach ($posts as &$p) {
    $st2 = $pdo->prepare("SELECT media_url, media_type FROM post_media WHERE post_id = ?");
    $st2->execute([$p['id']]);
    $p['media'] = $st2->fetchAll(PDO::FETCH_ASSOC);
}

json_success($posts);
