<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
Database::pdo()->prepare("DELETE FROM notifications WHERE user_id=?")->execute([$u['id']]);
json_ok();
