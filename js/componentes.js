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
function frasePilar(chave, nivel, primeiraPersona) {
  const m = primeiraPersona ? {
    competencia: { "Tinha": "eu me sentia preparado", "Em parte": "eu me sentia preparado em parte", "Faltou": "eu não me sentia preparado" },
    reconhecimento: { "Tinha": "eu era reconhecido", "Em parte": "eu era reconhecido em parte", "Faltou": "faltou reconhecimento" },
    sentido: { "Tinha": "eu via sentido no que fazia", "Em parte": "eu via sentido em parte", "Faltou": "faltava sentido" },
    retorno_financeiro: { "Tinha": "o retorno financeiro era satisfatório", "Em parte": "o retorno financeiro era parcial", "Faltou": "o retorno financeiro ficou abaixo do esperado" },
    satisfacao_pessoal: { "Tinha": "eu gostava do que fazia", "Em parte": "eu gostava em parte do que fazia", "Faltou": "eu não gostava do que fazia" }
  } : {
    competencia: { "Tinha": "se sentia preparado", "Em parte": "se sentia preparado em parte", "Faltou": "não se sentia preparado" },
    reconhecimento: { "Tinha": "era reconhecido", "Em parte": "era reconhecido em parte", "Faltou": "faltou reconhecimento" },
    sentido: { "Tinha": "via sentido no que fazia", "Em parte": "via sentido em parte", "Faltou": "faltava sentido" },
    retorno_financeiro: { "Tinha": "o retorno financeiro era satisfatório", "Em parte": "o retorno financeiro era parcial", "Faltou": "o retorno financeiro ficou abaixo do esperado" },
    satisfacao_pessoal: { "Tinha": "gostava do que fazia", "Em parte": "gostava em parte do que fazia", "Faltou": "não gostava do que fazia" }
  };
  return (m[chave] && m[chave][nivel]) || null;
}

// Monta um resumo em prosa, costurando linha do tempo + pilares (e habilidades, se houver).
function construirResumoApoio(ids, voz) {
  const primeiraPersona = voz === "primeira";
  const paragrafos = [];
  const lt = Armazenamento.lerResposta("e1_linha_tempo") || {};
  const pil = Armazenamento.lerResposta("e1_pilares") || {};
  const exps = (lt.experiencias || []).filter(e => e && (e.nome || e.p0 || e.p1 || e.p2));

  if (ids.includes("e1_linha_tempo") && exps.length) {
    exps.forEach((exp, idx) => {
      const nome = exp.nome && exp.nome.trim() ? exp.nome.trim() : ("Experiência " + (idx + 1));
      paragrafos.push({ texto: "Na experiência \"" + nome + "\":", forte: true });
      const texto = primeiraPersona ? (t => t) : converterVoz;
      if (limpar(exp.p0)) paragrafos.push({ rotulo: primeiraPersona ? "O que aprendi foi:" : "O aprendizado foi:", texto: texto(limpar(exp.p0)) + "." });
      if (limpar(exp.p1)) paragrafos.push({ rotulo: primeiraPersona ? "O que me fez ficar foi:" : "O que te fez ficar foi:", texto: texto(limpar(exp.p1)) + "." });
      if (limpar(exp.p2)) paragrafos.push({ rotulo: primeiraPersona ? "O que me fez sair foi:" : "O que te fez sair foi:", texto: texto(limpar(exp.p2)) + "." });
      const p = (pil.porExperiencia && pil.porExperiencia[nome]) || {};
      const fp = ["competencia", "reconhecimento", "sentido", "retorno_financeiro", "satisfacao_pessoal"].map(c => frasePilar(c, p[c], primeiraPersona)).filter(Boolean);
      if (fp.length) {
        const sujeito = primeiraPersona ? "Nessa fase, " : "Nessa fase, você ";
        paragrafos.push({ texto: sujeito + (fp.length > 1 ? fp.slice(0, -1).join(", ") + " e " + fp[fp.length - 1] : fp[0]) + "." });
      }
    });
  }

  if (ids.includes("e1_habilidades")) {
    const hab = Armazenamento.lerResposta("e1_habilidades") || {};
    const texto = limpar(hab.p0);
    if (primeiraPersona) {
      if (texto) paragrafos.push({ texto: "Entre as minhas habilidades, eu reconheço: " + texto + "." });
    } else {
      if (texto) paragrafos.push({ texto: "Entre suas habilidades, você reconhece: " + converterVoz(texto) + "." });
    }
  }

  return paragrafos;
}

