<?php
require_once __DIR__ . '/../../_init.php';

$me = Auth::requireUser();
$pdo = Database::pdo();

$input = json_decode(file_get_contents("php://input"), true);
$id = (int)($input["post_id"] ?? 0);

if (!$id) json_err("post_id obrigatório");

// só pode deletar o que é dele
$stmt = $pdo->prepare("DELETE FROM posts WHERE id=? AND author_id=?");
$stmt->execute([$id, $me["id"]]);

json_ok("Post removido");
