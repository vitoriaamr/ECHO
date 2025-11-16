<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require _DIR_ . '/../db.php'; // mesmo db.php do login/register

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || empty($input['handle']) || empty($input['password'])) {
        throw new Exception('Dados inválidos.');
    }

    $handle = trim(strtolower($input['handle']));
    $password = $input['password'];

    if (strlen($password) < 3) {
        throw new Exception('Senha muito curta.');
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $pdo->beginTransaction();

    $stmt = $pdo->prepare('SELECT id FROM users WHERE handle = :h LIMIT 1');
    $stmt->execute([':h' => $handle]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        $pdo->rollBack();
        throw new Exception('Usuário não encontrado.');
    }

    $stmt = $pdo->prepare('UPDATE users SET password = :p WHERE handle = :h');
    $stmt->execute([
        ':p' => $hash,
        ':h' => $handle
    ]);

    $pdo->commit();

    echo json_encode([
        'ok'   => true,
        'data' => ['message' => 'Senha atualizada.']
    ]);
} catch (Exception $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        'ok'    => false,
        'error' => $e->getMessage()
    ]);
}