<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$pdo = Database::pdo();
$sql = "SELECT p.id,p.author_id,u.handle,u.name,p.content,p.visibility,p.circle_id,p.created_at
        FROM bookmarks b JOIN posts p ON p.id=b.post_id
        JOIN users u ON u.id=p.author_id
        WHERE b.user_id=? ORDER BY b.created_at DESC";
$stmt = $pdo->prepare($sql); $stmt->execute([$u['id']]);
json_ok($stmt->fetchAll());
