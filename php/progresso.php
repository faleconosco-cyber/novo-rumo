<?php
// Devolve respostas e progresso de uma senha. Recebe ?senha_id=N.
header('Content-Type: application/json; charset=utf-8');
$cfg = require __DIR__ . '/config.php';
$pdo = new PDO("mysql:host={$cfg['db_host']};dbname={$cfg['db_nome']};charset=utf8mb4", $cfg['db_user'], $cfg['db_senha'],
  [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

$senhaId = (int)($_GET['senha_id'] ?? 0);
$resp = [];
$st = $pdo->prepare('SELECT modulo_id, valor FROM respostas WHERE senha_id = ?');
$st->execute([$senhaId]);
foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $r) { $resp[$r['modulo_id']] = json_decode($r['valor'], true); }

$st = $pdo->prepare('SELECT etapa, modulo FROM progresso WHERE senha_id = ?');
$st->execute([$senhaId]);
$prog = $st->fetch(PDO::FETCH_ASSOC) ?: ['etapa' => 1, 'modulo' => 0];

echo json_encode(['respostas' => $resp, 'progresso' => $prog], JSON_UNESCAPED_UNICODE);
