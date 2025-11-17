<?php
require_once __DIR__ . '/../_init.php';

$u = Auth::requireUser();
$pdo = Database::pdo();

$data = json_decode(file_get_contents("php://input"), true);
$from = strtolower(trim($data['from'] ?? ''));

// buscar ID da pessoa que enviou
$stmt = $pdo->prepare("SELECT id FROM users WHERE handle=?");
$stmt->execute([$from]);
$from_id = $stmt->fetchColumn();

if (!$from_id) json_err("Usuário não encontrado");

$pdo->prepare("
    UPDATE friendships
    SET status='accepted'
    WHERE user1=? AND user2=? AND status='pending'
")->execute([$from_id, $u['id']]);

// notificação
$pdo->prepare("
    INSERT INTO notifications (user_id, type, from_user)
    VALUES (?, 'friend_request', ?)
")->execute([$from_id, $u['id']]);

json_ok(["message" => "Agora vocês são amigos"]);
