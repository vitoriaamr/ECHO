<?php
function json_headers() {
  header('Content-Type: application/json; charset=utf-8');
  header('Access-Control-Allow-Origin: '.CORS_ORIGIN);
  header('Access-Control-Allow-Headers: Authorization, Content-Type');
  header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
}
function json_ok($data = [], int $code = 200) {
  http_response_code($code); json_headers(); echo json_encode(['ok'=>true, 'data'=>$data], JSON_UNESCAPED_UNICODE); exit;
}
function json_err($msg = 'Erro', int $code = 400) {
  http_response_code($code); json_headers(); echo json_encode(['ok'=>false, 'error'=>$msg], JSON_UNESCAPED_UNICODE); exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { json_headers(); exit; }
