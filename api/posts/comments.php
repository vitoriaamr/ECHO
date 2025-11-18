<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../auth/token.php';

$user = require_auth($pdo);

$post_id = intval($_GET['post_id'] ?? 0);

$stmt = $pdo->prepare("
SELECT c.id, c.body, c.created_at,
       u.handle, u.name, u.avatar
FROM post_comments c
JOIN users u ON u.id = c.user_id
WHERE post_id = ?
ORDER BY c.created_at ASC
");
$stmt->execute([$post_id]);

json_success($stmt->fetchAll());
