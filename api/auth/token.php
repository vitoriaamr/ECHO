<?php

// Chave secreta usada para assinar o token
$SECRET = "ECHO_SUPER_KEY_2025"; 
function make_token($user_id) {
    global $SECRET;

    $payload = [
        "uid" => $user_id,
        "exp" => time() + (60 * 60 * 24 * 7) // expira em 7 dias
    ];

    $base = base64_encode(json_encode($payload));
    $signature = hash_hmac("sha256", $base, $SECRET);

    return $base . "." . $signature;
}

function verify_token($token) {
    global $SECRET;

    if (!$token || !str_contains($token, ".")) {
        return false;
    }

    list($base, $signature) = explode(".", $token);

    $valid = hash_hmac("sha256", $base, $SECRET);

    if (!hash_equals($valid, $signature)) {
        return false; // assinatura inválida
    }

    $payload = json_decode(base64_decode($base), true);

    if (!$payload || !isset($payload["uid"]) || !isset($payload["exp"])) {
        return false;
    }

    if ($payload["exp"] < time()) {
        return false; // expirado
    }

    return $payload["uid"];
}
