<?php
require_once __DIR__ . '/../../_init.php';

$user = Auth::requireUser();

// Remover dados sensíveis
unset($user['password_hash'], $user['avatar']);

json_ok($user);
