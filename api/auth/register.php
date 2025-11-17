<?php
require_once __DIR__ . '/../../_init.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);

    $name     = trim($input['name'] ?? '');
    $handle   = strtolower(trim($input['handle'] ?? ''));
    $password = $input['password'] ?? '';

    if ($name === '' || $handle === '' || strlen($password) < 3) {
        json_err("Dados inválidos");
    }

    $pdo = Database::pdo();

    // Handle existente?
    $chk = $pdo->prepare("SELECT id FROM users WHERE handle = ?");
    $chk->execute([$handle]);
    if ($chk->fetch()) json_err("Usuário já existe");

    // Criar usuário
    $hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("
        INSERT INTO users (handle, name, password_hash)
        VALUES (?, ?, ?)
    ");
    $stmt->execute([$handle, $name, $hash]);

    $id = $pdo->lastInsertId();

    // Criar token de login automático
    $token = Auth::newToken($id);

    json_ok([
        'token' => $token,
        'user' => [
            'id' => (int)$id,
            'handle' => $handle,
            'name' => $name
        ]
    ]);

} catch (Throwable $e) {
    json_err("Erro: " . $e->getMessage());
}
