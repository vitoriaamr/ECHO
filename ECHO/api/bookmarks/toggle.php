<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$post_id = (int)($input['post_id'] ?? 0);
if (!$post_id) json_err('post_id obrigatório');

$pdo = Database::pdo();
$ck = $pdo->prepare("SELECT 1 FROM bookmarks WHERE user_id=? AND post_id=?");
$ck->execute([$u['id'],$post_id]);
if ($ck->fetch()){
  $pdo->prepare("DELETE FROM bookmarks WHERE user_id=? AND post_id=?")->execute([$u['id'],$post_id]);
  json_ok(['saved'=>false]);
} else {
  $pdo->prepare("INSERT INTO bookmarks (user_id,post_id) VALUES (?,?)")->execute([$u['id'],$post_id]);
  json_ok(['saved'=>true]);
}
