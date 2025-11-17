<?php
require_once __DIR__ . '/../../_init.php';

$me  = Auth::requireUser();
$pdo = Database::pdo();

$input = json_decode(file_get_contents("php://input"), true);
$id = (int)($input["id"] ?? 0);

if (!$id) json_err("id obrigatório");

// remover dos dois lados
$pdo->prepare("DELETE FROM friends WHERE user_id=? AND friend_id=?")
    ->execute([$me["id"], $id]);

$pdo->prepare("DELETE FROM friends WHERE user_id=? AND friend_id=?")
    ->execute([$id, $me["id"]]);

json_ok("Amizade removida");
