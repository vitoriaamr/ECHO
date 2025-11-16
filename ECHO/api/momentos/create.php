<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$mediaB64 = $input['media'] ?? null;
if (!$mediaB64) json_err('media obrigatória (base64)');

$blob = base64_to_blob($mediaB64);
$pdo = Database::pdo();
$pdo->prepare("INSERT INTO momentos (author_id,media,expire_at) VALUES (?,?,DATE_ADD(NOW(), INTERVAL 24 HOUR))")
    ->execute([$u['id'],$blob]);
json_ok(['id'=>$pdo->lastInsertId()]);
