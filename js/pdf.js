/* Monta uma página limpa com todas as respostas e dispara a impressão do navegador.
   O usuário escolhe "Salvar como PDF" na janela de impressão. Sem biblioteca externa. */

function rotuloLegivel(valor) {
  if (valor == null) return "";
  if (typeof valor === "string") return valor;
  if (Array.isArray(valor)) return valor.join(", ");
  if (typeof valor === "object") {
    return Object.entries(valor).map(([k, v]) => {
      if (k === "experiencias" && Array.isArray(v)) {
        return v.map((exp, i) => "Experiência " + (i + 1) + ":\n" + rotuloLegivel(exp)).join("\n\n");
      }
      return rotuloLegivel(v);
    }).filter(Boolean).join("\n");
  }
  return String(valor);
}

function gerarPDF() {
  const dados = Armazenamento.ler();
  const win = window.open("", "_blank");
  let html = '<html><head><meta charset="utf-8"><title>Mapa da minha jornada — Novo Rumo</title>' +
    '<style>body{font-family:Montserrat,Arial,sans-serif;color:#282828;max-width:680px;margin:0 auto;padding:30px;}' +
    'h1{color:#3B503F;}h2{color:#91B096;margin-top:24px;}h3{color:#3B503F;margin-top:16px;}' +
    'pre{white-space:pre-wrap;background:#EFE7D6;padding:12px;border-radius:8px;font-family:inherit;}</style></head><body>';
  html += "<h1>Mapa da minha jornada — Novo Rumo</h1>";
  CONTEUDO.etapas.forEach(et => {
    html += "<h2>Etapa " + et.numero + " — " + et.nome + "</h2>";
    et.modulos.forEach(m => {
      const r = dados.respostas[m.id];
      const texto = rotuloLegivel(r).trim();
      if (texto) { html += "<h3>" + m.titulo + "</h3><pre>" + texto.replace(/</g, "&lt;") + "</pre>"; }
    });
  });
  html += "</body></html>";
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 400);
}
