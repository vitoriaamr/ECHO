<?php
require_once __DIR__ . '/../../_init.php';

$me  = Auth::requireUser();
$pdo = Database::pdo();

$stmt = $pdo->prepare("
    SELECT fr.from_id AS id, u.handle, u.name, u.city
    FROM friend_requests fr
    JOIN users u ON u.id = fr.from_id
    WHERE fr.to_id=?
    ORDER BY fr.created_at DESC
");
$stmt->execute([$me["id"]]);

json_ok($stmt->fetchAll());
