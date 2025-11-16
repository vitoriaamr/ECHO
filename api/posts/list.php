<?php
require_once __DIR__ . '/../_init.php';

$pdo = Database::pdo();

// Traz posts + nome e handle do autor
$sql = "SELECT p.id, p.content, p.visibility, p.circle_id, p.created_at,
               u.handle, u.name
        FROM posts p
        JOIN users u ON u.id = p.author_id
        ORDER BY p.id DESC";
$rows = $pdo->query($sql)->fetchAll();

json_ok($rows);
