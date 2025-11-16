<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$post_id = (int)($input['post_id'] ?? 0);
if (!$post_id) json_err('post_id obrigatório');

$pdo = Database::pdo();
$pdo->prepare("DELETE FROM posts WHERE id=? AND author_id=?")->execute([$post_id,$u['id']]);
json_ok();