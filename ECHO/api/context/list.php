<?php
require_once __DIR__.'/../_init.php';
Auth::requireUser();
$post_id = (int)($_GET['post_id'] ?? 0);
if (!$post_id) json_err('post_id obrigatório');
$pdo = Database::pdo();
$stmt = $pdo->prepare("SELECT cn.*, u.handle, u.name FROM context_notes cn JOIN users u ON u.id=cn.author_id WHERE post_id=? ORDER BY score DESC, created_at DESC");
$stmt->execute([$post_id]);
json_ok($stmt->fetchAll());
