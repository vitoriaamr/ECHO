<?php
require_once __DIR__ . '/../../_init.php';

$me  = Auth::requireUser();
$pdo = Database::pdo();

// sugestões = todos usuários menos:
// - eu mesmo
// - meus amigos
// - quem mandei solicitação
// - quem me mandou solicitação

$stmt = $pdo->prepare("
    SELECT 
        u.id, u.handle, u.name, u.city, u.bio,
        
        -- amigos em comum
        (
            SELECT COUNT(*)
            FROM friends f1
            JOIN friends f2 ON f1.friend_id = f2.friend_id
            WHERE f1.user_id = ? AND f2.user_id = u.id
        ) AS common_friends

    FROM users u
    WHERE u.id != ?
      AND u.id NOT IN (SELECT friend_id FROM friends WHERE user_id = ?)
      AND u.id NOT IN (SELECT to_id FROM friend_requests WHERE from_id = ?)
      AND u.id NOT IN (SELECT from_id FROM friend_requests WHERE to_id = ?)

    ORDER BY common_friends DESC, u.name ASC
    LIMIT 20
");
$stmt->execute([$me['id'], $me['id'], $me['id'], $me['id'], $me['id']]);

json_ok($stmt->fetchAll());
