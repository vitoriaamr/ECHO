<?php
require_once __DIR__.'/../_init.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$handle = strtolower(trim($input['handle'] ?? ''));
$pass   = $input['password'] ?? '';
if (!$handle || !$pass) json_err('Informe credenciais');

$pdo = Database::pdo();
$stmt = $pdo->prepare("SELECT * FROM users WHERE handle=?");
$stmt->execute([$handle]);
$u = $stmt->fetch();
if (!$u || !password_verify($pass, $u['password_hash'])) json_err('Credenciais inválidas', 401);

$token = Auth::newToken((int)$u['id']);
unset($u['password_hash'], $u['avatar']);
json_ok(['token'=>$token,'user'=>$u]);
