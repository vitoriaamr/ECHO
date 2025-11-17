<?php
require_once __DIR__ . '/../../_init.php';
$me = Auth::requireUser();
$pdo = Database::pdo();

$input = json_decode(file_get_contents("php://input"), true);
$post_id = (int)($input["post_id"] ?? 0);

if (!$post_id) json_err("post_id obrigatório");

// toggle
$check = $pdo->prepare("SELECT 1 FROM post_likes WHERE post_id=? AND user_id=?");
$check->execute([$post_id, $me["id"]]);

if ($check->fetch()) {
    // remover like
    $pdo->prepare("DELETE FROM post_likes WHERE post_id=? AND user_id=?")
        ->execute([$post_id, $me["id"]]);

    json_ok(['liked' => false]);
} else {
    // adiciona like
    $pdo->prepare("INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)")
        ->execute([$post_id, $me["id"]]);

    // notificar autor
    $a = $pdo->prepare("SELECT author_id FROM posts WHERE id=?");
    $a->execute([$post_id]);
    $author = $a->fetchColumn();

    if ($author && $author != $me["id"]) {
        $pdo->prepare("
            INSERT INTO notifications (user_id, type, from_user, post_id)
            VALUES (?, 'like', ?, ?)
        ")->execute([$author, $me["id"], $post_id]);
    }

    json_ok(['liked' => true]);
}
