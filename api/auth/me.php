<?php
header("Content-Type: application/json; charset=utf-8");

require __DIR__ . '/../db.php';
require __DIR__ . '/../response.php';
require __DIR__ . '/token.php';

// Pega header Authorization
$headers = apache_request_headers();
$auth = $headers["Authorization"] ?? "";

if (!str_starts_with($auth, "Bearer ")) {
    json_err("Token ausente.", 401);
}

$token = substr($auth, 7);
$uid = verify_token($token);

if (!$uid) {
    json_err("Token inválido ou expirado.", 401);
}

$stmt = $pdo->prepare("SELECT id, name, handle, bio, city, avatar FROM users WHERE id = ?");
$stmt->execute([$uid]);
$user = $stmt->fetch();

json_ok($user);
