<?php
require_once __DIR__ . '/../../_init.php';

$me  = Auth::requireUser();
$pdo = Database::pdo();

// últimas conversas
$q = $pdo->prepare("
    SELECT 
        IF(m.from_user=?, m.to_user, m.from_user) AS other_id,
        MAX(m.created_at) AS last_at
    FROM messages m
    WHERE m.from_user=? OR m.to_user=?
    GROUP BY other_id
    ORDER BY last_at DESC
");
$q->execute([$me["id"], $me["id"], $me["id"]]);

$rows = $q->fetchAll();

foreach ($rows as &$r) {
    $u2 = $pdo->prepare("SELECT handle,name FROM users WHERE id=?");
    $u2->execute([$r["other_id"]]);
    $info = $u2->fetch();

    $r["handle"] = $info["handle"];
    $r["name"]   = $info["name"];

    // pegar última mensagem
    $lm = $pdo->prepare("
        SELECT body FROM messages 
        WHERE (from_user=? AND to_user=?) OR (from_user=? AND to_user=?)
        ORDER BY created_at DESC LIMIT 1
    ");
    $lm->execute([$me["id"], $r["other_id"], $r["other_id"], $me["id"]]);
    $r["last_message"] = $lm->fetchColumn();
}

json_ok($rows);
