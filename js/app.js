/* Motor do Novo Rumo: controla qual módulo está na tela, barra de progresso,
   liberação do botão Continuar e navegação linear. */

(function () {
  // Protege a página: sem senha válida, volta para o acesso.
  const dados = Armazenamento.ler();
  if (!dados.senha) { window.location.href = "index.html"; return; }

  const etapas = CONTEUDO.etapas;
  const totalModulos = etapas.reduce((s, e) => s + e.modulos.length, 0);
  let prog = Armazenamento.lerProgresso(); // { etapa, modulo } (1-based etapa, 0-based modulo)

  function etapaAtual() { return etapas[prog.etapa - 1]; }
  function moduloAtual() { return etapaAtual().modulos[prog.modulo]; }

  function indiceGlobal() {
    let n = 0;
    for (let i = 0; i < prog.etapa - 1; i++) n += etapas[i].modulos.length;
    return n + prog.modulo;
  }

  function moduloRespondido(modulo, valor) {
    if (!valor) return false;
    const algumTexto = obj => Object.values(obj).some(v =>
      (typeof v === "string" && v.trim()) ||
      (Array.isArray(v) && v.length) ||
      (typeof v === "object" && v !== null && algumTexto(v)));
    return algumTexto(valor);
  }

  function atualizarBarra() {
    const pct = Math.round((indiceGlobal() / totalModulos) * 100);
    document.getElementById("barra").style.width = pct + "%";
    document.getElementById("rotulo-progresso").textContent =
      "Etapa " + prog.etapa + " de 4 — " + etapaAtual().nome + "  ·  módulo " + (prog.modulo + 1) + " de " + etapaAtual().modulos.length;
  }

  function desenhar() {
    const modulo = moduloAtual();
    const cab = document.getElementById("cabecalho-etapa");
    cab.innerHTML = "";
    cab.appendChild(Object.assign(document.createElement("h1"), { textContent: etapaAtual().nome }));
    cab.appendChild(Object.assign(document.createElement("p"), { className: "destaque", textContent: etapaAtual().subtitulo }));

    const area = document.getElementById("area-modulo");
    area.innerHTML = "";
    let valor = Armazenamento.lerResposta(modulo.id) || {};
    const botao = document.getElementById("continuar");

    function aoMudar(v) {
      valor = v;
      Armazenamento.salvarResposta(modulo.id, v);
      botao.disabled = !moduloRespondido(modulo, v);
    }
    area.appendChild(renderizarModulo(modulo, valor, aoMudar));
    botao.disabled = !moduloRespondido(modulo, valor);

    // Texto do botão muda no último módulo
    const ultimo = (prog.etapa === 4 && prog.modulo === etapaAtual().modulos.length - 1);
    botao.textContent = ultimo ? "Concluir" : "Continuar";

    atualizarBarra();
    window.scrollTo(0, 0);
  }

  function avancar() {
    const ehUltimoDaEtapa = prog.modulo >= etapaAtual().modulos.length - 1;
    if (ehUltimoDaEtapa) {
      if (prog.etapa >= 4) { Armazenamento.salvarProgresso(prog.etapa, prog.modulo); window.location.href = "conclusao.html"; return; }
      prog.etapa += 1; prog.modulo = 0;
    } else {
      prog.modulo += 1;
    }
    Armazenamento.salvarProgresso(prog.etapa, prog.modulo);
    desenhar();
  }

  document.getElementById("continuar").addEventListener("click", avancar);
  desenhar();
})();
