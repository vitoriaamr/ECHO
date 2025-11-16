<?php
// ---- Config do MySQL (ajuste se seu usuário/senha forem outros)
const DB_HOST = '127.0.0.1';
const DB_NAME = 'echo';
const DB_USER = 'root';
const DB_PASS = '';

// ---- Conexão PDO
class Database {
  public static function pdo(): PDO {
    static $pdo = null;
    if ($pdo === null) {
      $pdo = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4', DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      ]);
    }
    return $pdo;
  }
}

// ---- Helpers JSON
function json_ok($data = []) {
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['ok'=>true,'data'=>$data], JSON_UNESCAPED_UNICODE);
  exit;
}
function json_err($msg = 'Erro') {
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode(['ok'=>false,'error'=>$msg], JSON_UNESCAPED_UNICODE);
  exit;
}

// ---- Util: buscar usuário pelo handle (@)
function getUserByHandle(string $handle) {
  $pdo = Database::pdo();
  $st = $pdo->prepare("SELECT * FROM users WHERE handle = ?");
  $st->execute([$handle]);
  return $st->fetch();
}
