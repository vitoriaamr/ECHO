<?php

function json_ok($data = null) {
    echo json_encode([
        "ok" => true,
        "data" => $data
    ]);
    exit;
}

function json_err($msg = "Erro inesperado", $status = 400) {
    http_response_code($status);
    echo json_encode([
        "ok" => false,
        "error" => $msg
    ]);
    exit;
}
