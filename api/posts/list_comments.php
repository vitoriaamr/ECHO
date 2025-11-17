<?php
require_once __DIR__ . '/../_init.php';

$u = Auth::requireUser();
$pdo = Database::pdo();

$post_id = (int)($_GET['post_id'] ?? 0);
if (!$post_id) json_err("post_id obrigatório");

// pegar comentários
$stmt = $pdo->prepare("
SELECT 
    c.id,
    c.body,
    c.created_at,
    c.user_id,
    u.handle,
    u.name,
    u.avatar
FROM comments c
JOIN users u ON u.id = c.user_id
WHERE c.post_id = ?
ORDER BY c.created_at ASC
");
$stmt->execute([$post_id]);

$comments = $stmt->fetchAll();
json_ok($comments);
