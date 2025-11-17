<?php
require_once __DIR__ . '/../../_init.php';

$me  = Auth::requireUser();
$pdo = Database::pdo();

$input = json_decode(file_get_contents("php://input"), true);
$from  = (int)($input["from_id"] ?? 0);

if (!$from) json_err("from_id obrigatório");

// verificar se existe a solicitação
$stmt = $pdo->prepare("SELECT 1 FROM friend_requests WHERE from_id=? AND to_id=?");
$stmt->execute([$from, $me["id"]]);
if (!$stmt->fetch()) json_err("Solicitação não existe");

// remover solicitação
$pdo->prepare("DELETE FROM friend_requests WHERE from_id=? AND to_id=?")
    ->execute([$from, $me["id"]]);

// virar amigos (bidirecional)
$pdo->prepare("INSERT IGNORE INTO friends (user_id, friend_id) VALUES (?,?)")
    ->execute([$me["id"], $from]);

$pdo->prepare("INSERT IGNORE INTO friends (user_id, friend_id) VALUES (?,?)")
    ->execute([$from, $me["id"]]);

json_ok("Agora vocês são amigos");
