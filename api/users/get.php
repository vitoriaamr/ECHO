<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../response.php';
require_once __DIR__ . '/../auth/token.php';

// Verificar autenticação
$user = require_auth();

// Pega handle do usuário a ser visualizado
$handle = $_GET['handle'] ?? '';
if (!$handle) json_error('Handle obrigatório.');

// Buscar dados do usuário
$stmt = $pdo->prepare("SELECT id, handle, name, bio, city, avatar, created_at 
                       FROM users 
                       WHERE handle = ?");
$stmt->execute([$handle]);
$profile = $stmt->fetch();

if (!$profile) json_error('Usuário não encontrado.');

// Verificar se são amigos (para liberar posts privados)
$stmt = $pdo->prepare("
    SELECT 1 FROM friends 
    WHERE (user1_id = ? AND user2_id = ?) 
       OR (user1_id = ? AND user2_id = ?)
");
$stmt->execute([
    $user['id'], $profile['id'],
    $profile['id'], $user['id']
]);
$isFriend = $stmt->fetch() ? true : false;

$profile['is_friend'] = $isFriend;

// Se o perfil é o próprio usuário
$profile['is_me'] = ($user['id'] == $profile['id']);

json_ok($profile);
