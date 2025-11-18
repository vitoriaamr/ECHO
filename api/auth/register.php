<?php
header("Content-Type: application/json; charset=utf-8");

require __DIR__ . '/../db.php';
require __DIR__ . '/../response.php';

$input = json_decode(file_get_contents("php://input"), true);

$name   = trim($input["name"] ?? "");
$handle = trim($input["handle"] ?? "");
$pass   = trim($input["password"] ?? "");

if (!$name || !$handle || !$pass) {
    json_err("Preencha todos os campos.");
}

if (strlen($handle) < 3) {
    json_err("Usuário deve ter ao menos 3 caracteres.");
}

// Verifica se @handle já existe
$stmt = $pdo->prepare("SELECT id FROM users WHERE handle = ?");
$stmt->execute([$handle]);

if ($stmt->fetch()) {
    json_err("Este @usuário já existe.");
}

// insere novo usuário
$stmt = $pdo->prepare("
    INSERT INTO users (handle, name, password_hash)
    VALUES (?, ?, ?)
");

$stmt->execute([
    $handle,
    $name,
    password_hash($pass, PASSWORD_BCRYPT)
]);

json_ok("Conta criada com sucesso.");
