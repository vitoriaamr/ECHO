<?php
require_once __DIR__ . '/../../_init.php';

$me = Auth::requireUser();
$pdo = Database::pdo();

$stmt = $pdo->prepare("
    SELECT p.*, u.handle, u.name
    FROM bookmarks b
    JOIN posts p ON p.id=b.post_id
    JOIN users u ON u.id=p.author_id
    WHERE b.user_id=?
    ORDER BY b.created_at DESC
");
$stmt->execute([$me["id"]]);

json_ok($stmt->fetchAll());
