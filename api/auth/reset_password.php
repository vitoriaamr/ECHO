<?php
require_once __DIR__ . '/../../_init.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);

    $handle = strtolower(trim($input['handle'] ?? ''));
    $password = $input['password'] ?? '';

    if ($handle === '' || strlen($password) < 3) {
        json_err("Dados inválidos");
    }

    $pdo = Database::pdo();

    $stmt = $pdo->prepare("SELECT id FROM users WHERE handle = ? LIMIT 1");
    $stmt->execute([$handle]);
    $user = $stmt->fetch();

    if (!$user) json_err("Usuário não encontrado");

    $hash = password_hash($password, PASSWORD_BCRYPT);

    $pdo->prepare("UPDATE users SET password_hash = ? WHERE handle = ?")
        ->execute([$hash, $handle]);

    json_ok("Senha atualizada");

} catch (Throwable $e) {
    json_err("Erro interno: " . $e->getMessage());
}
