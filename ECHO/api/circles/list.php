<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$pdo = Database::pdo();
$circles = $pdo->prepare("SELECT * FROM circles WHERE owner_id=? ORDER BY created_at DESC");
$circles->execute([$u['id']]);
$data = $circles->fetchAll();

foreach ($data as &$c){
  $m = $pdo->prepare("SELECT u.handle FROM circle_members cm JOIN users u ON u.id=cm.user_id WHERE cm.circle_id=?");
  $m->execute([$c['id']]); $c['members'] = array_column($m->fetchAll(),'handle');
}
json_ok($data);
