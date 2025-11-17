<?php
require_once __DIR__ . '/../../_init.php';

$me  = Auth::requireUser();
$pdo = Database::pdo();

$input  = json_decode(file_get_contents("php://input"), true);
$handle = strtolower(trim($input["handle"] ?? ""));

if ($handle === '') json_err("handle obrigatório");

// pegar id do destino
$stmt = $pdo->prepare("SELECT id FROM users WHERE handle=? LIMIT 1");
$stmt->execute([$handle]);
$to = $stmt->fetchColumn();

if (!$to) json_err("Usuário não encontrado");
if ($to == $me["id"]) json_err("Você não pode se adicionar");

// já são amigos?
$chk = $pdo->prepare("SELECT 1 FROM friends WHERE user_id=? AND friend_id=?");
$chk->execute([$me["id"], $to]);
if ($chk->fetch()) json_err("Vocês já são amigos");

// já existe solicitação?
$req = $pdo->prepare("SELECT 1 FROM friend_requests WHERE from_id=? AND to_id=?");
$req->execute([$me["id"], $to]);
if ($req->fetch()) json_err("Solicitação já enviada");

// inserir solicitação
$pdo->prepare("INSERT INTO friend_requests (from_id,to_id) VALUES (?,?)")
    ->execute([$me["id"], $to]);

// notificar
$pdo->prepare("
    INSERT INTO notifications (user_id, type, from_user)
    VALUES (?, 'friend_request', ?)
")->execute([$to, $me["id"]]);

json_ok("Solicitação enviada");
