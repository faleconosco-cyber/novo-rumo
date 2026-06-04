/* Camada de armazenamento. No protótipo usa localStorage do navegador.
   O desenvolvedor troca o corpo destas funções por chamadas ao PHP (salvar.php / progresso.php). */

const Armazenamento = {
  CHAVE: "novo_rumo_dados",

  ler() {
    try { return JSON.parse(localStorage.getItem(this.CHAVE)) || { respostas: {}, progresso: { etapa: 1, modulo: 0 } }; }
    catch (e) { return { respostas: {}, progresso: { etapa: 1, modulo: 0 } }; }
  },

  salvarResposta(moduloId, valor) {
    const dados = this.ler();
    dados.respostas[moduloId] = valor;
    localStorage.setItem(this.CHAVE, JSON.stringify(dados));
  },

  lerResposta(moduloId) {
    return this.ler().respostas[moduloId];
  },

  salvarProgresso(etapa, modulo) {
    const dados = this.ler();
    dados.progresso = { etapa, modulo };
    localStorage.setItem(this.CHAVE, JSON.stringify(dados));
  },

  lerProgresso() { return this.ler().progresso; },

  limpar() { localStorage.removeItem(this.CHAVE); }
};
