<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$name = trim($input['name'] ?? '');
if ($name==='') json_err('Nome obrigatório');
$pdo = Database::pdo();
$pdo->prepare("INSERT INTO circles (owner_id,name) VALUES (?,?)")->execute([$u['id'],$name]);
json_ok(['id'=>$pdo->lastInsertId()]);
