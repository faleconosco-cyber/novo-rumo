# Novo Rumo — Entrega para o Desenvolvedor

## O que é
Ferramenta de reorientação de carreira para adultos. A Cláudia construiu e validou o conteúdo e o protótipo navegável. Sua tarefa é colocar no ar com backend real.

## O que já está pronto (protótipo, roda só no navegador)
- `index.html` — tela de acesso (senha)
- `app.html` + `js/app.js` — fluxo das 4 etapas, navegação linear, barra de progresso, retomada
- `js/conteudo.js` — TODO o conteúdo (a Cláudia edita aqui; não reescrever)
- `js/componentes.js` — renderização dos módulos
- `js/armazenamento.js` — **hoje salva no localStorage; trocar pelas chamadas ao PHP**
- `js/acesso.js` — **hoje valida senha numa lista local; trocar pela chamada ao acesso.php**
- `conclusao.html` + `js/pdf.js` — tela final, CTA WhatsApp, PDF por impressão

## O que você precisa fazer
1. Subir o `db.sql` num MySQL. Copiar `php/config.exemplo.php` para `php/config.php` e preencher.
2. Criar o primeiro admin: rodar uma vez
   `INSERT INTO admin (usuario, senha_hash) VALUES ('claudia', '<password_hash gerado>');`
   (gere o hash com `password_hash('senha', PASSWORD_DEFAULT)`).
3. Em `js/acesso.js`, trocar `validarAcesso` por um `fetch('php/acesso.php', {method:'POST', body: JSON.stringify({senha, fingerprint: gerarFingerprint()})})` e guardar o `senha_id` retornado.
4. Em `js/armazenamento.js`, trocar `salvarResposta`/`lerResposta`/`salvarProgresso`/`lerProgresso` por chamadas a `php/salvar.php` e `php/progresso.php`, usando o `senha_id`.
5. Integrar com a Eduzz: na compra, gerar/entregar uma senha (use o painel em `php/admin/` para gerar lotes e colar na Eduzz, ou automatize via API da Eduzz).
6. Trocar `WHATSAPP_NUMERO` em `js/conteudo.js` pelo número real da Cláudia.

## Identidade visual
Toda no `css/estilo.css` (variáveis no topo). Variação bege e verde da paleta do Instituto Rumo.

## Checklist de integração
- [ ] Banco criado e config preenchida
- [ ] Admin criado e login funcionando
- [ ] Acesso por senha valida contra o MySQL e grava fingerprint no 1º acesso
- [ ] Segunda senha no mesmo dispositivo retoma; em outro dispositivo bloqueia
- [ ] Respostas e progresso gravando no banco
- [ ] WhatsApp com número real
- [ ] Geração de senhas em lote integrada com a entrega da Eduzz
