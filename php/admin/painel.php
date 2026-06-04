<?php
session_start();
if (empty($_SESSION['admin'])) { header('Location: index.php'); exit; }
$cfg = require __DIR__ . '/../config.php';
$pdo = new PDO("mysql:host={$cfg['db_host']};dbname={$cfg['db_nome']};charset=utf8mb4", $cfg['db_user'], $cfg['db_senha'],
  [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$senhas = $pdo->query('SELECT * FROM senhas ORDER BY criada_em DESC')->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="stylesheet" href="../../css/estilo.css"><title>Painel — Novo Rumo</title></head>
<body><div class="container">
<h1>Senhas</h1>
<form method="post" action="gerar.php">
  <label>Quantas senhas gerar?</label>
  <input type="number" name="quantidade" value="10" min="1" max="500">
  <button class="btn" style="margin-top:12px;">Gerar senhas</button>
</form>
<table class="orcamento" style="margin-top:20px;">
  <tr><th>Senha</th><th>Status</th><th>Ativada em</th></tr>
  <?php foreach ($senhas as $s): ?>
  <tr><td><?= htmlspecialchars($s['senha']) ?></td><td><?= $s['status'] ?></td><td><?= $s['ativada_em'] ?? '—' ?></td></tr>
  <?php endforeach; ?>
</table>
</div></body></html>
