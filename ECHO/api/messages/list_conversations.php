<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$pdo = Database::pdo();
$q = $pdo->prepare("SELECT IF(m.from_user=?, m.to_user, m.from_user) AS other_id,
   MAX(m.created_at) last_at
   FROM messages m WHERE m.from_user=? OR m.to_user=? GROUP BY other_id ORDER BY last_at DESC");
$q->execute([$u['id'],$u['id'],$u['id']]);
$rows = $q->fetchAll();
foreach ($rows as &$r){
  $u2 = $pdo->prepare("SELECT handle,name FROM users WHERE id=?");
  $u2->execute([$r['other_id']]); $r += $u2->fetch();
}
json_ok($rows);
