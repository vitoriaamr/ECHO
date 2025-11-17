<?php
require_once __DIR__ . '/../_init.php';

$u = Auth::requireUser();
$pdo = Database::pdo();

$data = json_decode(file_get_contents("php://input"), true);
$from = strtolower(trim($data['from'] ?? ''));

$stmt = $pdo->prepare("SELECT id FROM users WHERE handle=?");
$stmt->execute([$from]);
$from_id = $stmt->fetchColumn();

if (!$from_id) json_err("Usuário não encontrado");

$pdo->prepare("
    DELETE FROM friendships
    WHERE user1=? AND user2=? AND status='pending'
")->execute([$from_id, $u['id']]);

json_ok(["message" => "Solicitação recusada"]);
