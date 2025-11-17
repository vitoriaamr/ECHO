<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$post_id = (int)($input['post_id'] ?? 0);
$body = trim($input['body'] ?? '');
if (!$post_id || $body==='') json_err('Dados inválidos');

$pdo = Database::pdo();
$pdo->prepare("INSERT INTO context_notes (post_id,author_id,body) VALUES (?,?,?)")
    ->execute([$post_id,$u['id'],$body]);

// notifica autor do post
$author = $pdo->prepare("SELECT author_id FROM posts WHERE id=?");
$author->execute([$post_id]); $aid = $author->fetchColumn();
if ($aid && $aid != $u['id']){
  $pdo->prepare("INSERT INTO notifications (user_id,type,from_user,post_id) VALUES (?,?,?,?)")
      ->execute([$aid,'context_note',$u['id'],$post_id]);
}
json_ok(['id'=>$pdo->lastInsertId()]);
