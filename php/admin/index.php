<?php
session_start();
$cfg = require __DIR__ . '/../config.php';
$pdo = new PDO("mysql:host={$cfg['db_host']};dbname={$cfg['db_nome']};charset=utf8mb4", $cfg['db_user'], $cfg['db_senha'],
  [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$erro = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $st = $pdo->prepare('SELECT * FROM admin WHERE usuario = ?');
  $st->execute([$_POST['usuario'] ?? '']);
  $a = $st->fetch(PDO::FETCH_ASSOC);
  if ($a && password_verify($_POST['senha'] ?? '', $a['senha_hash'])) {
    $_SESSION['admin'] = $a['usuario']; header('Location: painel.php'); exit;
  }
  $erro = 'Usuário ou senha incorretos.';
}
?>
<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="stylesheet" href="../../css/estilo.css"><title>Admin — Novo Rumo</title></head>
<body><div class="container"><div class="card" style="margin-top:60px;">
<h1>Painel Novo Rumo</h1>
<?php if ($erro) echo '<p class="destaque">' . $erro . '</p>'; ?>
<form method="post">
  <label>Usuário</label><input type="text" name="usuario">
  <label>Senha</label><input type="password" name="senha">
  <button class="btn" style="margin-top:16px;">Entrar</button>
</form></div></div></body></html>
