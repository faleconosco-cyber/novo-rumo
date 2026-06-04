/* Tela de acesso — PROTÓTIPO.
   No protótipo, qualquer senha da lista SENHAS_TESTE é aceita e o "dispositivo" é o próprio navegador.
   O desenvolvedor substitui validar() por uma chamada ao acesso.php (valida no MySQL + grava fingerprint). */

const SENHAS_TESTE = ["RUMO2026", "TESTE"]; // senhas de teste só para a Cláudia ver funcionando

function gerarFingerprint() {
  // Combinação simples de atributos do dispositivo. O PHP receberá este valor.
  const base = [navigator.userAgent, screen.width + "x" + screen.height,
                Intl.DateTimeFormat().resolvedOptions().timeZone, navigator.language].join("|");
  let hash = 0;
  for (let i = 0; i < base.length; i++) { hash = ((hash << 5) - hash + base.charCodeAt(i)) | 0; }
  return "fp_" + Math.abs(hash);
}

function validarAcesso(senha) {
  // PROTÓTIPO: valida contra a lista local.
  if (SENHAS_TESTE.includes(senha.trim().toUpperCase())) {
    const dados = Armazenamento.ler();
    dados.senha = senha.trim().toUpperCase();
    dados.fingerprint = gerarFingerprint();
    localStorage.setItem(Armazenamento.CHAVE, JSON.stringify(dados));
    return { ok: true };
  }
  return { ok: false, mensagem: "Senha inválida. Verifique o e-mail recebido após a compra." };
}
