<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../auth/token.php';

$user = require_auth($pdo);
$input = json_input();

$content    = trim($input['content'] ?? '');
$visibility = $input['visibility'] ?? 'public';
$circle_id  = $input['circle_id'] ?? null;
$media      = $input['media'] ?? null;

if (!$content && !$media) {
    json_error("Post vazio: adicione texto ou imagem.");
}

$stmt = $pdo->prepare("
    INSERT INTO posts (author_id, content, visibility, circle_id)
    VALUES (?, ?, ?, ?)
");
$stmt->execute([$user['id'], $content, $visibility, $circle_id]);
$post_id = $pdo->lastInsertId();

/* Se tiver mídia */
if ($media) {
    $stmt2 = $pdo->prepare("
        INSERT INTO post_media (post_id, media_url, media_type)
        VALUES (?, ?, 'image')
    ");
    $stmt2->execute([$post_id, $media]);
}

json_success([
    "post_id" => $post_id,
    "message" => "Post publicado com sucesso!"
]);
