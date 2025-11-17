<?php
require_once __DIR__ . '/../_init.php';

$u = Auth::requireUser();
$pdo = Database::pdo();

$data = json_decode(file_get_contents("php://input"), true);

$post_id = (int)($data['post_id'] ?? 0);
$body = trim($data['body'] ?? '');

if (!$post_id || $body === '') {
    json_err("Dados inválidos");
}

// verificar post
$stmt = $pdo->prepare("
    SELECT author_id, visibility 
    FROM posts 
    WHERE id = ?
");
$stmt->execute([$post_id]);
$post = $stmt->fetch();

if (!$post) json_err("Post não encontrado");

// verificar permissão (visibilidade)
if ($post['visibility'] === 'friends') {

    // verificar se é amigo
    $f = $pdo->prepare("
        SELECT 1 FROM friendships
        WHERE (
            (user1=? AND user2=?) OR 
            (user1=? AND user2=?)
        )
        AND status='accepted'
    ");
    $f->execute([
        $u['id'], $post['author_id'],
        $post['author_id'], $u['id']
    ]);
    $is_friend = (bool)$f->fetchColumn();

    // se não for amigo e não for o dono → bloqueia
    if (!$is_friend && $u['id'] != $post['author_id']) {
        json_err("Você não pode comentar este post");
    }
}

// inserir comentário
$stmt = $pdo->prepare("
    INSERT INTO comments (post_id, user_id, body)
    VALUES (?, ?, ?)
");
$stmt->execute([$post_id, $u['id'], $body]);

$comment_id = $pdo->lastInsertId();

// notificar autor (se não for o mesmo usuário)
if ($post['author_id'] != $u['id']) {
    $pdo->prepare("
        INSERT INTO notifications (user_id, type, from_user, post_id)
        VALUES (?, 'comment', ?, ?)
    ")->execute([$post['author_id'], $u['id'], $post_id]);
}

// retornar comentário formatado
$stmt = $pdo->prepare("
    SELECT 
        c.id,
        c.body,
        c.created_at,
        u.handle,
        u.name
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.id = ?
");
$stmt->execute([$comment_id]);

json_ok($stmt->fetch());
