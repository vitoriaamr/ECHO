<?php
require_once __DIR__.'/../_init.php';
$u = Auth::requireUser();
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$note_id = (int)($input['note_id'] ?? 0);
$val = (int)($input['value'] ?? 0); // +1 ou -1
if (!$note_id || !in_array($val,[1,-1],true)) json_err('Dados inválidos');

$pdo = Database::pdo();
$pdo->prepare("INSERT INTO context_votes (note_id,user_id,value) VALUES (?,?,?)
               ON DUPLICATE KEY UPDATE value=VALUES(value)")
    ->execute([$note_id,$u['id'],$val]);

// recalc score
$score = $pdo->prepare("SELECT COALESCE(SUM(value),0) FROM context_votes WHERE note_id=?");
$score->execute([$note_id]); $s = (int)$score->fetchColumn();
$pdo->prepare("UPDATE context_notes SET score=? WHERE id=?")->execute([$s,$note_id]);

json_ok(['score'=>$s]);
