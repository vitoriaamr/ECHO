<?php
require_once __DIR__ . '/../../_init.php';

$me = Auth::requireUser();
$pdo = Database::pdo();

$input = json_decode(file_get_contents("php://input"), true);
$post_id = (int)($input["post_id"] ?? 0);

if (!$post_id) json_err("post_id obrigatório");

$ck = $pdo->prepare("SELECT 1 FROM bookmarks WHERE user_id=? AND post_id=?");
$ck->execute([$me["id"], $post_id]);

if ($ck->fetch()) {
    $pdo->prepare("DELETE FROM bookmarks WHERE user_id=? AND post_id=?")
        ->execute([$me["id"], $post_id]);

    json_ok(["saved" => false]);
} else {
    $pdo->prepare("INSERT INTO bookmarks (user_id,post_id) VALUES (?,?)")
        ->execute([$me["id"], $post_id]);

    json_ok(["saved" => true]);
}
