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
          instrucao: "Adicione cada experiência profissional que marcou sua trajetória — incluindo o emprego atual. Para cada uma, responda às perguntas. Pode adicionar quantas quiser.",
          perguntas: ["O que eu aprendi ali?", "O que me fez/faz ficar?", "O que me fez/faria sair?"]
        },
        {
          id: "e1_pilares",
          tipo: "pilares",
          titulo: "Os pilares",
          instrucao: "Marque o quanto cada pilar é importante para você — não o que você teve, mas o que faz sentido de verdade na sua vida. Eles revelam o que precisa existir no trabalho para você se sentir bem.",
          pilares: [
            { chave: "competencia", rotulo: "Competência percebida", ajuda: "Sentir que era bom ou estava preparado para o que fazia" },
            { chave: "reconhecimento", rotulo: "Reconhecimento", ajuda: "Sentir que o ambiente valorizava o que eu fazia" },
            { chave: "sentido", rotulo: "Sentido", ajuda: "Entender por que aquilo importava" },
            { chave: "retorno_financeiro", rotulo: "Retorno financeiro", ajuda: "O quanto o trabalho me remunerava de forma justa ou suficiente" },
            { chave: "satisfacao_pessoal", rotulo: "Satisfação pessoal", ajuda: "Gostar do que fazia, sentir prazer no dia a dia do trabalho" }
          ],
          niveis: ["Pouco importante", "Importante", "Essencial"]
        },
        {
          id: "e1_engajamento",
          tipo: "sintese",
          titulo: "Minha fórmula de engajamento",
          instrucao: "Olhando para tudo que você trouxe até aqui, complete a frase com o que a sua história comprova.",
          puxar_de: ["e1_linha_tempo", "e1_pilares"],
          campo: { rotulo: "Eu me engajo quando...", placeholder: "Eu me engajo quando..." },
          perguntas: ["Eu me sinto desmotivado quando..."]
        },
        {
          id: "e1_habilidades",
          tipo: "texto_com_apoio",
          titulo: "O que eu já sei fazer",
          instrucao: [
            "Existem dois caminhos para reconhecer suas habilidades.",
            "O primeiro é o que a sua história revela: na atividade da linha do tempo, você listou atividades que já realizou em cada função — isso é o olhar de fora para dentro.",
            "O segundo é o que você naturalmente já é: aquilo que faz com tanta facilidade que nem considera uma habilidade — isso é o olhar de dentro para fora. Os dois, juntos, formam um retrato mais completo do que você traz para o trabalho."
          ],
          perguntas: [
            "Que habilidades aparecem na minha trajetória?",
            "O que você faz com tanta naturalidade que nem percebe que é diferencial?",
            "O que você aprende com mais rapidez do que as pessoas ao seu redor?"
          ],
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
          instrucao: "Para cada item, descreva o que precisa existir no seu próximo ambiente de trabalho. Há uma lista de sugestões para cada item, porém você deve refletir para identificar as próprias necessidades.",
          eixos: [
            { rotulo: "Ambiente", exemplos: ["Presencial", "Remoto", "Híbrido", "Empresa grande", "Empresa pequena", "Por conta própria", "Com equipe", "Mais sozinho", "Ambiente dinâmico", "Ambiente calmo", "Externo (campo / rua)"] },
            { rotulo: "Tipo de atividade", exemplos: ["Criar e desenvolver", "Executar e entregar", "Ensinar e treinar", "Atender pessoas", "Analisar e resolver problemas", "Vender e convencer", "Organizar e planejar", "Liderar equipes", "Trabalhar com dados", "Cuidar de alguém ou algo"] },
            { rotulo: "Nível de autonomia", exemplos: ["Muita autonomia (decido como e quando)", "Autonomia moderada (tenho direção e escolho o caminho)", "Estrutura clara (prefiro saber o que se espera de mim)", "Trabalho próximo a outras pessoas"] },
            { rotulo: "Retornos esperados", exemplos: ["Remuneração acima da média", "Estabilidade e previsibilidade", "Aprendizado constante", "Impacto e contribuição", "Reconhecimento e visibilidade", "Flexibilidade e qualidade de vida", "Construir algo meu", "Progressão de carreira"] },
            { rotulo: "Rotina", exemplos: ["Horário fixo", "Horário flexível", "Home office", "Presencial", "Dias variados", "Ritmo intenso", "Ritmo tranquilo", "Sem hora extra", "Viagens frequentes"] }
          ]
        }
      ]
    },

    /* ============ ETAPA 2 — ULTRAPASSAR ============ */
    {
      numero: 2,
      nome: "Ultrapassar",
      subtitulo: "O que eu preciso vencer para chegar aonde quero",
      modulos: [
        {
          id: "e2_padrao",
          tipo: "texto",
          titulo: "Meu padrão",
          instrucao: "Olhe para as suas experiências e reflita: O que você faz quando as coisas ficam difíceis? Tente se lembrar de duas situações desafiadoras que viveu profissionalmente — uma com resultado insatisfatório e outra com resultado satisfatório.",
          perguntas: [
            "Situação 1: descreva brevemente o que aconteceu",
            "Situação 1: qual foi o resultado insatisfatório?",
            "Situação 2: descreva brevemente o que aconteceu",
            "Situação 2: qual foi o resultado satisfatório?",
            "O que eu fiz em ambas as situações?",
            "O que eu fiz somente quando tive um bom resultado?",
            "O que eu fiz somente quando tive um mau resultado?"
          ]
        },
        {
          id: "e2_necessidade",
          tipo: "selecao_e_texto",
          titulo: "O que o trabalho precisa me dar",
          instrucao: "Além do salário, o trabalho atende a outras necessidades — e elas influenciam nossas escolhas mais do que percebemos. Marque o que você reconhece em você. Procure considerar o que é mais relevante para você.",
          opcoes: ["Reconhecimento", "Pertencimento", "Identidade", "Propósito", "Aprovação",
                   "Status / prestígio", "Autonomia", "Liberdade geográfica", "Estabilidade / segurança",
                   "Aprendizado constante", "Desafio", "Flexibilidade de horário",
                   "Equilíbrio com a vida pessoal", "Contribuição / impacto", "Conexão / amizades"],
          pergunta_texto: "Alguma dessas necessidades já prejudicou uma decisão profissional sua? Como?"
        },
        {
          id: "e2_trava",
          tipo: "duas_colunas",
          titulo: "O que percebo que me atrapalha profissionalmente",
          instrucao: "Preencha as duas lacunas e compare. A diferença entre elas costuma revelar o obstáculo real.",
          coluna_a: "HOJE qual o maior obstáculo para uma mudança? (tudo o que você imagina)",
          coluna_b: "HOJE o que, de fato, pode acontecer? (fatos reais que não sejam hipóteses e nem sensações)"
        },
        {
          id: "e2_desenvolver",
          tipo: "texto",
          titulo: "Desenvolver habilidades para crescer",
          instrucao: "Liste as habilidades ou competências que você sente que gostaria de desenvolver — o que acrescentaria, o que faria diferença, o que você percebe que falta. Coloque até 5.",
          perguntas: [
            "1.",
            "2.",
            "3.",
            "4.",
            "5."
          ]
        },
        {
          id: "e2_sustentar",
          tipo: "texto",
          titulo: "Sustentar o processo",
          instrucao: "Pense no momento em que a novidade passa, o entusiasmo cai e a dificuldade aparece.",
          perguntas: [
            "Como você costuma reagir nesse momento?",
            "De que forma a sua atitude te aproxima ou te afasta do objetivo?"
          ]
        }
      ]
    },

    /* ============ ETAPA 3 — MAPEAR ============ */
    {
      numero: 3,
      nome: "Mapear",
      subtitulo: "O que eu quero do que o mundo tem pra oferecer",
      modulos: [
        {
          id: "e3_dinheiro",
          tipo: "orcamento",
          titulo: "Minha relação com dinheiro agora",
          instrucao: [
            "O dinheiro é o elemento que sustenta qualquer relação de trabalho — e por isso merece atenção real nesse processo.",
            "A forma como nos relacionamos com ele influencia as escolhas que fazemos, as ocupações que aceitamos e os motivos pelos quais nos mantemos em situações que nem sempre são confortáveis.",
            "Preencha, linha a linha, o quanto você precisa (o necessário) e o quanto seria confortável (o desejável). Ao final, você terá dois números reais."
          ],
          linhas: ["Moradia", "Transporte", "Alimentação", "Saúde", "Educação / cursos", "Lazer", "Reserva / poupança"],
          colunas: ["O necessário", "O desejável"]
        },
        {
          id: "e3_territorios",
          tipo: "territorios",
          titulo: "Cenários profissionais possíveis",
          instrucao: "Considerando quem você é e do que você precisa para permanecer, qual desses cenários tem mais condições de entregar isso? Reflita sobre cada um.",
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
          titulo: "O que vale considerar",
          instrucao: "Agora é hora de explorar o que existe lá fora. Pesquise no LinkedIn, em sites de vagas ou em qualquer outra fonte: um concurso, um cargo em outra empresa, uma mudança dentro da mesma empresa, um negócio próprio... Não precisa ser uma decisão — é uma exploração. Para cada possibilidade que chamar atenção, responda às perguntas. No final, avalie quais tiveram mais \"Sim\".",
          campoNome: "Oportunidade ou caminho",
          perguntas: [
            "Combina com o que descobri sobre mim?",
            "É viável financeiramente agora?",
            "Tem a ver com o que eu já sei fazer?",
            "Me aproxima do objetivo de vida que tenho agora?"
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
          tipo: "texto",
          titulo: "Que tipo de mudança é essa",
          instrucao: "Avalie o seu momento e ajuste a expectativa antes de montar o planejamento.",
          perguntas: [
            "Descreva a mudança que você está considerando fazer. Procure dar o máximo de detalhes que puder, isto é, como tem planejado isso dentro da sua cabeça."
          ]
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
          instrucao: "Seja objetivo nos próximos passos.",
          perguntas: [
            "Diante do caminho que escolhi, qual a necessidade mais urgente que preciso resolver?",
            "Qual é o menor passo possível para começar a resolvê-la?"
          ]
        },
        {
          id: "e4_marca",
          tipo: "sintese",
          titulo: "Quem eu já sou profissionalmente",
          instrucao: "Sua identidade profissional construída ao longo da sua trajetória.",
          voz: "primeira",
          puxar_de: ["e1_linha_tempo", "e1_habilidades"],
          perguntas: [
            "O que aparece repetidamente na minha história profissional?",
            "O que as pessoas costumam me pedir ou reconhecer em mim?",
            "Como eu quero ser lembrado daqui a algum tempo?"
          ]
        },
        {
          id: "e4_sinais",
          tipo: "texto",
          titulo: "Sinais de sucesso",
          instrucao: "Os sinais de sucesso não são projeções ou desejos — são fatos concretos que, quando acontecerem, vão indicar que você está no caminho certo. Defina três, com prazo.",
          exemplos: "Exemplos: \"Fiz minha primeira conversa com alguém da área (prazo: 30 dias)\"; \"Concluí o curso que planejei (prazo: 60 dias)\"; \"Enviei meu primeiro currículo para a nova área (prazo: 3 meses)\"; \"Fechei meu primeiro cliente (prazo: 6 meses)\"; \"Minha renda mensal chegou a R$X (prazo: 12 meses)\".",
          perguntas: ["Sinal 1 (com prazo):", "Sinal 2 (com prazo):", "Sinal 3 (com prazo):"]
        },
        {
          id: "e4_compromissos",
          tipo: "texto",
          titulo: "Compromissos comigo mesmo",
          instrucao: "Três respostas que vão te ajudar a permanecer no caminho e chegar ao objetivo.",
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
          instrucao: "Uma decisão tomada com reflexão e pesquisa tira o peso do medo de errar e transforma a sua história como matéria-prima para construir um novo caminho com sentido.",
          perguntas: [
            "Em quanto tempo você vai reavaliar se esse caminho está funcionando?",
            "Se nesse prazo não estiver funcionando, o que você vai fazer?"
          ]
        }
      ]
    }
  ]
};
