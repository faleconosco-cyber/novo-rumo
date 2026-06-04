/* Renderiza cada tipo de módulo. Devolve um elemento <div class="card">.
   Chama aoMudar(valorAtual) sempre que o usuário interage (para salvar e liberar o botão continuar). */

function el(tag, props = {}, filhos = []) {
  const e = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === "class") e.className = v;
    else if (k === "text") e.textContent = v;
    else e.setAttribute(k, v);
  });
  filhos.forEach(f => e.appendChild(f));
  return e;
}

// Busca o título de um módulo pelo seu id (para mostrar nomes amigáveis na síntese).
function tituloDoModulo(id) {
  for (const et of CONTEUDO.etapas) {
    for (const m of et.modulos) { if (m.id === id) return m.titulo; }
  }
  return id;
}

// Converte uma resposta salva (objeto/array/texto) em texto legível, sem código.
function respostaLegivel(valor) {
  if (valor == null) return "";
  if (typeof valor === "string") return valor;
  if (Array.isArray(valor)) return valor.filter(x => x != null && x !== "").map(respostaLegivel).join(", ");
  if (typeof valor === "object") {
    return Object.entries(valor).map(([k, v]) => {
      if (k === "experiencias" && Array.isArray(v)) {
        return v.map((exp, i) => "Experiência " + (i + 1) + ": " + respostaLegivel(exp)).join("\n");
      }
      if (k === "porExperiencia" && v && typeof v === "object") {
        return Object.entries(v).map(([nome, pil]) => nome + ": " + respostaLegivel(pil)).join("\n");
      }
      return respostaLegivel(v);
    }).filter(t => t && t.trim()).join("\n");
  }
  return String(valor);
}

// Limpa um pedaço de texto do usuário (tira pontuação final solta).
function limpar(t) { return (t || "").trim().replace(/[.;,]+$/, ""); }

// Converte trechos escritos em 1ª pessoa para a voz da devolutiva (você/seu).
// Ex.: "me relacionar com pessoas... meu filho... meus princípios"
//   -> "se relacionar com pessoas... seu filho... seus princípios"
function converterVoz(t) {
  if (!t) return t;
  const trocas = [
    [/\bme\b/gi, "se"],
    [/\bmim\b/gi, "você"],
    [/\bcomigo\b/gi, "consigo"],
    [/\bmeu\b/gi, "seu"], [/\bmeus\b/gi, "seus"],
    [/\bminha\b/gi, "sua"], [/\bminhas\b/gi, "suas"],
    [/\beu\b/gi, "você"]
  ];
  let r = t;
  trocas.forEach(([re, sub]) => { r = r.replace(re, sub); });
  return r;
}

// Frases para cada pilar conforme o nível escolhido.
function frasePilar(chave, nivel) {
  const m = {
    competencia: { "Tinha": "se sentia preparado", "Em parte": "se sentia preparado em parte", "Faltou": "não se sentia preparado" },
    reconhecimento: { "Tinha": "era reconhecido", "Em parte": "era reconhecido em parte", "Faltou": "faltou reconhecimento" },
    sentido: { "Tinha": "via sentido no que fazia", "Em parte": "via sentido em parte", "Faltou": "faltava sentido" }
  };
  return (m[chave] && m[chave][nivel]) || null;
}

