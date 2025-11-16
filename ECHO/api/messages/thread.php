<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$with = strtolower(trim($_GET['with'] ?? ''));
if (!$with) json_err('with obrigatório');

$pdo = Database::pdo();
$stmt = $pdo->prepare("SELECT id FROM users WHERE handle=?"); $stmt->execute([$with]);
$wid = $stmt->fetchColumn();
if (!$wid) json_err('Usuário não encontrado');

$q = $pdo->prepare("SELECT m.*, fu.handle AS from_handle, tu.handle AS to_handle
  FROM messages m 
  JOIN users fu ON fu.id=m.from_user
  JOIN users tu ON tu.id=m.to_user
  WHERE (m.from_user=? AND m.to_user=?) OR (m.from_user=? AND m.to_user=?)
  ORDER BY m.created_at ASC");
$q->execute([$u['id'],$wid,$wid,$u['id']]);
json_ok($q->fetchAll());
