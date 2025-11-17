<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$pdo = Database::pdo();

$page = max(1, intval($_GET['page'] ?? 1));
$limit = 10;
$offset = ($page - 1) * $limit;

// IDs dos amigos
$fs = $pdo->prepare("SELECT friend_id FROM friends WHERE user_id=?");
$fs->execute([$u['id']]);
$friendIds = array_column($fs->fetchAll(), 'friend_id');

// Adiciona você mesmo
$ids = $friendIds;
$ids[] = $u['id'];

$in = implode(',', array_fill(0, count($ids), '?'));

$sql = "
    SELECT p.id, p.content, p.privacy, p.created_at,
           u.handle, u.name
    FROM posts p
    JOIN users u ON u.id=p.author_id
    WHERE p.author_id IN ($in)
    AND (p.privacy='friends' OR p.privacy='public')
    ORDER BY p.id DESC
    LIMIT $limit OFFSET $offset
";

$stmt = $pdo->prepare($sql);
$stmt->execute($ids);

json_ok($stmt->fetchAll());
