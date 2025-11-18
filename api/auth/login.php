<?php
header("Content-Type: application/json; charset=utf-8");

require __DIR__ . '/../db.php';
require __DIR__ . '/../response.php';
require __DIR__ . '/token.php';

// JSON recebido
$input = json_decode(file_get_contents("php://input"), true);

$handle = trim($input["handle"] ?? "");
$pass   = trim($input["password"] ?? "");

if (!$handle || !$pass) {
    json_err("Preencha usuário e senha.");
}

// Buscar usuário
$stmt = $pdo->prepare("SELECT id, password_hash, name, handle, avatar FROM users WHERE handle = ?");
$stmt->execute([$handle]);
$user = $stmt->fetch();

if (!$user) {
    json_err("Usuário não encontrado.");
}

if (!password_verify($pass, $user["password_hash"])) {
    json_err("Senha incorreta.");
}

$token = make_token($user["id"]);

// resposta final
json_ok([
    "token" => $token,
    "user"  => $user
]);
