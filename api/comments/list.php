<?php
require_once __DIR__ . '/../_init.php';
$u = Auth::requireUser();

$post_id = (int)($_GET['post_id'] ?? 0);
if (!$post_id) json_err('post_id obrigatório');

$pdo = Database::pdo();
$stmt = $pdo->prepare("
  SELECT c.id, c.body, c.created_at,
         u.handle, u.name,
         (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = c.id) AS likes
  FROM comments c
  JOIN users u ON u.id = c.author_id
  WHERE c.post_id = ?
  ORDER BY c.created_at ASC
");
$stmt->execute([$post_id]);

json_ok($stmt->fetchAll());
