<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$pdo = Database::pdo();
$stmt = $pdo->query("SELECT m.id,m.author_id,u.handle,u.name,m.created_at
                     FROM momentos m JOIN users u ON u.id=m.author_id
                     WHERE m.expire_at > NOW()
                     ORDER BY m.created_at DESC");
json_ok($stmt->fetchAll());
