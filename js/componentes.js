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
      valor.pilares = valor.pilares || {};
      modulo.pilares.forEach(pil => {
        card.appendChild(el("label", { text: pil.rotulo }));
        card.appendChild(el("p", { text: pil.ajuda, class: "salvo" }));
        const chips = el("div", { class: "chips" });
        modulo.niveis.forEach(nv => {
          const c = el("span", { class: "chip", text: nv });
          if (valor.pilares[pil.chave] === nv) c.classList.add("ativo");
          c.addEventListener("click", () => {
            chips.querySelectorAll(".chip").forEach(x => x.classList.remove("ativo"));
            c.classList.add("ativo"); valor.pilares[pil.chave] = nv; aoMudar(valor);
          });
          chips.appendChild(c);
        });
        card.appendChild(chips);
      });
    },
    sintese: () => {
      // Mostra respostas anteriores como apoio (somente leitura)
      const apoio = el("div", { class: "card", style: "background:#e9efe6;" });
      apoio.appendChild(el("h3", { text: "Para te ajudar, o que você já trouxe:" }));
      (modulo.puxar_de || []).forEach(id => {
        const r = Armazenamento.lerResposta(id);
        if (r) apoio.appendChild(el("pre", { text: id + ": " + JSON.stringify(r), style: "white-space:pre-wrap; font-size:.8rem;" }));
      });
      card.appendChild(apoio);
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
