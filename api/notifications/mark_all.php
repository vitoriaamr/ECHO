<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
Database::pdo()->prepare("UPDATE notifications SET is_read=1 WHERE user_id=?")->execute([$u['id']]);
json_ok();
