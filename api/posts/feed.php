<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../auth/verify.php';

$user = verify_token();
$pdo  = Database::getConnection();

$sql = "
SELECT 
    p.id,
    p.content,
    p.visibility,
    p.circle_id,
    p.created_at,
    u.handle,
    u.name,
    u.avatar,
    u.id AS author_id,
    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes,
    (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) AS comments,
    (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND user_id = ?) AS liked
FROM posts p
JOIN users u ON u.id = p.author_id
ORDER BY p.id DESC
";

$stmt = $pdo->prepare($sql);
$stmt->execute([$user]);
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

// buscar imagens
foreach($posts as &$p){
    $stmt2 = $pdo->prepare("SELECT media_url FROM post_media WHERE post_id = ?");
    $stmt2->execute([$p['id']]);
    $p['media'] = $stmt2->fetchAll(PDO::FETCH_COLUMN);
}

echo json_encode($posts);
