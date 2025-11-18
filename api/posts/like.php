<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../auth/token.php';

$user = require_auth($pdo);
$input = json_input();
$post_id = intval($input['post_id'] ?? 0);

if (!$post_id) json_error("post_id obrigatório");

$stmt = $pdo->prepare("INSERT IGNORE INTO post_likes (user_id, post_id) VALUES (?, ?)");
$stmt->execute([$user['id'], $post_id]);

json_success(["message" => "Curtido"]);
