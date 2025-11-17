<?php
require_once __DIR__ . '/../../_init.php';

$me  = Auth::requireUser();
$pdo = Database::pdo();

$stmt = $pdo->prepare("
    SELECT mr.from_id AS id, u.handle, u.name
    FROM message_requests mr
    JOIN users u ON u.id = mr.from_id
    WHERE mr.to_id=?
");
$stmt->execute([$me["id"]]);

json_ok($stmt->fetchAll());
