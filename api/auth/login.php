<?php
require_once __DIR__ . '/../../_init.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) json_err("JSON inválido");

    $handle   = strtolower(trim($input['handle'] ?? ''));
    $password = $input['password'] ?? '';

    if ($handle === '' || $password === '') {
        json_err("Usuário e senha obrigatórios");
    }

    $pdo = Database::pdo();

    // Buscar usuário
    $stmt = $pdo->prepare("SELECT * FROM users WHERE handle = ? LIMIT 1");
    $stmt->execute([$handle]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        json_err("Usuário ou senha inválidos");
    }

    // Gerar token
    $token = Auth::newToken($user['id']);

    unset($user['password_hash'], $user['avatar']);

    json_ok([
        'token' => $token,
        'user'  => $user
    ]);

} catch (Throwable $e) {
    json_err("Erro interno: " . $e->getMessage(), 500);
}
