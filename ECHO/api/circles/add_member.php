<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$circle_id = (int)($input['circle_id'] ?? 0);
$handle = strtolower(trim($input['handle'] ?? ''));
if (!$circle_id || !$handle) json_err('Dados faltando');

$pdo = Database::pdo();
$uid = $pdo->prepare("SELECT id FROM users WHERE handle=?");
$uid->execute([$handle]);
$mid = $uid->fetchColumn();
if (!$mid) json_err('Usuário não encontrado');

$pdo->prepare("INSERT IGNORE INTO circle_members (circle_id,user_id) VALUES (?,?)")->execute([$circle_id,$mid]);
json_ok();
