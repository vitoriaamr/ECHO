<?php
// api/posts/create.php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/../db.php';

try {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);

    if (!$input) {
        echo json_encode(['ok' => false, 'error' => 'JSON inválido']);
        exit;
    }

    $handle  = trim($input['handle'] ?? '');
    $content = trim($input['content'] ?? '');
    $privacy = $input['privacy'] ?? 'public';
    $circle_id = $input['circle_id'] ?? null;

    if ($handle === '' || $content === '') {
        echo json_encode(['ok' => false, 'error' => 'Handle e conteúdo são obrigatórios']);
        exit;
    }

    // pegar usuário
    $stmt = $pdo->prepare("SELECT id, handle, name FROM users WHERE handle = :handle");
    $stmt->execute([':handle' => $handle]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['ok' => false, 'error' => 'Usuário não encontrado']);
        exit;
    }

    // criar post
    $stmt = $pdo->prepare("
        INSERT INTO posts (author_id, content, privacy, circle_id)
        VALUES (:author_id, :content, :privacy, :circle_id)
    ");

    $stmt->execute([
        ':author_id'  => $user['id'],
        ':content'    => $content,
        ':privacy'    => $privacy,
        ':circle_id'  => $circle_id
    ]);

    $postId = $pdo->lastInsertId();

    // retornar o post pronto pro front
    $stmt = $pdo->prepare("
        SELECT 
            p.id,
            p.content,
            p.privacy,
            p.circle_id,
            p.created_at,
            u.handle,
            u.name
        FROM posts p
        JOIN users u ON u.id = p.author_id
        WHERE p.id = :id
    ");
    $stmt->execute([':id' => $postId]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['ok' => true, 'data' => $post]);
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'ok'    => false,
        'error' => 'Erro no servidor: ' . $e->getMessage()
    ]);
    exit;
}
