<?php
require_once __DIR__ . '/../../_init.php';

$me = Auth::requireUser();
$pdo = Database::pdo();

$handle = strtolower(trim($_GET['handle'] ?? ''));
if (!$handle) json_err("handle obrigatório");

// Buscar o perfil
$stmt = $pdo->prepare("SELECT id, handle, name, bio, city, privacy, created_at FROM users WHERE handle=? LIMIT 1");
$stmt->execute([$handle]);
$profile = $stmt->fetch();

if (!$profile) json_err("Usuário não encontrado");

// Verificar amizade
$stmt = $pdo->prepare("SELECT 1 FROM friends WHERE user_id=? AND friend_id=?");
$stmt->execute([$me['id'], $profile['id']]);
$isFriend = (bool)$stmt->fetch();

// Verificar solicitação enviada
$stmt = $pdo->prepare("SELECT 1 FROM friend_requests WHERE from_id=? AND to_id=?");
$stmt->execute([$me['id'], $profile['id']]);
$requested = (bool)$stmt->fetch();

// Contar amigos
$stmt = $pdo->prepare("SELECT COUNT(*) FROM friends WHERE user_id=?");
$stmt->execute([$profile['id']]);
$friendsCount = (int)$stmt->fetchColumn();

// Amigos em comum
$stmt = $pdo->prepare("
    SELECT COUNT(*) FROM friends f1
    JOIN friends f2 ON f1.friend_id = f2.friend_id
    WHERE f1.user_id=? AND f2.user_id=?
");
$stmt->execute([$me['id'], $profile['id']]);
$commonFriends = (int)$stmt->fetchColumn();

// Posts que o visitante pode ver
if ($isFriend || $profile['privacy'] === 'public') {

    $posts = $pdo->prepare("
        SELECT p.*, u.handle, u.name
        FROM posts p
        JOIN users u ON u.id = p.author_id
        WHERE author_id=?
        ORDER BY p.created_at DESC
    ");
    $posts->execute([$profile['id']]);
    $posts = $posts->fetchAll();

} else {
    $posts = []; // perfil privado sem amizade
}

// Resposta final
json_ok([
    'profile' => $profile,
    'isFriend' => $isFriend,
    'requested' => $requested,
    'friends_count' => $friendsCount,
    'common_friends' => $commonFriends,
    'posts' => $posts
]);
