<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../auth/token.php';

$user = require_auth();

// Ler JSON enviado
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) json_error('JSON inválido.');

// Sanitizar valores
$name  = trim($input['name'] ?? '');
$bio   = trim($input['bio']  ?? '');
$city  = trim($input['city'] ?? '');
$avatar = $input['avatar'] ?? null;

if (!$name) json_error("Nome obrigatório.");

// Converter avatar base64 → arquivo
$avatarPath = $user['avatar']; // mantém o atual
if ($avatar) {

    if (!preg_match('/^data:image\/(\w+);base64,/', $avatar, $m)) {
        json_error("Formato de imagem inválido.");
    }

    $ext = $m[1];
    $data = substr($avatar, strpos($avatar, ',') + 1);
    $data = base64_decode($data);

    if (!$data) json_error("Falha ao decodificar imagem.");

    $fileName = "avatar_" . $user['id'] . "." . $ext;
    $filePath = __DIR__ . "/../../uploads/avatars/$fileName";

    if (!is_dir(__DIR__ . "/../../uploads/avatars")) {
        mkdir(__DIR__ . "/../../uploads/avatars", 0777, true);
    }

    file_put_contents($filePath, $data);

    $avatarPath = "uploads/avatars/$fileName";
}

// Atualizar perfil
$stmt = $pdo->prepare("
    UPDATE users
    SET name = ?, bio = ?, city = ?, avatar = ?
    WHERE id = ?
");
$stmt->execute([$name, $bio, $city, $avatarPath, $user['id']]);

json_ok([
    "message" => "Perfil atualizado.",
    "avatar" => $avatarPath
]);