function cabecalho(modulo) {
  const frag = document.createDocumentFragment();
  frag.appendChild(el("h2", { text: modulo.titulo }));
  if (modulo.instrucao) {
    const textos = Array.isArray(modulo.instrucao) ? modulo.instrucao : [modulo.instrucao];
    textos.forEach(t => frag.appendChild(el("p", { text: t })));
  }
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
      if (modulo.exemplos) card.appendChild(el("p", { class: "salvo", text: modulo.exemplos, style: "font-style:italic; margin-bottom:14px;" }));
      modulo.perguntas.forEach((p, i) => {
        card.appendChild(el("label", { text: p }));
        card.appendChild(textarea(valor["p" + i], v => { valor["p" + i] = v; aoMudar(valor); }));
      });
    },
    texto_com_apoio: () => {
      // Resumo da linha do tempo como apoio, se solicitado
      if (modulo.puxar_de && modulo.puxar_de.includes("e1_linha_tempo")) {
        const lt = Armazenamento.lerResposta("e1_linha_tempo") || {};
        const exps = (lt.experiencias || []).filter(e => e && (e.nome || e.p0));
        if (exps.length) {
          const apoio = el("div", { class: "card", style: "background:#e9efe6; margin-bottom:16px;" });
          apoio.appendChild(el("h3", { text: "O que você trouxe na linha do tempo:" }));
          exps.forEach((exp, idx) => {
            const nome = exp.nome && exp.nome.trim() ? exp.nome.trim() : ("Experiência " + (idx + 1));
            apoio.appendChild(el("p", { text: nome, style: "font-weight:700; margin:12px 0 4px;" }));
            if (limpar(exp.p0)) apoio.appendChild(el("p", { text: "Aprendi: " + limpar(exp.p0), style: "margin-bottom:4px;" }));
            if (limpar(exp.p1)) apoio.appendChild(el("p", { text: "O que me fez ficar: " + limpar(exp.p1), style: "margin-bottom:4px;" }));
            if (limpar(exp.p2)) apoio.appendChild(el("p", { text: "O que me fez sair: " + limpar(exp.p2), style: "margin-bottom:4px;" }));
          });
          card.appendChild(apoio);
        }
      }
      // Só o primeiro campo (p0) recebe os chips clicáveis de apoio.
      const ta = textarea(valor.p0, v => { valor.p0 = v; aoMudar(valor); });
      modulo.perguntas.forEach((p, i) => {
        card.appendChild(el("label", { text: p }));
        if (i === 0) card.appendChild(ta);
        else card.appendChild(textarea(valor["p" + i], v => { valor["p" + i] = v; aoMudar(valor); }));
      });
      const det = el("details", {});
      det.appendChild(el("summary", { text: modulo.apoio.titulo }));
      det.appendChild(el("p", { class: "salvo", text: "Clique em uma habilidade para adicioná-la à sua resposta." }));
      const chips = el("div", { class: "chips" });
      modulo.apoio.itens.forEach(it => {
        const c = el("span", { class: "chip", text: it });
        c.addEventListener("click", () => {
          const atual = ta.value.trim();
          // evita duplicar
          const jaTem = atual.toLowerCase().split(/[,;\n]+/).map(s => s.trim()).includes(it.toLowerCase());
          if (jaTem) {
            c.classList.remove("ativo");
            return;
          }
          ta.value = atual ? atual + ", " + it : it;
          valor.p0 = ta.value;
          aoMudar(valor);
          c.classList.add("ativo");
        });
        chips.appendChild(c);
      });
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

          // Nome/área
          const nome = el("input", { type: "text", placeholder: "Nome ou área dessa experiência" });
          nome.value = exp.nome || "";
          nome.addEventListener("input", () => { exp.nome = nome.value; aoMudar(valor); });
          bloco.appendChild(el("label", { text: "Nome ou área" }));
          bloco.appendChild(nome);

          // Função/cargo
          bloco.appendChild(el("label", { text: "Função ou cargo" }));
          const cargo = el("input", { type: "text", placeholder: "Ex.: analista, coordenadora, professora..." });
          cargo.value = exp.cargo || "";
          cargo.addEventListener("input", () => { exp.cargo = cargo.value; aoMudar(valor); });
          bloco.appendChild(cargo);

          // Datas lado a lado
          const datas = el("div", { style: "display:flex; gap:12px; margin-top:4px;" });
          const wEntrada = el("div", { style: "flex:1;" });
          wEntrada.appendChild(el("label", { text: "Data de entrada" }));
          const entrada = el("input", { type: "text", placeholder: "Ex.: 2018" });
          entrada.value = exp.entrada || "";
          entrada.addEventListener("input", () => { exp.entrada = entrada.value; aoMudar(valor); });
          wEntrada.appendChild(entrada);
          const wSaida = el("div", { style: "flex:1;" });
          wSaida.appendChild(el("label", { text: "Data de saída (ou deixe em branco)" }));
          const saida = el("input", { type: "text", placeholder: "Ex.: 2022 (ou em branco se ainda está aqui)" });
          saida.value = exp.saida || "";
          saida.addEventListener("input", () => { exp.saida = saida.value; aoMudar(valor); });
          wSaida.appendChild(saida);
          datas.appendChild(wEntrada);
          datas.appendChild(wSaida);
          bloco.appendChild(datas);

          // O que fazia no dia a dia
          bloco.appendChild(el("label", { text: "O que eu fazia no dia a dia" }));
          bloco.appendChild(textarea(exp.atividades, v => { exp.atividades = v; aoMudar(valor); }, "Descreva brevemente suas principais atividades..."));

          // Perguntas reflexivas originais
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
      // Avalia a importância de cada pilar para a pessoa (independente da linha do tempo).
      valor.importancia = valor.importancia || {};
      modulo.pilares.forEach(pil => {
        card.appendChild(el("label", { text: pil.rotulo }));
        card.appendChild(el("p", { text: pil.ajuda, class: "salvo" }));
        const chips = el("div", { class: "chips" });
        modulo.niveis.forEach(nv => {
          const c = el("span", { class: "chip", text: nv });
          if (valor.importancia[pil.chave] === nv) c.classList.add("ativo");
          c.addEventListener("click", () => {
            chips.querySelectorAll(".chip").forEach(x => x.classList.remove("ativo"));
            c.classList.add("ativo"); valor.importancia[pil.chave] = nv; aoMudar(valor);
          });
          chips.appendChild(c);
        });
        card.appendChild(chips);
      });
    },
    sintese: () => {
      // Mostra respostas anteriores como apoio (somente leitura), em texto legível.
      const paragrafos = construirResumoApoio(modulo.puxar_de || [], modulo.voz);
      if (paragrafos.length) {
        const apoio = el("div", { class: "card", style: "background:#e9efe6;" });
        apoio.appendChild(el("h3", { text: "Um resumo do que você trouxe até aqui:" }));
        paragrafos.forEach(p => {
          const par = el("p", { style: p.forte ? "font-weight:700; margin:14px 0 4px;" : "margin-bottom:8px;" });
          if (p.rotulo) {
            par.appendChild(el("strong", { text: p.rotulo + " " }));
            par.appendChild(document.createTextNode(p.texto));
          } else {
            par.textContent = p.texto;
          }
          apoio.appendChild(par);
        });
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
        const rotulo = ex.rotulo || ex;
        const exemplos = ex.exemplos || [];
        card.appendChild(el("label", { text: rotulo }));
        const ta = textarea(valor.eixos[rotulo], v => { valor.eixos[rotulo] = v; aoMudar(valor); });
        card.appendChild(ta);
        if (exemplos.length) {
          const det = el("details", {});
          det.appendChild(el("summary", { text: "Sugestões (clique para ver)", style: "font-size:.88rem; color:var(--verde-agua); cursor:pointer; margin:6px 0;" }));
          det.appendChild(el("p", { class: "salvo", text: "Clique para adicionar à sua resposta." }));
          const chips = el("div", { class: "chips" });
          exemplos.forEach(it => {
            const c = el("span", { class: "chip", text: it });
            c.addEventListener("click", () => {
              const atual = ta.value.trim();
              const jaTem = atual.toLowerCase().split(/[,;\n]+/).map(s => s.trim()).includes(it.toLowerCase());
              if (!jaTem) {
                ta.value = atual ? atual + ", " + it : it;
                valor.eixos[rotulo] = ta.value;
                aoMudar(valor);
              }
              c.classList.toggle("ativo");
            });
            chips.appendChild(c);
          });
          det.appendChild(chips);
          card.appendChild(det);
        }
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
    grupos_e_texto: () => {
      valor.grupos = valor.grupos || {};
      modulo.grupos.forEach((g, gi) => {
        card.appendChild(el("label", { text: g.rotulo }));
        const chips = el("div", { class: "chips" });
        g.opcoes.forEach(op => {
          const c = el("span", { class: "chip", text: op });
          if (valor.grupos[gi] === op) c.classList.add("ativo");
          c.addEventListener("click", () => {
            chips.querySelectorAll(".chip").forEach(x => x.classList.remove("ativo"));
            c.classList.add("ativo"); valor.grupos[gi] = op; aoMudar(valor);
          });
          chips.appendChild(c);
        });
        card.appendChild(chips);
      });
      if (modulo.pergunta_texto) {
        card.appendChild(el("label", { text: modulo.pergunta_texto }));
        card.appendChild(textarea(valor.texto, v => { valor.texto = v; aoMudar(valor); }));
      }
    },
    duas_colunas: () => {
      card.appendChild(el("label", { text: modulo.coluna_a }));
      card.appendChild(textarea(valor.a, v => { valor.a = v; aoMudar(valor); }));
      card.appendChild(el("label", { text: modulo.coluna_b }));
      card.appendChild(textarea(valor.b, v => { valor.b = v; aoMudar(valor); }));
    },
    orcamento: () => {
      // Itens editáveis: a pessoa pode renomear, excluir e adicionar lacunas.
      if (!Array.isArray(valor.itens)) {
        valor.itens = (modulo.linhas || []).map(nome => ({ nome: nome, n: "", d: "" }));
      }
      const wrap = el("div", {});

      function desenhar() {
        wrap.innerHTML = "";
        const tbl = el("table", { class: "orcamento" });
        tbl.appendChild(el("tr", {}, [
          el("th", { text: "Item" }),
          el("th", { text: modulo.colunas[0] }),
          el("th", { text: modulo.colunas[1] }),
          el("th", { text: "" })
        ]));

        const totalCel = { n: el("td", { text: "R$ 0" }), d: el("td", { text: "R$ 0" }) };
        function recalc() {
          let totN = 0, totD = 0;
          valor.itens.forEach(it => { totN += Number(it.n) || 0; totD += Number(it.d) || 0; });
          totalCel.n.textContent = "R$ " + totN; totalCel.d.textContent = "R$ " + totD;
        }

        valor.itens.forEach((it, idx) => {
          const inpNome = el("input", { type: "text", placeholder: "Nome do item" }); inpNome.value = it.nome || "";
          inpNome.addEventListener("input", () => { it.nome = inpNome.value; aoMudar(valor); });
          const inpN = el("input", { type: "number", placeholder: "0" }); inpN.value = it.n || "";
          const inpD = el("input", { type: "number", placeholder: "0" }); inpD.value = it.d || "";
          inpN.addEventListener("input", () => { it.n = inpN.value; aoMudar(valor); recalc(); });
          inpD.addEventListener("input", () => { it.d = inpD.value; aoMudar(valor); recalc(); });
          const btnX = el("button", { class: "btn-remover", text: "✕", title: "Excluir este item" });
          btnX.addEventListener("click", () => { valor.itens.splice(idx, 1); aoMudar(valor); desenhar(); });
          tbl.appendChild(el("tr", {}, [
            el("td", {}, [inpNome]), el("td", {}, [inpN]), el("td", {}, [inpD]), el("td", {}, [btnX])
          ]));
        });

        tbl.appendChild(el("tr", {}, [el("td", { text: "TOTAL" }), totalCel.n, totalCel.d, el("td", {})]));
        wrap.appendChild(tbl);
        recalc();

        const add = el("button", { class: "btn", text: "+ Adicionar item", style: "margin-top:8px;" });
        add.addEventListener("click", () => { valor.itens.push({ nome: "", n: "", d: "" }); aoMudar(valor); desenhar(); });
        wrap.appendChild(add);
      }

      desenhar();
      card.appendChild(wrap);
    },
    oportunidades: () => {
      valor.itens = Array.isArray(valor.itens) ? valor.itens : [{}];
      const lista = el("div", {});
      function desenhar() {
        lista.innerHTML = "";
        valor.itens.forEach((item, idx) => {
          item.respostas = item.respostas || {};
          const bloco = el("div", { class: "card", style: "background:#f6f2e8;" });
          bloco.appendChild(el("label", { text: modulo.campoNome }));
          const nome = el("input", { type: "text", placeholder: "Ex.: marketing digital, concurso, abrir um negócio..." });
          nome.value = item.nome || "";
          nome.addEventListener("input", () => { item.nome = nome.value; aoMudar(valor); });
          bloco.appendChild(nome);
          modulo.perguntas.forEach((p, i) => {
            bloco.appendChild(el("label", { text: p }));
            const chips = el("div", { class: "chips" });
            modulo.niveis.forEach(nv => {
              const c = el("span", { class: "chip", text: nv });
              if (item.respostas["p" + i] === nv) c.classList.add("ativo");
              c.addEventListener("click", () => {
                chips.querySelectorAll(".chip").forEach(x => x.classList.remove("ativo"));
                c.classList.add("ativo"); item.respostas["p" + i] = nv; aoMudar(valor);
              });
              chips.appendChild(c);
            });
            bloco.appendChild(chips);
          });
          if (valor.itens.length > 1) {
            const rem = el("button", { class: "btn btn-secundario", text: "Remover", style: "margin-top:10px;" });
            rem.addEventListener("click", () => { valor.itens.splice(idx, 1); aoMudar(valor); desenhar(); });
            bloco.appendChild(rem);
          }
          lista.appendChild(bloco);
        });
      }
      desenhar();
      card.appendChild(lista);
      const add = el("button", { class: "btn", text: "+ Adicionar oportunidade" });
      add.addEventListener("click", () => { valor.itens.push({}); aoMudar(valor); desenhar(); });
      card.appendChild(add);
    },
    territorios: () => {
      valor.notas = valor.notas || {};
      modulo.territorios.forEach(t => {
        card.appendChild(el("label", { text: t.rotulo }));
        card.appendChild(el("p", { text: t.ajuda, class: "salvo" }));
        card.appendChild(textarea(valor.notas[t.rotulo], v => { valor.notas[t.rotulo] = v; aoMudar(valor); }, "Esse cenário faz sentido pra mim? Por quê?"));
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
