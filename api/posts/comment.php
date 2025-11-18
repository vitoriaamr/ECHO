<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../auth/token.php';

$user = require_auth($pdo);
$input = json_input();

$post_id = intval($input['post_id'] ?? 0);
$body = trim($input['body'] ?? '');

if (!$post_id || !$body) json_error("Dados incompletos");

$stmt = $pdo->prepare("
    INSERT INTO post_comments (user_id, post_id, body)
    VALUES (?, ?, ?)
");
$stmt->execute([$user['id'], $post_id, $body]);

json_success(["message" => "Comentário enviado"]);
