<?php
require_once __DIR__ . '/../../_init.php';

$me  = Auth::requireUser();
$pdo = Database::pdo();

$stmt = $pdo->prepare("
    SELECT u.id, u.handle, u.name, u.city
    FROM friends f
    JOIN users u ON u.id = f.friend_id
    WHERE f.user_id=?
    ORDER BY u.name ASC
");
$stmt->execute([$me["id"]]);

json_ok($stmt->fetchAll());
