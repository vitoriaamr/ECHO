<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$post_id = (int)($input['post_id'] ?? 0);
if (!$post_id) json_err('post_id obrigatório');

$pdo = Database::pdo();
// toggle like
$ck = $pdo->prepare("SELECT 1 FROM post_likes WHERE post_id=? AND user_id=?");
$ck->execute([$post_id,$u['id']]);
if ($ck->fetch()){
  $pdo->prepare("DELETE FROM post_likes WHERE post_id=? AND user_id=?")->execute([$post_id,$u['id']]);
  json_ok(['liked'=>false]);
} else {
  $pdo->prepare("INSERT INTO post_likes (post_id,user_id) VALUES (?,?)")->execute([$post_id,$u['id']]);
  // notificação ao autor
  $a = $pdo->prepare("SELECT author_id FROM posts WHERE id=?");
  $a->execute([$post_id]);
  $author = $a->fetchColumn();
  if ($author && $author != $u['id']){
    $pdo->prepare("INSERT INTO notifications (user_id,type,from_user,post_id) VALUES (?,?,?,?)")
        ->execute([$author,'like',$u['id'],$post_id]);
  }
  json_ok(['liked'=>true]);
}
