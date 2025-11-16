<?php
// config.php

$DB_HOST = 'localhost';
$DB_NAME = 'echo_db';
$DB_USER = 'root';
$DB_PASS = '';

try {
    $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Erro na conexão com o banco: ' . $e->getMessage()
    ]);
    exit;
}
p://localhost/echo quando quiser travar
