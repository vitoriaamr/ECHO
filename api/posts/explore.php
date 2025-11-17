<?php
require_once __DIR__.'/../_init.php';
Auth::requireUser();
$pdo = Database::pdo();

$page = max(1, intval($_GET['page'] ?? 1));
$limit = 10;
$offset = ($page - 1) * $limit;

$stmt = $pdo->prepare("
    SELECT p.id, p.content, p.created_at, u.handle, u.name
    FROM posts p
    JOIN users u ON u.id=p.author_id
    WHERE p.privacy='public'
    ORDER BY p.id DESC
    LIMIT $limit OFFSET $offset
");
$stmt->execute();

json_ok($stmt->fetchAll());
