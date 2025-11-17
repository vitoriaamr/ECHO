<?php
require_once __DIR__ . '/../_init.php';
$u = Auth::requireUser();

$input = json_decode(file_get_contents('php://input'), true);
$post_id = (int)($input['post_id'] ?? 0);
$body    = trim($input['body'] ?? '');

if (!$post_id || $body === '') json_err('Dados inválidos');

$pdo = Database::pdo();
$pdo->prepare("
  INSERT INTO comments (post_id, author_id, body)
  VALUES (?, ?, ?)
")->execute([$post_id, $u['id'], $body]);

$id = $pdo->lastInsertId();

$c = $pdo->prepare("
  SELECT c.id, c.body, c.created_at,
         u.handle, u.name
  FROM comments c
  JOIN users u ON u.id = c.author_id
  WHERE c.id = ?
");
$c->execute([$id]);

json_ok($c->fetch());
