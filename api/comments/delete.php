<?php
require_once __DIR__ . '/../_init.php';
$u = Auth::requireUser();

$input = json_decode(file_get_contents('php://input'), true);
$cid = (int)($input['comment_id'] ?? 0);
if (!$cid) json_err('comment_id obrigatório');

$pdo = Database::pdo();

$pdo->prepare("DELETE FROM comments WHERE id=? AND author_id=?")
    ->execute([$cid, $u['id']]);

json_ok();