// Monta um resumo em prosa, costurando linha do tempo + pilares (e habilidades, se houver).
function construirResumoApoio(ids) {
  const paragrafos = [];
  const lt = Armazenamento.lerResposta("e1_linha_tempo") || {};
  const pil = Armazenamento.lerResposta("e1_pilares") || {};
  const exps = (lt.experiencias || []).filter(e => e && (e.nome || e.p0 || e.p1 || e.p2));

  if (ids.includes("e1_linha_tempo") && exps.length) {
    exps.forEach((exp, idx) => {
      const nome = exp.nome && exp.nome.trim() ? exp.nome.trim() : ("a experiência " + (idx + 1));
      let frase = "Na experiência \"" + nome + "\", ";
      const partes = [];
      if (limpar(exp.p0)) partes.push("o aprendizado foi: " + converterVoz(limpar(exp.p0)));
      if (limpar(exp.p1)) partes.push("o que te fez ficar: " + converterVoz(limpar(exp.p1)));
      if (limpar(exp.p2)) partes.push("o que te fez sair: " + converterVoz(limpar(exp.p2)));
      frase += partes.join("; ") + ".";

      // Costura os pilares dessa experiência.
      const chaveExp = exp.nome && exp.nome.trim() ? exp.nome.trim() : ("Experiência " + (idx + 1));
      const p = (pil.porExperiencia && pil.porExperiencia[chaveExp]) || {};
      const fp = ["competencia", "reconhecimento", "sentido"].map(c => frasePilar(c, p[c])).filter(Boolean);
      if (fp.length) {
        frase += " Nessa fase, você " + (fp.length > 1 ? fp.slice(0, -1).join(", ") + " e " + fp[fp.length - 1] : fp[0]) + ".";
      }
      paragrafos.push(frase);
    });
  }

  if (ids.includes("e1_habilidades")) {
    const hab = Armazenamento.lerResposta("e1_habilidades") || {};
    const texto = limpar(hab.p0);
    if (texto) paragrafos.push("Entre suas habilidades, você reconhece: " + converterVoz(texto) + ".");
  }

  return paragrafos;
}

function cabecalho(modulo) {
  const frag = document.createDocumentFragment();
  frag.appendChild(el("h2", { text: modulo.titulo }));
  if (modulo.instrucao) frag.appendChild(el("p", { text: modulo.instrucao }));
  return frag;
}

function textarea(valorInicial, aoDigitar, placeholder = "") {
  const t = el("textarea", { placeholder });
  t.value = valorInicial || "";
  t.addEventListener("input", () => aoDigitar(t.value));
  return t;
}

