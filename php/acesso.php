<?php
// Valida a senha e o dispositivo. Recebe JSON { senha, fingerprint }. Devolve JSON.
header('Content-Type: application/json; charset=utf-8');
$cfg = require __DIR__ . '/config.php';
$pdo = new PDO("mysql:host={$cfg['db_host']};dbname={$cfg['db_nome']};charset=utf8mb4", $cfg['db_user'], $cfg['db_senha'],
  [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

$entrada = json_decode(file_get_contents('php://input'), true);
$senha = trim($entrada['senha'] ?? '');
$fp = trim($entrada['fingerprint'] ?? '');

if ($senha === '' || $fp === '') { echo json_encode(['ok' => false, 'mensagem' => 'Dados incompletos.']); exit; }

$st = $pdo->prepare('SELECT * FROM senhas WHERE senha = ?');
$st->execute([$senha]);
$reg = $st->fetch(PDO::FETCH_ASSOC);

if (!$reg) { echo json_encode(['ok' => false, 'mensagem' => 'Senha inválida. Verifique o e-mail recebido após a compra.']); exit; }
if ($reg['status'] === 'bloqueada') { echo json_encode(['ok' => false, 'mensagem' => 'Acesso negado.']); exit; }

if ($reg['device_fingerprint'] === null) {
  // Primeiro acesso: vincula o dispositivo.
  $up = $pdo->prepare("UPDATE senhas SET device_fingerprint = ?, status = 'usada', ativada_em = NOW() WHERE id = ?");
  $up->execute([$fp, $reg['id']]);
  echo json_encode(['ok' => true, 'senha_id' => $reg['id']]); exit;
}

if ($reg['device_fingerprint'] === $fp) {
  // Mesmo dispositivo: libera (retomada).
  echo json_encode(['ok' => true, 'senha_id' => $reg['id']]); exit;
}

// Dispositivo diferente: bloqueia.
echo json_encode(['ok' => false, 'mensagem' => 'Esta senha já está em uso em outro dispositivo. Acesso negado.']);
