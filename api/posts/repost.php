<?php
require_once __DIR__ . '/../../_init.php';
$me = Auth::requireUser();
$pdo = Database::pdo();

$input = json_decode(file_get_contents("php://input"), true);
$post_id = (int)($input["post_id"] ?? 0);

if (!$post_id) json_err("post_id obrigatório");

// toggle
$ck = $pdo->prepare("SELECT 1 FROM post_reposts WHERE post_id=? AND user_id=?");
$ck->execute([$post_id, $me["id"]]);

if ($ck->fetch()) {
    $pdo->prepare("DELETE FROM post_reposts WHERE post_id=? AND user_id=?")
        ->execute([$post_id, $me["id"]]);

    json_ok(["reposted" => false]);
} else {
    $pdo->prepare("INSERT INTO post_reposts (post_id,user_id) VALUES (?,?)")
        ->execute([$post_id, $me["id"]]);

    // notificação
    $a = $pdo->prepare("SELECT author_id FROM posts WHERE id=?");
    $a->execute([$post_id]);
    $author = $a->fetchColumn();

    if ($author && $author != $me["id"]) {
        $pdo->prepare("
            INSERT INTO notifications (user_id,type,from_user,post_id)
            VALUES (?, 'repost', ?, ?)
        ")
        ->execute([$author, $me["id"], $post_id]);
    }

    json_ok(["reposted" => true]);
}
