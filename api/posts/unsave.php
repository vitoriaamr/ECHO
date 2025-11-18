<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../auth/token.php';

$user = require_auth($pdo);
$input = json_input();

$stmt = $pdo->prepare("DELETE FROM post_saves WHERE user_id=? AND post_id=?");
$stmt->execute([$user['id'], $input['post_id']]);

json_success(["message" => "Post removido dos salvos"]);
