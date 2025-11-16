<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
unset($u['password_hash'], $u['avatar']);
json_ok($u);
