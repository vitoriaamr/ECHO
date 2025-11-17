<?php
require_once __DIR__ . '/../../_init.php';

$pdo = Database::pdo();

$handle = strtolower(trim($_GET["handle"] ?? ''));
if (!$handle) json_err("handle obrigatório");

$stmt = $pdo->prepare("
    SELECT p.*, u.handle, u.name
    FROM posts p
    JOIN users u ON u.id=p.author_id
    WHERE u.handle=?
    ORDER BY p.created_at DESC
");
$stmt->execute([$handle]);

json_ok($stmt->fetchAll());
