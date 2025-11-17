<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Response.php';

class Auth {

    // Recupera usuário a partir do token Bearer
    public static function userFromToken(?string $bearer) {
        if (!$bearer) return null;

        $token = trim(str_replace('Bearer', '', $bearer));
        if ($token === '') return null;

        $pdo = Database::pdo();

        $stmt = $pdo->prepare("
            SELECT u.*
            FROM sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.token = ?
              AND (s.expires_at IS NULL OR s.expires_at > NOW())
        ");
        $stmt->execute([$token]);

        return $stmt->fetch();
    }

    // Exige estar logado
    public static function requireUser() {
        $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $user = self::userFromToken($auth);

        if (!$user) {
            json_err('Não autenticado', 401);
        }

        return $user;
    }

    // Cria novo token de sessão
    public static function newToken(int $userId): string {
        $token = bin2hex(random_bytes(32));

        $pdo = Database::pdo();
        $stmt = $pdo->prepare("
            INSERT INTO sessions (user_id, token, expires_at)
            VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
        ");
        $stmt->execute([$userId, $token]);

        return $token;
    }
}
