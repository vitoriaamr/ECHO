<?php
// api/db.php
header('Content-Type: application/json; charset=utf-8');
date_default_timezone_set('America/Sao_Paulo');

$dsn  = 'mysql:host=127.0.0.1;dbname=echo;charset=utf8mb4';
$user = 'root';
$pass = '';

$options = [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
  $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['ok'=>false, 'error'=>'db: '.$e->getMessage()], JSON_UNESCAPED_UNICODE);
  exit;
}

function input_json() {
  $raw = file_get_contents('php://input');
  if ($raw === '' || $raw === false) return [];
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}
function json_ok($data){ echo json_encode(['ok'=>true,'data'=>$data], JSON_UNESCAPED_UNICODE); exit; }
function json_error($msg,$code=400){ http_response_code($code); echo json_encode(['ok'=>false,'error'=>$msg], JSON_UNESCAPED_UNICODE); exit; }
