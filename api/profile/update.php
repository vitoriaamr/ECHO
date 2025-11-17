<?php
require_once __DIR__ . '/../../_init.php';

$me = Auth::requireUser();
$pdo = Database::pdo();

$input = json_decode(file_get_contents("php://input"), true);

$name   = trim($input["name"] ?? '');
$bio    = trim($input["bio"] ?? '');
$city   = trim($input["city"] ?? '');
$privacy = $input["privacy"] ?? 'private';
$avatar64 = $input["avatar"] ?? null;

if ($name === '') json_err("Nome obrigatório");

$avatarBlob = null;
if ($avatar64) $avatarBlob = base64_to_blob($avatar64);

if ($avatarBlob) {
    $stmt = $pdo->prepare("UPDATE users SET name=?, bio=?, city=?, privacy=?, avatar=? WHERE id=?");
    $stmt->execute([$name, $bio, $city, $privacy, $avatarBlob, $me['id']]);
} else {
    $stmt = $pdo->prepare("UPDATE users SET name=?, bio=?, city=?, privacy=? WHERE id=?");
    $stmt->execute([$name, $bio, $city, $privacy, $me['id']]);
}

json_ok("Perfil atualizado");
