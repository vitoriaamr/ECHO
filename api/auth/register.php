<?php
// api/auth/register.php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/../db.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);

    $handle   = strtolower(trim($input['handle'] ?? ''));
    $name     = trim($input['name'] ?? '');
    $password = $input['password'] ?? '';

    if ($handle === '' || $name === '' || strlen($password) < 3) {
        echo json_encode(['ok' => false, 'error' => 'Dados inválidos']);
        exit;
    }

    // verifica se já existe
    $stmt = $pdo->prepare("SELECT id FROM users WHERE handle = :h");
    $stmt->execute([':h' => $handle]);
    if ($stmt->fetch()) {
        echo json_encode(['ok' => false, 'error' => 'Usuário já existe']);
        exit;
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("
        INSERT INTO users (handle, name, password_hash)
        VALUES (:h, :n, :p)
    ");
    $stmt->execute([
        ':h' => $handle,
        ':n' => $name,
        ':p' => $hash
    ]);

    $id    = $pdo->lastInsertId();
    $token = bin2hex(random_bytes(16)); // token simples só pra guardar

    echo json_encode([
        'ok'   => true,
        'data' => [
            'user'  => [
                'id'     => (int)$id,
                'handle' => $handle,
                'name'   => $name
            ],
            'token' => $token
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'ok'    => false,
        'error' => 'Erro no servidor: ' . $e->getMessage()
    ]);
}
