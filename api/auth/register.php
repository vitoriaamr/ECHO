<?php
require_once __DIR__.'/../_init.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$handle = strtolower(trim($input['handle'] ?? ''));
$name   = trim($input['name'] ?? '');
$pass   = $input['password'] ?? '';

if (!$handle || !$name || strlen($pass) < 3) json_err('Dados inválidos');
$pdo = Database::pdo();

// verifica duplicado
$ck = $pdo->prepare("SELECT id FROM users WHERE handle=?");
$ck->execute([$handle]);
if ($ck->fetch()) json_err('Usuário já existe', 409);

$hash = password_hash($pass, PASSWORD_DEFAULT);
$ins = $pdo->prepare("INSERT INTO users (handle,name,password_hash) VALUES (?,?,?)");
$ins->execute([$handle,$name,$hash]);
$id = (int)$pdo->lastInsertId();

$token = Auth::newToken($id);
json_ok(['token'=>$token,'user'=>['id'=>$id,'handle'=>$handle,'name'=>$name]]);
