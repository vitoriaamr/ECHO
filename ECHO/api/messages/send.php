<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$to = strtolower(trim($input['to'] ?? ''));
$body = trim($input['body'] ?? '');
if (!$to || $body==='') json_err('Dados inválidos');

$pdo = Database::pdo();
$stmt = $pdo->prepare("SELECT id FROM users WHERE handle=?"); $stmt->execute([$to]);
$to_id = $stmt->fetchColumn();
if (!$to_id) json_err('Destinatário não encontrado');

$pdo->prepare("INSERT INTO messages (from_user,to_user,body) VALUES (?,?,?)")->execute([$u['id'],$to_id,$body]);
$pdo->prepare("INSERT INTO notifications (user_id,type,from_user) VALUES (?,?,?)")->execute([$to_id,'message',$u['id']]);
json_ok(['id'=>$pdo->lastInsertId()]);