function renderizarModulo(modulo, valor, aoMudar) {
  const card = el("div", { class: "card" });
  card.appendChild(cabecalho(modulo));
  valor = valor || {};

  const tipos = {
    texto: () => {
      modulo.perguntas.forEach((p, i) => {
        card.appendChild(el("label", { text: p }));
        card.appendChild(textarea(valor["p" + i], v => { valor["p" + i] = v; aoMudar(valor); }));
      });
    },
    texto_com_apoio: () => {
      modulo.perguntas.forEach((p, i) => {
        card.appendChild(el("label", { text: p }));
        card.appendChild(textarea(valor["p" + i], v => { valor["p" + i] = v; aoMudar(valor); }));
      });
      const det = el("details", {});
      det.appendChild(el("summary", { text: modulo.apoio.titulo }));
      const chips = el("div", { class: "chips" });
      modulo.apoio.itens.forEach(it => chips.appendChild(el("span", { class: "chip", text: it })));
      det.appendChild(chips);
      card.appendChild(det);
    },
    multipla_escolha_e_texto: () => {
      card.appendChild(el("label", { text: modulo.escolha.pergunta }));
      const chips = el("div", { class: "chips" });
      modulo.escolha.opcoes.forEach(op => {
        const c = el("span", { class: "chip", text: op });
        if (valor.escolha === op) c.classList.add("ativo");
        c.addEventListener("click", () => {
          chips.querySelectorAll(".chip").forEach(x => x.classList.remove("ativo"));
          c.classList.add("ativo"); valor.escolha = op; aoMudar(valor);
        });
        chips.appendChild(c);
      });
      card.appendChild(chips);
      modulo.perguntas.forEach((p, i) => {
        card.appendChild(el("label", { text: p }));
        card.appendChild(textarea(valor["p" + i], v => { valor["p" + i] = v; aoMudar(valor); }));
      });
    },
    linha_tempo: () => {
      valor.experiencias = valor.experiencias || [];
      const lista = el("div", {});
      function desenhar() {
        lista.innerHTML = "";
        valor.experiencias.forEach((exp, idx) => {
          const bloco = el("div", { class: "card", style: "background:#f6f2e8;" });
          bloco.appendChild(el("h3", { text: "Experiência " + (idx + 1) }));
          const nome = el("input", { type: "text", placeholder: "Nome/área dessa experiência" });
          nome.value = exp.nome || "";
          nome.addEventListener("input", () => { exp.nome = nome.value; aoMudar(valor); });
          bloco.appendChild(nome);
          modulo.perguntas.forEach((p, i) => {
            bloco.appendChild(el("label", { text: p }));
            bloco.appendChild(textarea(exp["p" + i], v => { exp["p" + i] = v; aoMudar(valor); }));
          });
          const rem = el("button", { class: "btn btn-secundario", text: "Remover", style: "margin-top:10px;" });
          rem.addEventListener("click", () => { valor.experiencias.splice(idx, 1); aoMudar(valor); desenhar(); });
          bloco.appendChild(rem);
          lista.appendChild(bloco);
        });
      }
      desenhar();
      card.appendChild(lista);
      const add = el("button", { class: "btn", text: "+ Adicionar experiência" });
      add.addEventListener("click", () => { valor.experiencias.push({}); aoMudar(valor); desenhar(); });
      card.appendChild(add);
    },
    pilares: () => {
      // Avalia os 3 pilares para CADA experiência preenchida na linha do tempo.
      valor.porExperiencia = valor.porExperiencia || {};
      const lt = Armazenamento.lerResposta("e1_linha_tempo") || {};
      const exps = (lt.experiencias || []).filter(e => e && (e.nome || e.p0 || e.p1 || e.p2));

      if (!exps.length) {
        card.appendChild(el("p", { class: "destaque",
          text: "Para avaliar os pilares, primeiro adicione suas experiências no módulo \"Minha linha do tempo\"." }));
        return;
      }

      exps.forEach((exp, idx) => {
        const chaveExp = exp.nome && exp.nome.trim() ? exp.nome.trim() : ("Experiência " + (idx + 1));
        valor.porExperiencia[chaveExp] = valor.porExperiencia[chaveExp] || {};
        const bloco = el("div", { class: "card", style: "background:#f6f2e8;" });
        bloco.appendChild(el("h3", { text: chaveExp }));
        modulo.pilares.forEach(pil => {
          bloco.appendChild(el("label", { text: pil.rotulo }));
          bloco.appendChild(el("p", { text: pil.ajuda, class: "salvo" }));
          const chips = el("div", { class: "chips" });
          modulo.niveis.forEach(nv => {
            const c = el("span", { class: "chip", text: nv });
            if (valor.porExperiencia[chaveExp][pil.chave] === nv) c.classList.add("ativo");
            c.addEventListener("click", () => {
              chips.querySelectorAll(".chip").forEach(x => x.classList.remove("ativo"));
              c.classList.add("ativo"); valor.porExperiencia[chaveExp][pil.chave] = nv; aoMudar(valor);
            });
            chips.appendChild(c);
          });
          bloco.appendChild(chips);
        });
        card.appendChild(bloco);
      });
    },
    sintese: () => {
      // Mostra respostas anteriores como apoio (somente leitura), em texto legível.
      const paragrafos = construirResumoApoio(modulo.puxar_de || []);
      if (paragrafos.length) {
        const apoio = el("div", { class: "card", style: "background:#e9efe6;" });
        apoio.appendChild(el("h3", { text: "Um resumo do que você trouxe até aqui:" }));
        paragrafos.forEach(p => apoio.appendChild(el("p", { text: p, style: "margin-bottom:12px;" })));
        card.appendChild(apoio);
      }
      if (modulo.campo) {
        card.appendChild(el("label", { text: modulo.campo.rotulo }));
        card.appendChild(textarea(valor.p0, v => { valor.p0 = v; aoMudar(valor); }, modulo.campo.placeholder));
      }
      (modulo.perguntas || []).forEach((p, i) => {
        card.appendChild(el("label", { text: p }));
        card.appendChild(textarea(valor["p" + i], v => { valor["p" + i] = v; aoMudar(valor); }));
      });
    },
    eixos: () => {
      valor.eixos = valor.eixos || {};
      modulo.eixos.forEach(ex => {
        card.appendChild(el("label", { text: ex }));
        card.appendChild(textarea(valor.eixos[ex], v => { valor.eixos[ex] = v; aoMudar(valor); }));
      });
    },
    selecao_e_texto: () => {
      valor.selecionados = valor.selecionados || [];
      const chips = el("div", { class: "chips" });
      modulo.opcoes.forEach(op => {
        const c = el("span", { class: "chip", text: op });
        if (valor.selecionados.includes(op)) c.classList.add("ativo");
        c.addEventListener("click", () => {
          if (valor.selecionados.includes(op)) { valor.selecionados = valor.selecionados.filter(x => x !== op); c.classList.remove("ativo"); }
          else { valor.selecionados.push(op); c.classList.add("ativo"); }
          aoMudar(valor);
        });
        chips.appendChild(c);
      });
      card.appendChild(chips);
      card.appendChild(el("label", { text: modulo.pergunta_texto }));
      card.appendChild(textarea(valor.texto, v => { valor.texto = v; aoMudar(valor); }));
    },
    duas_colunas: () => {
      card.appendChild(el("label", { text: modulo.coluna_a }));
      card.appendChild(textarea(valor.a, v => { valor.a = v; aoMudar(valor); }));
      card.appendChild(el("label", { text: modulo.coluna_b }));
      card.appendChild(textarea(valor.b, v => { valor.b = v; aoMudar(valor); }));
    },
    orcamento: () => {
      valor.linhas = valor.linhas || {};
      const tbl = el("table", { class: "orcamento" });
      const thead = el("tr", {}, [el("th", { text: "Item" }), el("th", { text: modulo.colunas[0] }), el("th", { text: modulo.colunas[1] })]);
      tbl.appendChild(thead);
      let totN = 0, totD = 0;
      const totalCel = { n: null, d: null };
      function recalc() {
        totN = 0; totD = 0;
        modulo.linhas.forEach(li => { const o = valor.linhas[li] || {}; totN += Number(o.n) || 0; totD += Number(o.d) || 0; });
        totalCel.n.textContent = "R$ " + totN; totalCel.d.textContent = "R$ " + totD;
      }
      modulo.linhas.forEach(li => {
        valor.linhas[li] = valor.linhas[li] || {};
        const inpN = el("input", { type: "number", placeholder: "0" }); inpN.value = valor.linhas[li].n || "";
        const inpD = el("input", { type: "number", placeholder: "0" }); inpD.value = valor.linhas[li].d || "";
        inpN.addEventListener("input", () => { valor.linhas[li].n = inpN.value; aoMudar(valor); recalc(); });
        inpD.addEventListener("input", () => { valor.linhas[li].d = inpD.value; aoMudar(valor); recalc(); });
        tbl.appendChild(el("tr", {}, [el("td", { text: li }), el("td", {}, [inpN]), el("td", {}, [inpD])]));
      });
      totalCel.n = el("td", { text: "R$ 0" }); totalCel.d = el("td", { text: "R$ 0" });
      tbl.appendChild(el("tr", {}, [el("td", { text: "TOTAL" }), totalCel.n, totalCel.d]));
      card.appendChild(tbl); recalc();
    },
    territorios: () => {
      valor.notas = valor.notas || {};
      modulo.territorios.forEach(t => {
        card.appendChild(el("label", { text: t.rotulo }));
        card.appendChild(el("p", { text: t.ajuda, class: "salvo" }));
        card.appendChild(textarea(valor.notas[t.rotulo], v => { valor.notas[t.rotulo] = v; aoMudar(valor); }, "Esse território faz sentido pra mim? Por quê?"));
      });
    },
    caminhos: () => {
      valor.selecionados = valor.selecionados || [];
      const chips = el("div", { class: "chips" });
      modulo.opcoes.forEach(op => {
        const c = el("span", { class: "chip", text: op.rotulo, title: op.ajuda });
        if (valor.selecionados.includes(op.rotulo)) c.classList.add("ativo");
        c.addEventListener("click", () => {
          if (valor.selecionados.includes(op.rotulo)) { valor.selecionados = valor.selecionados.filter(x => x !== op.rotulo); c.classList.remove("ativo"); }
          else { valor.selecionados.push(op.rotulo); c.classList.add("ativo"); }
          aoMudar(valor);
        });
        chips.appendChild(c);
      });
      card.appendChild(chips);
      card.appendChild(el("label", { text: modulo.pergunta_texto }));
      card.appendChild(textarea(valor.texto, v => { valor.texto = v; aoMudar(valor); }));
    }
  };

  (tipos[modulo.tipo] || (() => card.appendChild(el("p", { text: "[tipo de módulo desconhecido: " + modulo.tipo + "]" }))))();

  const salvo = el("p", { class: "salvo", text: "Salvo automaticamente" });
  card.appendChild(salvo);
  return card;
}
