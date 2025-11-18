<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../auth/token.php';

$user = require_auth($pdo);
$input = json_input();

$stmt = $pdo->prepare("INSERT IGNORE INTO post_saves (user_id, post_id) VALUES (?, ?)");
$stmt->execute([$user['id'], $input['post_id']]);

json_success(["message" => "Post salvo"]);
