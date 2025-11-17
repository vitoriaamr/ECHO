<?php
require_once __DIR__ . '/../../_init.php';

$me  = Auth::requireUser();
$pdo = Database::pdo();

$input = json_decode(file_get_contents("php://input"), true);
$from  = (int)($input["from_id"] ?? 0);

if (!$from) json_err("from_id obrigatório");

// verificar solicitação
$stmt = $pdo->prepare("SELECT 1 FROM message_requests WHERE from_id=? AND to_id=?");
$stmt->execute([$from, $me["id"]]);

if (!$stmt->fetch()) json_err("Solicitação não existe");

// aceitar → remove da tabela
$pdo->prepare("DELETE FROM message_requests WHERE from_id=? AND to_id=?")
    ->execute([$from, $me["id"]]);

json_ok("Solicitação de conversa aceita");
