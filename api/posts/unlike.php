<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../auth/token.php';

$user = require_auth($pdo);
$input = json_input();
$post_id = intval($input['post_id'] ?? 0);

$stmt = $pdo->prepare("DELETE FROM post_likes WHERE user_id=? AND post_id=?");
$stmt->execute([$user['id'], $post_id]);

json_success(["message" => "Descurtido"]);
