<?php
require_once __DIR__ . '/../_init.php';
$u = Auth::requireUser();

$input = json_decode(file_get_contents('php://input'), true);
$cid = (int)($input['comment_id'] ?? 0);
if (!$cid) json_err('comment_id obrigatório');

$pdo = Database::pdo();

$ck = $pdo->prepare("SELECT 1 FROM comment_likes WHERE comment_id=? AND user_id=?");
$ck->execute([$cid, $u['id']]);

if ($ck->fetch()) {
    $pdo->prepare("DELETE FROM comment_likes WHERE comment_id=? AND user_id=?")->execute([$cid, $u['id']]);
    json_ok(['liked' => false]);
} else {
    $pdo->prepare("INSERT INTO comment_likes (comment_id, user_id) VALUES (?,?)")->execute([$cid, $u['id']]);
    json_ok(['liked' => true]);
}
