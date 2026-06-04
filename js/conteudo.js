/* =====================================================================
   CONTEÚDO DO NOVO RUMO — Instituto Rumo
   Cláudia: você pode editar os textos abaixo livremente.
   Mantenha as aspas e as vírgulas no lugar. Cada bloco { ... } é um módulo.
   ===================================================================== */

const WHATSAPP_NUMERO = "55XXXXXXXXXXX"; // TROCAR pelo número da Cláudia com DDD, ex: 5531999998888

const CONTEUDO = {
  etapas: [
    /* ============ ETAPA 1 — RECONHECER ============ */
    {
      numero: 1,
      nome: "Reconhecer",
      subtitulo: "A sua história conta o que você precisa saber",
      modulos: [
        {
          id: "e1_mapa",
          tipo: "multipla_escolha_e_texto",
          titulo: "Mapa de onde estou",
          escolha: {
            pergunta: "Há quanto tempo você sente que algo precisa mudar?",
            opcoes: ["Isso é recente", "Há cerca de 3 anos", "Há mais de 5 anos", "Há tanto tempo que já nem sei"]
          },
          perguntas: [
            "O que ainda faz sentido no trabalho ou na carreira?",
            "O que certamente não funciona mais?",
            "O que pode estar me impedindo de mudar? (medo, dinheiro, falta de clareza, tudo junto)"
          ]
        },
        {
          id: "e1_linha_tempo",
          tipo: "linha_tempo",
          titulo: "Minha linha do tempo",
          instrucao: "Adicione cada experiência profissional que marcou sua trajetória. Para cada uma, responda às três perguntas. Pode adicionar quantas quiser.",
          perguntas: ["O que eu aprendi ali?", "O que me fez ficar?", "O que me fez sair?"]
        },
        {
          id: "e1_pilares",
          tipo: "pilares",
          titulo: "Os 3 pilares",
          instrucao: "Pensando na sua trajetória, marque o quanto cada pilar esteve presente. Eles ajudam a entender o que sustenta você num trabalho.",
          pilares: [
            { chave: "competencia", rotulo: "Competência percebida", ajuda: "Sentir que era bom ou estava preparado para o que fazia" },
            { chave: "reconhecimento", rotulo: "Reconhecimento", ajuda: "Sentir que o ambiente valorizava o que eu fazia" },
            { chave: "sentido", rotulo: "Sentido", ajuda: "Entender por que aquilo importava" }
          ],
          niveis: ["Faltou", "Em parte", "Tinha"]
        },
        {
          id: "e1_engajamento",
          tipo: "sintese",
          titulo: "Minha fórmula de engajamento",
          instrucao: "Olhando para tudo que você trouxe até aqui, complete a frase com o que a sua história prova — não com o que você acha que deveria querer.",
          puxar_de: ["e1_linha_tempo", "e1_pilares"],
          campo: { rotulo: "Eu me engajo quando...", placeholder: "Eu me engajo quando..." }
        },
        {
          id: "e1_habilidades",
          tipo: "texto_com_apoio",
          titulo: "O que eu já sei fazer",
          instrucao: "Releia o que você respondeu na linha do tempo (o que funcionou, o que aprendeu) e nomeie as habilidades que enxerga ali. Se travar, abra a lista de exemplos abaixo como apoio.",
          perguntas: ["Quais habilidades aparecem na minha trajetória?"],
          apoio: {
            titulo: "Exemplos de habilidades (clique para abrir)",
            itens: ["comunicação", "vendas", "negociação", "organização", "liderança", "ensinar / treinar",
                    "atendimento ao público", "criatividade", "resolução de problemas", "escrita",
                    "marketing", "planejamento", "trabalho em equipe", "gestão", "atenção a detalhes",
                    "aprender rápido", "improviso", "relacionamento com pessoas", "análise", "produção / mão na massa",
                    "realizar cálculos", "montar e editar planilhas", "usar inteligência artificial",
                    "falar outros idiomas", "lidar com dinheiro / finanças", "falar em público",
                    "escutar e acolher pessoas", "mediar conflitos", "pesquisar informação",
                    "usar redes sociais", "criar conteúdo (foto, vídeo, texto)", "cuidar / zelar de algo ou alguém",
                    "vender ideias e convencer", "lidar com tecnologia e aplicativos", "coordenar tarefas e prazos",
                    "ter paciência e persistência", "adaptar-se a mudanças", "dar e receber feedback"]
          }
        },
        {
          id: "e1_permanecer",
          tipo: "eixos",
          titulo: "O que precisa existir pra eu conseguir permanecer",
          instrucao: "Para cada item, descreva o que precisa existir no seu próximo ambiente de trabalho.",
          eixos: ["Ambiente", "Tipo de atividade", "Nível de autonomia", "Retornos esperados", "Rotina"]
        }
      ]
    },

    /* ============ ETAPA 2 — ULTRAPASSAR ============ */
    {
      numero: 2,
      nome: "Ultrapassar",
      subtitulo: "O que te manteve parada até agora",
      modulos: [
        {
          id: "e2_padrao",
          tipo: "texto",
          titulo: "Meu padrão",
          instrucao: "Olhe para suas experiências com honestidade.",
          perguntas: [
            "O que você faz quando as coisas ficam difíceis?",
            "E o que isso custou a você?"
          ]
        },
        {
          id: "e2_necessidade",
          tipo: "selecao_e_texto",
          titulo: "Trabalho e necessidade emocional",
          instrucao: "O que você espera que o trabalho te dê além de dinheiro? Selecione o que reconhecer em você.",
          opcoes: ["Reconhecimento", "Pertencimento", "Identidade", "Propósito", "Aprovação",
                   "Status / prestígio", "Autonomia", "Liberdade geográfica", "Estabilidade / segurança",
                   "Aprendizado constante", "Desafio", "Flexibilidade de horário",
                   "Equilíbrio com a vida pessoal", "Contribuição / impacto", "Conexão / amizades"],
          pergunta_texto: "Alguma dessas necessidades já prejudicou uma decisão profissional sua? Como?"
        },
        {
          id: "e2_trava",
          tipo: "duas_colunas",
          titulo: "O que me trava de verdade",
          instrucao: "Preencha as duas lacunas e compare. A diferença entre elas costuma revelar o obstáculo real.",
          coluna_a: "O que me impede de verdade de mudar (o que eu imagino)",
          coluna_b: "O que tem evidência real de que pode acontecer (fatos reais, não sensações)"
        },
        {
          id: "e2_desenvolver",
          tipo: "texto",
          titulo: "O que preciso desenvolver",
          instrucao: "Escolha um ponto só — o mais importante.",
          perguntas: [
            "Das coisas que aparecem na minha forma de agir e de me relacionar, qual é a que talvez possa me atrapalhar mais no próximo movimento?",
            "Qual ação mais simples eu posso ter para começar a modificar isso?"
          ]
        },
        {
          id: "e2_sustentar",
          tipo: "texto",
          titulo: "Sustentar o processo",
          instrucao: "Pense no momento em que a novidade passa, o entusiasmo cai e a dificuldade aparece.",
          perguntas: [
            "Como você costuma reagir nesse momento?",
            "O que você pretende fazer de diferente dessa vez?"
          ]
        }
      ]
    },

    /* ============ ETAPA 3 — MAPEAR ============ */
    {
      numero: 3,
      nome: "Mapear",
      subtitulo: "O que o mundo oferece para quem já tem história",
      modulos: [
        {
          id: "e3_dinheiro",
          tipo: "orcamento",
          titulo: "Minha relação com dinheiro agora",
          instrucao: "Preencha, linha a linha, o quanto você precisa (o necessário) e o quanto seria confortável (o desejável). Ao final, você terá dois números reais.",
          linhas: ["Moradia", "Transporte", "Alimentação", "Saúde", "Educação / cursos", "Lazer", "Reserva / poupança"],
          colunas: ["O necessário", "O desejável"]
        },
        {
          id: "e3_territorios",
          tipo: "territorios",
          titulo: "Territórios profissionais possíveis",
          instrucao: "Considerando quem você é e do que você precisa para permanecer, qual desses territórios tem mais condições de entregar isso? Reflita sobre cada um.",
          territorios: [
            { rotulo: "Empresa privada", ajuda: "Trabalhar contratada por uma empresa" },
            { rotulo: "Empresa pública", ajuda: "Concurso, órgão público, estabilidade" },
            { rotulo: "Profissional autônomo", ajuda: "Trabalhar por conta própria, prestar serviço, empreender" }
          ]
        },
        {
          id: "e3_hibridos",
          tipo: "caminhos",
          titulo: "Caminhos híbridos",
          instrucao: "Para quem tem muitos interesses, dá para combinar. Veja se algum desses modelos faz sentido para o seu momento.",
          opcoes: [
            { rotulo: "Duas frentes ao mesmo tempo", ajuda: "Atuar em duas atividades simultâneas" },
            { rotulo: "Combinar áreas numa função só", ajuda: "Unir duas competências num mesmo trabalho" },
            { rotulo: "Transição em etapas", ajuda: "Começar por um território e migrar para outro com o tempo" },
            { rotulo: "Não considero essa possibilidade", ajuda: "Prefiro focar em um único caminho" }
          ],
          pergunta_texto: "Qual faz mais sentido pra você agora, e por quê?"
        },
        {
          id: "e3_aprofundar",
          tipo: "oportunidades",
          titulo: "O que vale aprofundar",
          instrucao: "Adicione as oportunidades ou caminhos que surgiram para você até aqui (por exemplo: um cargo, uma área, um negócio, um concurso). Para cada um, responda as três perguntas. No final, foque nos que tiverem mais \"Sim\".",
          campoNome: "Oportunidade ou caminho",
          perguntas: [
            "Combina com o que descobri sobre mim?",
            "É viável financeiramente agora?",
            "Tem a ver com o que eu já sei fazer?"
          ],
          niveis: ["Sim", "Mais ou menos", "Não"]
        }
      ]
    },

    /* ============ ETAPA 4 — ORGANIZAR ============ */
    {
      numero: 4,
      nome: "Organizar",
      subtitulo: "Seu próximo capítulo, não sua vida inteira",
      modulos: [
        {
          id: "e4_mudanca",
          tipo: "selecao_e_texto",
          titulo: "Que tipo de mudança é essa",
          instrucao: "Leia o seu momento com honestidade e calibre a expectativa antes de montar o plano.",
          opcoes: ["Dentro da mesma área", "Virada de rota", "Mudança gradual", "Ruptura"],
          pergunta_texto: "Em uma frase: que tipo de mudança você está prestes a fazer?"
        },
        {
          id: "e4_capitulo",
          tipo: "texto",
          titulo: "Meu próximo capítulo",
          instrucao: "Foco no horizonte de 1 ano, em três momentos.",
          perguntas: [
            "O que faço nos próximos 30 dias?",
            "O que quero ter resolvido em 3 meses?",
            "Onde quero estar em 12 meses?"
          ]
        },
        {
          id: "e4_aprender",
          tipo: "texto",
          titulo: "O que preciso aprender",
          instrucao: "Sem lista de cursos. Seja cirúrgico.",
          perguntas: [
            "Dado o caminho que escolhi, qual é a lacuna mais urgente?",
            "Qual é o menor passo possível para começar a fechá-la?"
          ]
        },
        {
          id: "e4_marca",
          tipo: "sintese",
          titulo: "Quem eu já sou profissionalmente",
          instrucao: "Sua marca pessoal construída a partir da sua história — não do que você quer ser.",
          puxar_de: ["e1_linha_tempo", "e1_habilidades"],
          perguntas: [
            "O que aparece repetidamente na minha história profissional?",
            "O que as pessoas costumam me pedir ou reconhecer em mim?",
            "Como você quer ser lembrado daqui a algum tempo?"
          ]
        },
        {
          id: "e4_sinais",
          tipo: "texto",
          titulo: "Sinais de sucesso",
          instrucao: "Defina três marcos concretos e com prazo. Se isso acontecer, significa que você está no rumo certo. Pequenos o suficiente para serem reais, grandes o suficiente para importar.",
          perguntas: ["Sinal 1 (com prazo):", "Sinal 2 (com prazo):", "Sinal 3 (com prazo):"]
        },
        {
          id: "e4_compromissos",
          tipo: "texto",
          titulo: "Compromissos comigo mesmo",
          instrucao: "Três respostas curtas que fecham o processo com intenção.",
          perguntas: [
            "O que vou sustentar?",
            "O que não vou repetir?",
            "Quais sinais devo ficar alerta?"
          ]
        },
        {
          id: "e4_segundo_plano",
          tipo: "texto",
          titulo: "Em segundo plano",
          instrucao: "Uma decisão tomada com antecedência tira o peso do medo de errar e transforma a mudança numa aposta consciente.",
          perguntas: ["Se em quantos meses, e o quê? — 'Se em ___ meses isso não estiver funcionando, eu vou...'"]
        }
      ]
    }
  ]
};
