<?php
require_once __DIR__ . '/../../_init.php';

$me  = Auth::requireUser();
$pdo = Database::pdo();

$input  = json_decode(file_get_contents("php://input"), true);
$handle = strtolower(trim($input["handle"] ?? ""));

if ($handle === "") json_err("handle obrigatório");

$stmt = $pdo->prepare("SELECT id FROM users WHERE handle=? LIMIT 1");
$stmt->execute([$handle]);
$dest = $stmt->fetchColumn();

if (!$dest) json_err("Usuário não encontrado");
if ($dest == $me["id"]) json_err("Não pode solicitar conversa consigo mesmo");

// já são amigos?
$chk = $pdo->prepare("SELECT 1 FROM friends WHERE user_id=? AND friend_id=?");
$chk->execute([$me["id"], $dest]);

if ($chk->fetch()) json_err("Vocês já são amigos (pode conversar normalmente).");

// já existe solicitação?
$q = $pdo->prepare("SELECT 1 FROM message_requests WHERE from_id=? AND to_id=?");
$q->execute([$me["id"], $dest]);

if ($q->fetch()) json_err("Solicitação já enviada");

// inserir solicitação
$pdo->prepare("INSERT INTO message_requests (from_id,to_id) VALUES (?,?)")
    ->execute([$me["id"], $dest]);

// notificação
$pdo->prepare("
    INSERT INTO notifications (user_id,type,from_user)
    VALUES (?, 'message_request', ?)
")->execute([$dest, $me["id"]]);

json_ok("Solicitação de conversa enviada");
