<?php
require_once __DIR__ . '/../../_init.php';

$me   = Auth::requireUser();
$pdo  = Database::pdo();
$with = strtolower(trim($_GET["with"] ?? ""));

if ($with === "") json_err("Parametro with obrigatório");

$stmt = $pdo->prepare("SELECT id FROM users WHERE handle=? LIMIT 1");
$stmt->execute([$with]);
$other = $stmt->fetchColumn();

if (!$other) json_err("Usuário não existe");

// permissão: precisa ser amigo ou ter solicitação aceita
$isFriend = $pdo->prepare("SELECT 1 FROM friends WHERE user_id=? AND friend_id=?");
$isFriend->execute([$me["id"], $other]);

$reqAcc = $pdo->prepare("SELECT 1 FROM message_requests WHERE from_id=? AND to_id=?");
$reqAcc->execute([$other, $me["id"]]);

if (!$isFriend->fetch() && !$reqAcc->fetch())
    json_err("Vocês não podem conversar");

// carregar conversa
$q = $pdo->prepare("
    SELECT m.*, fu.handle AS from_handle, tu.handle AS to_handle
    FROM messages m
    JOIN users fu ON fu.id=m.from_user
    JOIN users tu ON tu.id=m.to_user
    WHERE (from_user=? AND to_user=?) OR (from_user=? AND to_user=?)
    ORDER BY created_at ASC
");
$q->execute([$me["id"], $other, $other, $me["id"]]);

json_ok($q->fetchAll());
