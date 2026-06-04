<?php
// Grava uma resposta e/ou o progresso. Recebe JSON { senha_id, modulo_id, valor, etapa, modulo }.
header('Content-Type: application/json; charset=utf-8');
$cfg = require __DIR__ . '/config.php';
$pdo = new PDO("mysql:host={$cfg['db_host']};dbname={$cfg['db_nome']};charset=utf8mb4", $cfg['db_user'], $cfg['db_senha'],
  [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

$d = json_decode(file_get_contents('php://input'), true);
$senhaId = (int)($d['senha_id'] ?? 0);
if (!$senhaId) { echo json_encode(['ok' => false]); exit; }

if (isset($d['modulo_id'])) {
  $st = $pdo->prepare('INSERT INTO respostas (senha_id, modulo_id, valor) VALUES (?, ?, ?)
                       ON DUPLICATE KEY UPDATE valor = VALUES(valor)');
  $st->execute([$senhaId, $d['modulo_id'], json_encode($d['valor'], JSON_UNESCAPED_UNICODE)]);
}
if (isset($d['etapa'])) {
  $st = $pdo->prepare('INSERT INTO progresso (senha_id, etapa, modulo) VALUES (?, ?, ?)
                       ON DUPLICATE KEY UPDATE etapa = VALUES(etapa), modulo = VALUES(modulo)');
  $st->execute([$senhaId, (int)$d['etapa'], (int)($d['modulo'] ?? 0)]);
}
echo json_encode(['ok' => true]);
