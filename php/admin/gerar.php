<?php
session_start();
if (empty($_SESSION['admin'])) { header('Location: index.php'); exit; }
$cfg = require __DIR__ . '/../config.php';
$pdo = new PDO("mysql:host={$cfg['db_host']};dbname={$cfg['db_nome']};charset=utf8mb4", $cfg['db_user'], $cfg['db_senha'],
  [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$qtd = min(500, max(1, (int)($_POST['quantidade'] ?? 0)));
$st = $pdo->prepare('INSERT INTO senhas (senha) VALUES (?)');
for ($i = 0; $i < $qtd; $i++) {
  $senha = 'NR-' . strtoupper(bin2hex(random_bytes(3))); // ex: NR-A1B2C3
  try { $st->execute([$senha]); } catch (PDOException $e) { $i--; } // repete se colidir
}
header('Location: painel.php');
