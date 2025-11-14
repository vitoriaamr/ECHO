<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require __DIR__ . '/../db.php';

try {
    // Lê o JSON enviado pelo fetch
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true);

    if (!is_array($body)) {
        throw new Exception('JSON inválido');
    }

    $handle   = strtolower(trim($body['handle'] ?? ''));
    $password = $body['password'] ?? '';

    if ($handle === '' || $password === '') {
        echo json_encode([
            'ok'    => false,
            'error' => 'Usuário e senha são obrigatórios'
        ]);
        exit;
    }

    // Busca pelo handle (seu campo da tabela)
    $stmt = $pdo->prepare('SELECT id, handle, name, password_hash FROM users WHERE handle = ? LIMIT 1');
    $stmt->execute([$handle]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password_hash'])) {
        // Login inválido
        echo json_encode([
            'ok'    => false,
            'error' => 'Usuário ou senha inválidos'
        ]);
        exit;
    }

    // Gera um token simples só pra fase 2
    $token = bin2hex(random_bytes(20));

    echo json_encode([
        'ok'   => true,
        'data' => [
            'token' => $token,
            'user'  => [
                'id'     => (int)$user['id'],
                'handle' => $user['handle'],
                'name'   => $user['name'],
            ],
        ],
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok'    => false,
        'error' => $e->getMessage(),
    ]);
}
