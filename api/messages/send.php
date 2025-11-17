<?php
require_once __DIR__ . '/../../_init.php';

$me  = Auth::requireUser();
$pdo = Database::pdo();

$input = json_decode(file_get_contents("php://input"), true);
$to_handle = strtolower(trim($input["to"] ?? ""));
$body      = trim($input["body"] ?? "");

if ($to_handle === "" || $body === "")
    json_err("Campos obrigatórios");

// pega id do destino
$stmt = $pdo->prepare("SELECT id FROM users WHERE handle=? LIMIT 1");
$stmt->execute([$to_handle]);
$to = $stmt->fetchColumn();

if (!$to) json_err("Destinatário não encontrado");
if ($to == $me["id"]) json_err("Não pode enviar mensagem para si mesmo");

// checa amizade OU solicitação aceita
$isFriend = $pdo->prepare("SELECT 1 FROM friends WHERE user_id=? AND friend_id=?");
$isFriend->execute([$me["id"], $to]);

$reqAcc = $pdo->prepare("SELECT 1 FROM message_requests WHERE (from_id=? AND to_id=?)");
$reqAcc->execute([$to, $me["id"]]);

if (!$isFriend->fetch() && !$reqAcc->fetch())
    json_err("Vocês não são amigos. Solicite conversa primeiro.");

// enviar
$pdo->prepare("
    INSERT INTO messages (from_user,to_user,body)
    VALUES (?,?,?)
")->execute([$me["id"], $to, $body]);

// notificação
$pdo->prepare("
    INSERT INTO notifications (user_id,type,from_user)
    VALUES (?, 'message', ?)
")->execute([$to, $me["id"]]);

json_ok("Mensagem enviada");
