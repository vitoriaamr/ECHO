<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../auth/token.php';

$user = require_auth($pdo);
$input = json_input();

$base64 = $input['file'] ?? null;
if (!$base64) json_error("Arquivo não recebido");

$base64 = str_replace("data:image/jpeg;base64,", "", $base64);
$base64 = str_replace("data:image/png;base64,", "", $base64);
$base64 = str_replace(" ", "+", $base64);

$filename = "uploads/" . uniqid("media_") . ".jpg";
$path = __DIR__ . "/../../$filename";

file_put_contents($path, base64_decode($base64));

json_success([
    "url" => $filename
]);
