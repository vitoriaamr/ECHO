<?php
require_once __DIR__ . '/../_init.php';

$u = Auth::requireUser();
$pdo = Database::pdo();

$data = json_decode(file_get_contents("php://input"), true);

$content = trim($data['content'] ?? '');
$visibility = $data['visibility'] ?? 'friends';
$mediaB64 = $data['media'] ?? null;

if ($content === '') {
    json_err("Conteúdo obrigatório");
}

if (!in_array($visibility, ['public', 'friends'])) {
    $visibility = 'friends';
}

// converter mídia base64 (opcional)
$mediaBlob = null;
if ($mediaB64) {
    if (strpos($mediaB64, ',') !== false) {
        $mediaB64 = explode(',', $mediaB64)[1];
    }
    $mediaBlob = base64_decode($mediaB64);
}

// inserir post
$stmt = $pdo->prepare("
    INSERT INTO posts (author_id, content, media, visibility)
    VALUES (?, ?, ?, ?)
");
$stmt->execute([$u['id'], $content, $mediaBlob, $visibility]);

$postId = $pdo->lastInsertId();

// retornar post formatado
$stmt = $pdo->prepare("
    SELECT p.id, p.content, p.visibility, p.created_at,
           u.handle, u.name
    FROM posts p
    JOIN users u ON u.id = p.author_id
    WHERE p.id = ?
");
$stmt->execute([$postId]);
$post = $stmt->fetch();

json_ok($post);
