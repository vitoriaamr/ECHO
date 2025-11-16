<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$pdo = Database::pdo();
$stmt = $pdo->prepare("SELECT n.*, fu.handle AS from_handle FROM notifications n LEFT JOIN users fu ON fu.id=n.from_user WHERE n.user_id=? ORDER BY n.created_at DESC LIMIT 100");
$stmt->execute([$u['id']]);
json_ok($stmt->fetchAll());
