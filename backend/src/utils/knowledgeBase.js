const knowledgeBase = [
    // --- SAUDAÇÃO E BOAS-VINDAS ---
    {
        keywords: [
            "ola",
            "oi",
            "bom dia",
            "boa tarde",
            "boa noite",
            "saudacoes",
            "oi nepen",
            "olá",
            "tudo bem",
            "e aí",
        ],
        answer: [
            "Olá! Que bom ter você por aqui. Sou o assistente virtual do Grupo Nepen e estou pronto para te ajudar. Como posso ser útil hoje? 😊",
            "Oi! Tudo ótimo por aqui, e por aí? Sou o bot do Grupo Nepen, e fico feliz em ajudar no que precisar!",
            "Bem-vindo(a) ao Grupo Nepen! É um prazer conversar com você. Me diga, no que posso te auxiliar neste momento?",
            "Olá! Em que posso ser útil hoje? Sinta-se à vontade para perguntar!",
            "E aí! Como posso fazer seu dia melhor? Sou seu assistente aqui no Grupo Nepen. 😉",
        ],
        followUpQuestions: [
            "Quais são os serviços do Grupo Nepen?",
            "Qual o horário de atendimento?",
            "Como entro em contato com um humano?",
            "Onde vocês ficam?",
            "Conte-me sobre a Lei do Bem.",
        ],
        categories: ["saudacao", "boas-vindas"],
        personalTouch: [
            "É um prazer te ajudar!",
            "Sempre à disposição!",
            "Adoro bater um papo!",
        ],
    },

    // --- REAÇÕES A SENTIMENTOS (EMPATIA) ---
    {
        keywords: [
            "triste",
            "chateado",
            "desanimado",
            "frustrado",
            "nervoso",
            "preocupado",
            "problema",
            "difícil",
            "com raiva",
            "bravo",
            "irritado",
        ],
        answer: [
            "Sinto muito que você esteja se sentindo assim. Lembre-se, estou aqui para ajudar no que for possível. Que tal me contar mais sobre o que está acontecendo?",
            "Entendo que você esteja passando por um momento difícil. Não se preocupe, vamos tentar resolver isso juntos. Qual é a sua dúvida ou problema?",
            "Poxa, que pena que não está tudo bem. Conte comigo para tentar encontrar uma solução ou, se preferir, posso te direcionar para alguém que possa ajudar.",
            "Percebo sua frustração, e quero muito te ajudar a encontrar uma saída. Me explique o que te preocupa para que eu possa direcionar meus esforços.",
        ],
        sentimentResponse: {
            positive: "Que bom que pude ajudar! Conte comigo sempre!",
            neutral: "Entendi. Em que mais posso ajudar?",
            negative:
                "Sinto muito que ainda esteja se sentindo assim. Gostaria de falar com um de nossos especialistas?",
        },
        followUpQuestions: [
            "Quero falar com um humano.",
            "Como vocês podem me ajudar com isso?",
            "Quais serviços podem resolver meu problema?",
        ],
        categories: ["sentimentos", "problemas", "empatia"],
    },
    {
        keywords: [
            "feliz",
            "animado",
            "alegre",
            "satisfeito",
            "contente",
            "obrigado",
            "grato",
            "amei",
        ],
        answer: [
            "Que ótimo que você está se sentindo assim! Fico muito feliz em ter contribuído para isso. 😊",
            "Fico muito contente em saber! É para isso que estou aqui: para te ajudar da melhor forma possível.",
            "Excelente! Saber que pude te ajudar me deixa muito feliz. Se precisar de mais alguma coisa, é só chamar!",
            "Que maravilha! Adoro quando consigo deixar alguém feliz! Em que mais posso te ajudar a ter um dia ainda melhor?",
        ],
        sentimentResponse: {
            positive: "Que bom! Contribuição é o meu objetivo.",
            neutral: "Certo. E agora, o que mais posso fazer por você?",
            negative: "Entendi. Espero que eu possa te ajudar a mudar isso!",
        },
        followUpQuestions: [
            "Você é um bom bot!",
            "Quais são os próximos passos?",
            "Como faço para agradecer mais?",
        ],
        categories: ["sentimentos", "positivo", "agradecimento"],
        personalTouch: [
            "De nada! 😉",
            "Disponha!",
            "A satisfação é toda minha!",
        ],
    },

    // --- HORÁRIO DE ATENDIMENTO ---
    {
        keywords: [
            "horario",
            "funciona",
            "abre",
            "fecha",
            "atendimento",
            "expediente",
            "que horas",
        ],
        answer: [
            "Nosso horário de atendimento é de **Segunda a Quinta, das 08h às 18h**, e **Sexta-feira, das 08h às 17h**. Estamos sempre prontos para te receber! ⏰",
            "Você pode nos encontrar de Segunda a Quinta, das 8h às 18h, e nas Sextas, das 8h às 17h. Que tal nos fazer uma visita ou ligar nesse período?",
            "O Grupo Nepen funciona de Segunda a Quinta (08h-18h) e Sexta (08h-17h). Nosso time está te esperando!",
            "Para um atendimento presencial ou telefônico, nosso expediente é: Seg-Qui das 8h às 18h, e Sex das 8h às 17h.",
        ],
        followUpQuestions: [
            "Preciso de um atendimento fora desse horário, o que faço?",
            "Qual o telefone para contato?",
            "É possível agendar um horário?",
        ],
        categories: ["informacoes-gerais", "horario"],
    },

    // --- CONTATO E SUPORTE ---
    {
        keywords: [
            "contato",
            "telefone",
            "email",
            "falar com atendente",
            "ajuda",
            "suporte",
            "whatsapp",
            "duvida",
            "emergencia",
            "ligar",
            "falar com humano",
        ],
        answer: [
            "Para falar com um de nossos especialistas, você pode ligar para **(85) 9 9115-5111** (esse número também é WhatsApp!) ou enviar um e-mail para **faleconosco@nepen.org.br**. Estamos à disposição para te dar todo o suporte necessário!",
            "Precisa de um contato mais direto? Ligue ou envie um WhatsApp para **(85) 9 9115-5111**. Se preferir, nosso e-mail é **faleconosco@nepen.org.br**. Ficarei feliz em te conectar com a pessoa certa!",
            "Nossa equipe está pronta para te atender! Entre em contato pelo WhatsApp **(85) 9 9115-5111** ou por e-mail: **faleconosco@nepen.org.br**.",
            "Se sua dúvida é mais complexa ou precisa de um toque humano, chame a gente no **(85) 9 9115-5111** (WhatsApp) ou mande um e-mail para **faleconosco@nepen.org.br**. Eles terão prazer em ajudar!",
        ],
        contactInfo: {
            phone: "(85) 9 9115-5111",
            email: "faleconosco@nepen.org.br",
        },
        problemSolvingGuidance:
            "Se for uma emergência, ligue diretamente. Para outras questões, envie um e-mail com detalhes ou um WhatsApp com sua dúvida.",
        followUpQuestions: [
            "Qual o horário de atendimento do suporte?",
            "Vocês atendem por videochamada?",
            "Posso agendar uma reunião?",
        ],
        categories: ["contato", "suporte", "atendimento-humano"],
    },

    // --- SERVIÇOS DO GRUPO NEPEN (DETALHADO E COM SOLUÇÕES) ---
    {
        keywords: [
            "servicos",
            "o que voces fazem",
            "produtos",
            "serviços",
            "especialidades",
            "atuacao",
            "solucoes",
            "ajudar",
            "o que tem",
            "o que oferecem",
        ],
        answer: [
            "No Grupo Nepen, somos **especialistas em Inovação, Consultoria e Desenvolvimento de Sistemas**, sempre focando em agregar valor ao seu negócio! Nossas principais áreas são:\n\n" +
            "1.  **Consultoria em Incentivos Fiscais e Lei do Bem:** Maximize seus benefícios tributários e gerencie projetos de P&D de forma eficiente.\n" +
            "2.  **Consultoria em Pesquisa e Desenvolvimento (P&D) e Inovação:** Desenvolvemos estratégias personalizadas para impulsionar a inovação em sua empresa.\n" +
            "3.  **Desenvolvimento de Sistemas e Dispositivos:** Criamos soluções sob medida, como sistemas de backend para coleta de dados, gestão de energia, e dispositivos inovadores como o Smartfuse.\n\n" +
            "Tudo isso com total transparência e ética. Quer saber mais sobre algum deles? 😉",
            "Está buscando soluções inovadoras? O Grupo Nepen tem a expertise em **Consultoria (Incentivos Fiscais, P&D)** e **Desenvolvimento de Sistemas e Dispositivos (como o Smartfuse)**. Nosso objetivo é impulsionar a inovação e o crescimento da sua empresa! Qual área te interessa mais?",
            "Se você precisa de **consultoria estratégica** para incentivos fiscais ou inovação, ou busca **soluções tecnológicas personalizadas**, o Grupo Nepen é o parceiro ideal! Somos experts em transformar desafios em oportunidades através da Lei do Bem, P&D e desenvolvimento de sistemas.",
        ],
        problemSolvingGuidance:
            "Se você tem um problema fiscal, precisa inovar ou desenvolver uma nova tecnologia, nossos serviços podem ser a solução. Me diga mais sobre o seu desafio!",
        followUpQuestions: [
            "O que é a Lei do Bem?",
            "Vocês desenvolvem sistemas personalizados?",
            "O que é o Smartfuse?",
            "Como posso saber mais sobre a consultoria de P&D?",
            "Como posso ter um orçamento?",
        ],
        categories: ["servicos", "inovacao", "consultoria", "desenvolvimento"],
    },

    // --- LEI DO BEM (DETALHADO E EXPLICATIVO) ---
    {
        keywords: [
            "lei do bem",
            "incentivos fiscais",
            "beneficios fiscais",
            "incentivo fiscal",
            "desconto imposto",
            "pesquisa e desenvolvimento",
            "lei 11196",
        ],
        answer: [
            "A **Lei do Bem** (Lei nº 11.196/2005) é um super-incentivo fiscal à inovação no Brasil! Basicamente, ela permite que empresas que investem em Pesquisa e Desenvolvimento (P&D) possam deduzir esses gastos do Imposto de Renda e da CSLL, além de outros benefícios fiscais. É uma oportunidade incrível para inovar gastando menos! 💡",
            "Quer impulsionar a inovação na sua empresa com vantagens fiscais? A **Lei do Bem** é o caminho! Ela recompensa empresas que investem em P&D com deduções significativas no IR e CSLL. O Grupo Nepen é especialista em te ajudar a aproveitar todos esses benefícios.",
            "A **Lei do Bem** é a ferramenta governamental perfeita para quem busca inovação com retorno financeiro. Empresas que aplicam em Pesquisa e Desenvolvimento têm acesso a deduções fiscais importantes. Nosso time pode te guiar por todo esse processo!",
        ],
        problemSolvingGuidance:
            "Se sua empresa está investindo em inovação e busca reduzir custos tributários, a Lei do Bem é uma solução. Podemos analisar sua elegibilidade.",
        followUpQuestions: [
            "Minha empresa se qualifica para a Lei do Bem?",
            "Como o Grupo Nepen pode me ajudar com a Lei do Bem?",
            "Quais são os requisitos para a Lei do Bem?",
            "Quero uma consultoria sobre a Lei do Bem.",
        ],
        categories: ["servicos", "lei-do-bem", "incentivos-fiscais", "inovacao"],
    },

    // --- SMARTFUSE (DETALHADO E COM BENEFÍCIOS) ---
    {
        keywords: [
            "smartfuse",
            "dispositivo",
            "energia",
            "tecnologia",
            "gerenciamento de energia",
            "eficiencia energetica",
            "monitoramento",
        ],
        answer: [
            "O **Smartfuse** é um dos nossos dispositivos mais inovadores! Ele é uma solução de ponta para **gestão e monitoramento de energia**, oferecendo controle total e otimização do consumo. É ideal para empresas que querem mais eficiência energética e redução de custos. Quer saber como ele pode transformar sua gestão? ⚡",
            "Pensando em reduzir a conta de luz e otimizar o uso da energia? O **Smartfuse** é a nossa resposta! Esse dispositivo inteligente permite monitorar e gerenciar seu consumo com precisão, trazendo mais eficiência energética para o seu negócio.",
            "O Smartfuse é mais do que um dispositivo; é uma solução completa para sua **eficiência energética**. Com ele, você monitora, controla e otimiza o consumo de energia, gerando economia e sustentabilidade. Fico à disposição para tirar suas dúvidas!",
        ],
        problemSolvingGuidance:
            "Se você está enfrentando altos custos de energia ou falta de controle no consumo, o Smartfuse pode ser a solução ideal para otimização e economia.",
        followUpQuestions: [
            "Quais os benefícios do Smartfuse?",
            "Como o Smartfuse funciona na prática?",
            "Posso ver uma demonstração do Smartfuse?",
            "Como o Smartfuse reduz custos?",
        ],
        categories: ["produtos", "tecnologia", "energia", "inovacao"],
    },

    // --- LOCALIZAÇÃO E ENDEREÇOS ---
    {
        keywords: [
            "localizacao",
            "endereco",
            "onde ficam",
            "onde é",
            "como chegar",
            "mapa",
            "filiais",
            "escritorios",
            "unidades",
            "visitar",
        ],
        answer: [
            "O Grupo Nepen tem escritórios em locais estratégicos para te atender melhor:\n\n" +
            "📍 **Fortaleza/CE:** Rua Graciliano Ramos, 146, CEP: 60415-050.\n" +
            "📍 **Atibaia/SP:** Avenida Tégula, 888, Armazém 9 e 10.\n" +
            "📍 **Manaus/AM:** Rua Dr. Elvino Dantas, nº 587, sala 205, Pq Sucupiras, Coroado III.\n\n" +
            "Qual deles fica mais próximo de você? 😉",
            "Estamos pertinho de você em três cidades! Nossos escritórios estão localizados em **Fortaleza/CE**, **Atibaia/SP** e **Manaus/AM**. Se precisar do endereço completo, é só me pedir!",
            "Você pode nos encontrar em **Fortaleza**, **Atibaia (SP)** e **Manaus**. Nossas portas estão abertas para te receber dentro do horário de atendimento!",
        ],
        followUpQuestions: [
            "Posso visitar algum escritório?",
            "Vocês têm unidades em outras cidades?",
            "Qual o horário de funcionamento dos escritórios?",
        ],
        categories: ["informacoes-gerais", "localizacao"],
    },

    // --- GOVERNANÇA E INTEGRIDADE ---
    {
        keywords: [
            "governanca",
            "integridade",
            "codigo de conduta",
            "privacidade",
            "seguranca da informacao",
            "transparencia",
            "etica",
            "compliance",
            "lgpd",
        ],
        answer: [
            "Nossas ações são guiadas por princípios de **Governança e Integridade**! Temos um rigoroso **Código de Conduta** e **Políticas de Privacidade e Segurança da Informação** para garantir total transparência e ética em tudo que fazemos. Sua confiança e segurança são nossa prioridade! 🔒",
            "No Grupo Nepen, levamos a sério a **ética e a transparência**. Nossas políticas de **Governança e Integridade**, incluindo nosso Código de Conduta e as diretrizes de privacidade de dados, asseguram que operamos com a máxima responsabilidade.",
            "Para nós, **segurança da informação e privacidade** são inegociáveis. Nossas políticas internas de governança e integridade garantem a proteção dos seus dados e a conduta ética em todas as operações. Quer saber mais sobre algum aspecto específico?",
        ],
        followUpQuestions: [
            "Onde posso consultar o Código de Conduta?",
            "Quais dados vocês coletam e como os protegem?",
            "Vocês são certificados em segurança?",
            "Como vocês lidam com a LGPD?",
        ],
        categories: ["institucional", "governanca", "seguranca", "privacidade"],
    },

    // --- O QUE É P&D? (NOVO TÓPICO) ---
    {
        keywords: [
            "pesquisa e desenvolvimento",
            "p&d",
            "o que é p&d",
            "inovação",
            "inovacao",
        ],
        answer: [
            "**Pesquisa e Desenvolvimento (P&D)** é o processo de investigar, criar e aprimorar produtos, serviços ou processos, buscando inovações e melhorias significativas. É a base para a criação de novas tecnologias e soluções que transformam o mercado! O Grupo Nepen é especialista nisso. 🔬",
            "**P&D** é o motor da inovação! Envolve a busca por novos conhecimentos e o desenvolvimento de novas tecnologias e soluções. É onde a mágica da criação acontece, e nós amamos fazer parte disso!",
            "Se sua empresa quer estar à frente, **P&D** é fundamental. É o investimento em novas ideias, processos e produtos que garante sua competitividade e crescimento. No Grupo Nepen, oferecemos consultoria para otimizar seus projetos de P&D.",
        ],
        followUpQuestions: [
            "Como o Grupo Nepen ajuda com P&D?",
            "Quais os benefícios de investir em P&D?",
            "Quais são os tipos de P&D?",
        ],
        categories: ["inovacao", "p&d"],
    },

    // --- ORÇAMENTO / PROPOSTA (NOVO TÓPICO) ---
    {
        keywords: [
            "orcamento",
            "orçamento",
            "proposta",
            "cotacao",
            "preço",
            "quanto custa",
            "valores",
        ],
        answer: [
            "Para um **orçamento personalizado** ou uma proposta, preciso de um pouco mais de informação sobre sua necessidade! Por favor, entre em contato pelo nosso WhatsApp **(85) 9 9115-5111** ou envie um e-mail para **faleconosco@nepen.org.br**, descrevendo o serviço ou produto de seu interesse. Assim, nossa equipe poderá te ajudar com precisão! 💼",
            "Que ótimo que você tem interesse em nossos serviços! Para solicitar um **orçamento**, o ideal é que você nos detalhe sua demanda pelo WhatsApp **(85) 9 9115-5111** ou e-mail **faleconosco@nepen.org.br**. Estamos ansiosos para te apresentar a melhor solução!",
            "Os valores variam conforme o projeto, mas para ter um **orçamento** detalhado e sem compromisso, entre em contato direto com nossa equipe. Mande um WhatsApp para **(85) 9 9115-5111** ou um e-mail para **faleconosco@nepen.org.br**.",
        ],
        contactInfo: {
            phone: "(85) 9 9115-5111",
            email: "faleconosco@nepen.org.br",
        },
        problemSolvingGuidance:
            "Descreva o máximo de detalhes sobre seu projeto ou necessidade para que possamos fornecer um orçamento preciso.",
        followUpQuestions: [
            "Qual informação vocês precisam para o orçamento?",
            "Quanto tempo leva para receber uma proposta?",
            "Posso agendar uma reunião para apresentar meu projeto?",
        ],
        categories: ["comercial", "orcamento"],
    },
    // --- NOVO ITEM: ESTADO DE CONFUSÃO / AJUDA GERAL ---
    {
        keywords: [
            "nao sei",
            "confuso",
            "o que faço",
            "me ajuda",
            "nao entendi",
            "ajuda geral",
            "sem saber",
            "me oriente",
            "como funciona",
            "primeiros passos",
        ],
        answer: [
            "Parece que você está um pouco confuso(a) ou não tem certeza de como prosseguir. Não se preocupe, estou aqui para ajudar! 😊",
            "Entendi que você precisa de uma orientação mais geral. Para facilitar, o Grupo Nepen é especialista em algumas áreas chave:",
            "Ah, sim! Posso te ajudar a entender melhor. O Grupo Nepen atua fortemente em:",
        ],
        // Resposta complementar com os serviços e direcionamento para o WhatsApp
        serviceOffer:
            "\n\nNós somos especialistas em:\n" +
            "1.  **Consultoria em Incentivos Fiscais e Lei do Bem**\n" +
            "2.  **Consultoria em Pesquisa e Desenvolvimento (P&D) e Inovação**\n" +
            "3.  **Desenvolvimento de Sistemas e Dispositivos (como o Smartfuse)**\n\n" +
            "Para um atendimento mais personalizado ou se quiser detalhar sua necessidade, que tal conversar com a gente pelo WhatsApp? É só clicar aqui: [WhatsApp Grupo Nepen](https://wa.me/5585991155111?text=Ol%C3%A1%2C+preciso+de+ajuda+com+uma+d%C3%BAvida+geral+sobre+os+servi%C3%A7os+do+Grupo+Nepen.) ou ligar para (85) 9 9115-5111. Estamos prontos para te guiar! 😉",
        contactInfo: {
            phone: "(85) 9 9115-5111",
            whatsappLink: "https://wa.me/5585991155111?text=Ol%C3%A1%2C+preciso+de+ajuda+com+uma+d%C3%BAvida+geral+sobre+os+servi%C3%A7os+do+Grupo+Nepen.",
        },
        followUpQuestions: [
            "Quero saber mais sobre a Lei do Bem.",
            "Como funciona a consultoria de P&D?",
            "O que é o Smartfuse?",
            "Quero falar com um humano.",
        ],
        categories: ["ajuda-geral", "confusao", "servicos"],
    },

    // --- NOVO TÓPICO: RESPOSTAS GENÉRICAS PARA ELOGIOS AO BOT ---
    {
        keywords: [
            "bom bot",
            "otimo bot",
            "incrivel bot",
            "voce e bom",
            "voce e otimo",
            "voce e incrivel",
            "amei o bot",
        ],
        answer: [
            "Ah, que legal! Fico muito feliz que você esteja gostando da minha ajuda! 😊 Meu objetivo é sempre te atender da melhor forma possível. Tem mais alguma coisa em que posso te auxiliar?",
            "Obrigado(a) pelo elogio! Me esforço para ser o mais útil possível. É um prazer ajudar você!",
            "Saber que estou sendo útil me motiva! Agradeço o carinho. Como posso continuar aprimorando sua experiência?",
        ],
        categories: ["elogio-bot", "interacao-bot"],
        personalTouch: ["Disponha! 😉"],
    },

    // --- NOVO TÓPICO: PRÓXIMOS PASSOS GENÉRICOS ---
    {
        keywords: [
            "proximos passos",
            "e agora",
            "o que fazer agora",
            "o que devo fazer",
        ],
        answer: [
            "Para os próximos passos, o ideal é que me diga qual o seu objetivo! Assim posso te direcionar melhor. Por exemplo, você quer:",
            "Depende do que você busca! Para te ajudar, posso oferecer algumas opções:",
            "Certo! O que você gostaria de fazer a seguir? Posso te ajudar com:",
        ],
        followUpQuestions: [
            "Ter um orçamento.",
            "Falar com um especialista.",
            "Saber mais sobre um serviço específico.",
            "Agendar uma reunião.",
        ],
        categories: ["proximos-passos", "direcionamento"],
    },

    // --- NOVO TÓPICO: COMO AGRADECER MAIS ---
    {
        keywords: [
            "como agradecer",
            "agradecer mais",
            "quero agradecer",
        ],
        answer: [
            "Seu agradecimento já é o suficiente e me deixa muito feliz! 😊 Mas se quiser, pode me contar o que mais posso fazer para te ajudar ou se tem mais alguma dúvida.",
            "Fico feliz só de saber que pude te ajudar! Sua satisfação é a melhor forma de agradecimento. Posso te auxiliar em algo mais?",
            "Não precisa agradecer! Meu propósito é ser útil para você. Se surgir outra dúvida, é só chamar!",
        ],
        categories: ["agradecimento", "interacao-bot"],
        personalTouch: ["De nada! 😉"],
    },

    // --- NOVO TÓPICO: ATENDIMENTO FORA DO HORÁRIO / AGENDAMENTO ---
    {
        keywords: [
            "atendimento fora do horario",
            "atender fora horario",
            "fora do expediente",
            "agendar horario",
            "agendamento",
            "marcar horario",
            "reuniao",
            "visita",
        ],
        answer: [
            "Nosso atendimento regular é de Segunda a Quinta, das 08h às 18h, e Sexta, das 08h às 17h. Se precisar de algo fora desse horário, o ideal é **enviar um e-mail para faleconosco@nepen.org.br ou uma mensagem via WhatsApp para (85) 9 9115-5111** explicando sua necessidade. Assim, nossa equipe pode verificar a melhor forma de te ajudar ou agendar um horário especial! 🗓️",
            "Para agendamentos ou atendimentos fora do nosso expediente padrão, por favor, entre em contato com nossa equipe via WhatsApp **(85) 9 9115-5111** ou e-mail **faleconosco@nepen.org.br**. Eles poderão te orientar sobre a disponibilidade para um horário diferenciado.",
        ],
        contactInfo: {
            phone: "(85) 9 9115-5111",
            email: "faleconosco@nepen.org.br",
        },
        followUpQuestions: [
            "Qual o e-mail para agendamento?",
            "Qual o telefone do WhatsApp?",
            "É possível agendar uma videochamada?",
        ],
        categories: ["horario", "agendamento", "contato"],
    },

    // --- NOVO TÓPICO: ATENDIMENTO POR VIDEOCHAMADA ---
    {
        keywords: [
            "videochamada",
            "chamada de video",
            "reuniao online",
            "atendimento online",
        ],
        answer: [
            "Sim, podemos realizar atendimento por **videochamada**! Para agendar, por favor, entre em contato pelo nosso WhatsApp **(85) 9 9115-5111** ou envie um e-mail para **faleconosco@nepen.org.br** e informe sua disponibilidade. Nossa equipe irá coordenar o melhor dia e horário para você. 💻",
            "Com certeza! Agendar uma videochamada é uma ótima forma de conversarmos em detalhes. Mande uma mensagem para o WhatsApp **(85) 9 9115-5111** ou um e-mail para **faleconosco@nepen.org.br** e combinamos tudo!",
        ],
        contactInfo: {
            phone: "(85) 9 9115-5111",
            email: "faleconosco@nepen.org.br",
        },
        followUpQuestions: [
            "Como agendo uma videochamada?",
            "Quais plataformas vocês usam?",
            "Preciso me preparar para a videochamada?",
        ],
        categories: ["contato", "agendamento", "atendimento-online"],
    },

    // --- NOVO TÓPICO: ELEGIBILIDADE LEI DO BEM ---
    {
        keywords: [
            "minha empresa se qualifica",
            "quem se qualifica lei do bem",
            "requisitos lei do bem",
            "elegibilidade lei do bem",
            "minha empresa pode usar a lei do bem",
        ],
        answer: [
            "Para saber se sua empresa se qualifica para a **Lei do Bem**, precisamos analisar alguns pontos como:\n\n" +
            "1.  Ter **Lucro Real**.\n" +
            "2.  Possuir **Certidão Negativa de Débitos (CND)** ou positiva com efeito de negativa.\n" +
            "3.  Realizar **Pesquisa, Desenvolvimento e Inovação (PD&I)** tecnológica.\n\n" +
            "O Grupo Nepen oferece uma **consultoria completa** para avaliar sua elegibilidade e te ajudar a aproveitar ao máximo os benefícios. Que tal agendarmos uma conversa para isso? 🔍",
            "A qualificação para a Lei do Bem depende principalmente de sua empresa ser do **Lucro Real** e estar em dia com as obrigações fiscais (possuir CND). Além disso, é essencial que você realize projetos de P&D. Podemos fazer essa análise para você!",
        ],
        problemSolvingGuidance:
            "Se sua empresa se encaixa nos critérios básicos (Lucro Real e CND), o próximo passo é uma análise detalhada dos seus projetos de P&D.",
        followUpQuestions: [
            "Quero uma consultoria para avaliar a Lei do Bem.",
            "O que é Lucro Real?",
            "O que é CND?",
            "Como os projetos de P&D são avaliados?",
        ],
        categories: ["lei-do-bem", "elegibilidade", "consultoria"],
    },

    // --- NOVO TÓPICO: COMO O GRUPO NEPEN AJUDA COM A LEI DO BEM ---
    {
        keywords: [
            "como o grupo nepen ajuda lei do bem",
            "servicos lei do bem",
            "suporte lei do bem",
            "consultoria lei do bem",
        ],
        answer: [
            "O Grupo Nepen oferece um suporte 360º para a **Lei do Bem**! Nós te auxiliamos desde a **identificação de projetos elegíveis** até a **prestação de contas** e o **acompanhamento pós-uso do benefício**. Nosso trabalho inclui:\n\n" +
            "1.  Análise de elegibilidade da empresa e dos projetos.\n" +
            "2.  Mapeamento de despesas de P&D.\n" +
            "3.  Elaboração de relatórios técnicos e contábeis.\n" +
            "4.  Suporte na documentação e entrega à Receita Federal.\n" +
            "5.  Treinamento para suas equipes.\n\n" +
            "Nosso objetivo é garantir que você maximize seus incentivos fiscais com segurança e conformidade! 🤝",
            "Com o Grupo Nepen, você tem total tranquilidade para aplicar a Lei do Bem. Cuidamos de toda a burocracia, desde a identificação dos gastos com P&D até a entrega da documentação necessária, garantindo que sua empresa aproveite ao máximo os benefícios fiscais.",
        ],
        problemSolvingGuidance:
            "Se sua empresa quer usar a Lei do Bem e precisa de expertise para gerenciar o processo, o Grupo Nepen oferece a solução completa, desde a identificação até a prestação de contas.",
        followUpQuestions: [
            "Quero agendar uma reunião para falar sobre a Lei do Bem.",
            "Vocês oferecem treinamento para a Lei do Bem?",
            "Qual o custo da consultoria para a Lei do Bem?",
        ],
        categories: ["lei-do-bem", "consultoria", "servicos"],
    },

    // --- NOVO TÓPICO: BENEFÍCIOS DO SMARTFUSE ---
    {
        keywords: [
            "beneficios smartfuse",
            "vantagens smartfuse",
            "smartfuse reduz custos",
            "smartfuse economia",
            "smartfuse monitoramento",
            "smartfuse controle",
        ],
        answer: [
            "O **Smartfuse** traz uma série de benefícios para sua gestão de energia:\n\n" +
            "1.  **Redução de Custos:** Identifica desperdícios e otimiza o consumo, gerando economia significativa.\n" +
            "2.  **Monitoramento em Tempo Real:** Tenha controle total do consumo de energia a qualquer momento e de qualquer lugar.\n" +
            "3.  **Eficiência Energética:** Ajuda a identificar picos de consumo e a tomar decisões para um uso mais inteligente da energia.\n" +
            "4.  **Sustentabilidade:** Contribui para a redução do impacto ambiental da sua empresa.\n" +
            "5.  **Prevenção de Problemas:** Detecta anomalias na rede elétrica antes que causem falhas.\n\n" +
            "É a tecnologia trabalhando a favor da sua empresa! 💡",
            "Com o Smartfuse, você ganha **controle, economia e sustentabilidade**. Ele não só monitora o consumo de energia, como também te dá dados para otimizar o uso, reduzir a conta de luz e tomar decisões mais inteligentes sobre sua infraestrutura elétrica.",
        ],
        followUpQuestions: [
            "Como o Smartfuse funciona na prática?",
            "Posso ver uma demonstração do Smartfuse?",
            "Quero um orçamento do Smartfuse.",
        ],
        categories: ["smartfuse", "beneficios", "energia"],
    },

    // --- NOVO TÓPICO: COMO O SMARTFUSE FUNCIONA NA PRÁTICA ---
    {
        keywords: [
            "como smartfuse funciona",
            "smartfuse na pratica",
            "operacao smartfuse",
            "instalacao smartfuse",
        ],
        answer: [
            "O **Smartfuse** funciona de forma bem inteligente e prática! Ele é um dispositivo que se conecta à sua rede elétrica para **coletar dados de consumo em tempo real**. Essas informações são enviadas para uma plataforma intuitiva, onde você pode:\n\n" +
            "1.  Visualizar gráficos e relatórios detalhados.\n" +
            "2.  Acompanhar o consumo de máquinas e setores específicos.\n" +
            "3.  Receber alertas sobre picos ou anomalias.\n" +
            "4.  Gerenciar remotamente certos equipamentos (dependendo da configuração).\n\n" +
            "É como ter um 'cérebro' para sua energia, te dando total visibilidade e controle! Quer ver ele em ação?",
            "Na prática, o Smartfuse é instalado em pontos estratégicos da sua rede elétrica. Ele capta informações sobre o uso da energia e as envia para um software acessível de onde você estiver. Assim, você tem em mãos dados precisos para gerenciar e otimizar seu consumo.",
        ],
        followUpQuestions: [
            "Posso ver uma demonstração do Smartfuse?",
            "O Smartfuse é fácil de instalar?",
            "Preciso de alguma infraestrutura especial para o Smartfuse?",
        ],
        categories: ["smartfuse", "funcionamento", "tecnologia"],
    },

    // --- NOVO TÓPICO: DEMONSTRAÇÃO SMARTFUSE ---
    {
        keywords: [
            "demonstracao smartfuse",
            "ver smartfuse",
            "apresentacao smartfuse",
            "quero ver smartfuse",
        ],
        answer: [
            "Com certeza! Podemos agendar uma **demonstração do Smartfuse** para que você veja todas as suas funcionalidades na prática. Entre em contato pelo WhatsApp **(85) 9 9115-5111** ou e-mail **faleconosco@nepen.org.br** e informe seu interesse. Será um prazer te apresentar essa solução! 🖥️",
            "Adoraria te mostrar o Smartfuse em funcionamento! Para isso, por favor, entre em contato com nossa equipe comercial pelo WhatsApp **(85) 9 9115-5111** ou e-mail **faleconosco@nepen.org.br** para agendarmos a melhor data e formato da demonstração.",
        ],
        contactInfo: {
            phone: "(85) 9 9115-5111",
            email: "faleconosco@nepen.org.br",
        },
        followUpQuestions: [
            "A demonstração é online ou presencial?",
            "Quanto tempo dura a demonstração?",
            "Preciso me preparar para a demonstração?",
        ],
        categories: ["smartfuse", "demonstracao", "comercial"],
    },

    // --- NOVO TÓPICO: VISITAR ESCRITÓRIO ---
    {
        keywords: [
            "posso visitar escritorio",
            "visitar unidade",
            "conhecer escritorio",
        ],
        answer: [
            "Claro! Você é muito bem-vindo(a) para visitar um de nossos escritórios em **Fortaleza/CE, Atibaia/SP ou Manaus/AM**. Para garantir que alguém da nossa equipe esteja disponível para te atender da melhor forma, por favor, **agende sua visita** entrando em contato pelo WhatsApp **(85) 9 9115-5111** ou e-mail **faleconosco@nepen.org.br**. Assim, podemos preparar sua recepção! 😊",
            "Adoraríamos te receber em um de nossos escritórios! Para sua comodidade e para que possamos te dar a atenção que merece, sugerimos que agende sua visita. É só entrar em contato pelo WhatsApp **(85) 9 9115-5111** ou e-mail **faleconosco@nepen.org.br**.",
        ],
        contactInfo: {
            phone: "(85) 9 9115-5111",
            email: "faleconosco@nepen.org.br",
        },
        followUpQuestions: [
            "Qual o endereço de Fortaleza?",
            "Qual o horário para visitas?",
            "Preciso agendar com antecedência?",
        ],
        categories: ["localizacao", "visita", "contato"],
    },

    // --- NOVO TÓPICO: UNIDADES EM OUTRAS CIDADES ---
    {
        keywords: [
            "unidades em outras cidades",
            "filiais em outras cidades",
            "onde mais voces atuam",
        ],
        answer: [
            "Atualmente, o Grupo Nepen possui escritórios fixos em **Fortaleza/CE, Atibaia/SP e Manaus/AM**. No entanto, atendemos clientes em **todo o Brasil** com nossos serviços de consultoria e desenvolvimento de sistemas, muitas vezes de forma remota ou com visitas pontuais conforme a necessidade do projeto. Sua localização não é um impedimento para trabalharmos juntos! 🌎",
            "Nossas bases estão em Fortaleza, Atibaia e Manaus, mas nossa atuação se estende por todo o território nacional! Se sua empresa está em outra cidade, não se preocupe, podemos te atender com a mesma excelência. Entre em contato e vamos conversar sobre sua necessidade!",
        ],
        followUpQuestions: [
            "Vocês atendem em minha cidade (mencione a cidade)?",
            "Como funciona o atendimento remoto?",
            "Quais serviços são oferecidos remotamente?",
        ],
        categories: ["localizacao", "abrangencia-nacional"],
    },

    // --- NOVO TÓPICO: CÓDIGO DE CONDUTA ---
    {
        keywords: [
            "codigo de conduta",
            "consultar codigo de conduta",
            "onde ver codigo de conduta",
            "politicas internas",
        ],
        answer: [
            "Nosso **Código de Conduta e Ética** é um documento fundamental que guia todas as nossas ações e decisões. Para consultá-lo, você pode acessar a seção de Governança em nosso site oficial. Se tiver dificuldade em encontrar, posso te direcionar ao link específico ou, se preferir, posso te enviar um resumo dos principais pontos. Qual você prefere? 📄",
            "O Código de Conduta do Grupo Nepen está disponível para consulta em nosso site, na área de 'Governança e Integridade'. É onde detalhamos nosso compromisso com a ética, transparência e responsabilidade.",
        ],
        followUpQuestions: [
            "Qual o link para o Código de Conduta?",
            "Quais os principais pontos do Código de Conduta?",
            "Vocês têm um canal de denúncias?",
        ],
        categories: ["governanca", "integridade", "transparencia"],
    },

    // --- NOVO TÓPICO: DADOS COLETADOS E PROTEÇÃO (LGPD) ---
    {
        keywords: [
            "dados coletados",
            "como protegem dados",
            "privacidade dados",
            "lgpd",
            "lei geral protecao dados",
            "seguranca dos meus dados",
            "politica de privacidade",
        ],
        answer: [
            "A segurança e a privacidade dos seus dados são uma prioridade máxima para nós, e operamos em total conformidade com a **LGPD (Lei Geral de Proteção de Dados)**. Coletamos apenas os dados estritamente necessários para a prestação dos nossos serviços e para fins legais. Utilizamos medidas de segurança rigorosas, como criptografia e acesso restrito, para proteger suas informações. Você pode consultar nossa **Política de Privacidade** em nosso site para detalhes. Tem alguma dúvida específica sobre isso? 🔐",
            "No Grupo Nepen, todos os dados são tratados com o máximo cuidado e seguindo as diretrizes da LGPD. Implementamos fortes medidas de segurança para garantir que suas informações estejam protegidas. Nossa Política de Privacidade detalha tudo sobre como coletamos, usamos e protegemos seus dados.",
        ],
        followUpQuestions: [
            "Onde vejo a Política de Privacidade?",
            "Quem é o DPO do Grupo Nepen?",
            "Meus dados são compartilhados com terceiros?",
        ],
        categories: ["governanca", "seguranca", "privacidade", "lgpd"],
    },

    // --- NOVO TÓPICO: CERTIFICAÇÕES DE SEGURANÇA ---
    {
        keywords: [
            "certificacoes seguranca",
            "certificados de seguranca",
            "iso 27001",
            "seguranca certificada",
        ],
        answer: [
            "Estamos em constante aprimoramento de nossos processos de segurança. Atualmente, o Grupo Nepen segue as melhores práticas de mercado e está em processo de obtenção de **certificações de segurança da informação** relevantes para garantir o mais alto nível de proteção aos seus dados e projetos. Nosso compromisso é com a excelência em segurança! ✅",
            "A segurança da informação é um pilar para o Grupo Nepen. Embora não tenhamos uma certificação ISO 27001 no momento, operamos com rigorosos padrões e processos de segurança que espelham as melhores práticas do setor. Buscamos aprimorar continuamente nossas defesas para proteger suas informações.",
        ],
        followUpQuestions: [
            "Quais são essas melhores práticas?",
            "Quando esperam ter as certificações?",
            "Como auditam a segurança interna?",
        ],
        categories: ["governanca", "seguranca", "certificacoes"],
    },

    // --- NOVO TÓPICO: COMO O GRUPO NEPEN AJUDA COM P&D ---
    {
        keywords: [
            "como grupo nepen ajuda p&d",
            "consultoria p&d",
            "suporte p&d",
            "projetos p&d",
            "gestao p&d",
        ],
        answer: [
            "O Grupo Nepen é seu parceiro estratégico para alavancar seus projetos de **Pesquisa e Desenvolvimento (P&D)**! Oferecemos consultoria especializada que vai desde a **concepção de ideias inovadoras** até a **gestão completa** de projetos de P&D, garantindo que eles gerem valor e sejam elegíveis para incentivos fiscais (como a Lei do Bem). Nossos serviços incluem:\n\n" +
            "1.  Diagnóstico de maturidade de inovação.\n" +
            "2.  Estruturação de projetos de P&D.\n" +
            "3.  Metodologia de gestão e acompanhamento.\n" +
            "4.  Identificação de oportunidades de fomento.\n" +
            "5.  Suporte na documentação e relatórios.\n\n" +
            "Quer inovar com eficiência e estratégia? Conte conosco! 🚀",
            "Apoiamos sua empresa em todas as etapas do P&D: desde a validação da ideia e planejamento até a execução e mensuração de resultados. Com nossa consultoria, seus projetos de pesquisa e desenvolvimento se tornam mais estruturados, eficientes e alinhados aos seus objetivos estratégicos.",
        ],
        problemSolvingGuidance:
            "Se você tem ideias para P&D mas precisa de ajuda para estruturar, gerenciar ou garantir o aproveitamento de incentivos, nossa consultoria é a solução.",
        followUpQuestions: [
            "Quais os benefícios de investir em P&D?",
            "O Grupo Nepen ajuda a encontrar financiamento para P&D?",
            "Vocês oferecem treinamento em P&D?",
        ],
        categories: ["inovacao", "p&d", "consultoria"],
    },

    // --- NOVO TÓPICO: BENEFÍCIOS DE INVESTIR EM P&D ---
    {
        keywords: [
            "beneficios investir p&d",
            "vantagens p&d",
            "por que investir em p&d",
            "retorno p&d",
        ],
        answer: [
            "Investir em **Pesquisa e Desenvolvimento (P&D)** traz inúmeros benefícios para sua empresa! Os principais são:\n\n" +
            "1.  **Vantagem Competitiva:** Criação de produtos e serviços únicos que te diferenciam no mercado.\n" +
            "2.  **Redução de Custos:** Otimização de processos e insumos, gerando mais eficiência.\n" +
            "3.  **Aumento da Receita:** Lançamento de novidades que atraem novos clientes e mercados.\n" +
            "4.  **Incentivos Fiscais:** Possibilidade de acessar benefícios como a Lei do Bem, reduzindo impostos.\n" +
            "5.  **Reconhecimento de Marca:** Posicionamento como empresa inovadora e líder no setor.\n\n" +
            "É um investimento no futuro e na sustentabilidade do seu negócio! ✨",
            "Investir em P&D é essencial para a perenidade do seu negócio. Além de criar produtos e serviços inovadores, você otimiza processos, reduz custos, e ainda pode se beneficiar de incentivos fiscais importantes, como os da Lei do Bem.",
        ],
        followUpQuestions: [
            "A Lei do Bem é o único incentivo para P&D?",
            "Como mensuro o retorno do investimento em P&D?",
            "Quais setores mais se beneficiam de P&D?",
        ],
        categories: ["inovacao", "p&d", "beneficios"],
    },

    // --- NOVO TÓPICO: TIPOS DE P&D ---
    {
        keywords: [
            "tipos de p&d",
            "quais tipos p&d",
            "categorias p&d",
        ],
        answer: [
            "O **P&D** pode ser classificado em três tipos principais, que se complementam:\n\n" +
            "1.  **Pesquisa Básica:** Busca por novos conhecimentos, sem um objetivo prático imediato definido.\n" +
            "2.  **Pesquisa Aplicada:** Focada em encontrar uma aplicação prática para os conhecimentos gerados pela pesquisa básica, resolvendo um problema específico.\n" +
            "3.  **Desenvolvimento Experimental:** Utiliza o conhecimento existente para criar ou aprimorar novos produtos, processos ou serviços.\n\n" +
            "O Grupo Nepen atua em todas essas frentes, ajudando sua empresa a estruturar projetos em qualquer uma dessas categorias. Qual tipo te interessa mais?",
            "Existem basicamente três tipos de P&D: a pesquisa básica (para conhecimento puro), a pesquisa aplicada (para resolver problemas específicos) e o desenvolvimento experimental (para criar ou melhorar produtos e processos). Cada um tem sua importância e pode ser elegível para incentivos.",
        ],
        followUpQuestions: [
            "Qual a diferença entre pesquisa aplicada e desenvolvimento experimental?",
            "Minha empresa faz P&D em qual tipo?",
            "Qual tipo de P&D a Lei do Bem abrange?",
        ],
        categories: ["inovacao", "p&d", "tipos"],
    },

    // --- NOVO TÓPICO: INFORMAÇÕES PARA ORÇAMENTO ---
    {
        keywords: [
            "informacao para orcamento",
            "o que precisa para orcamento",
            "detalhes para proposta",
            "dados para orcamento",
        ],
        answer: [
            "Para que possamos elaborar um **orçamento preciso** e adequado à sua necessidade, as informações mais importantes que precisamos são:\n\n" +
            "1.  **Qual serviço ou produto você tem interesse?** (Ex: Consultoria Lei do Bem, Desenvolvimento de Sistema, Smartfuse, etc.)\n" +
            "2.  **Qual o principal objetivo ou problema que você busca resolver?**\n" +
            "3.  **Qual o prazo esperado para a solução?** (Se houver)\n" +
            "4.  **Qual o tamanho da sua empresa ou escopo do projeto?**\n\n" +
            "Quanto mais detalhes você puder fornecer, mais assertivo será nosso orçamento! Você pode enviar essas informações para **faleconosco@nepen.org.br** ou pelo WhatsApp **(85) 9 9115-5111**.",
            "Para um orçamento, precisamos entender sua demanda. Se é consultoria, qual o foco? Se é sistema, quais funcionalidades? Se é Smartfuse, para qual aplicação? Quanto mais claro você for, mais rápido e preciso será nosso retorno. Nosso time comercial está pronto para te ajudar a detalhar!",
        ],
        contactInfo: {
            phone: "(85) 9 9115-5111",
            email: "faleconosco@nepen.org.br",
        },
        followUpQuestions: [
            "Posso explicar meu projeto por telefone?",
            "Vocês podem me ajudar a identificar o que preciso?",
            "Existe um formulário para pedido de orçamento?",
        ],
        categories: ["orcamento", "informacoes-comerciais"],
    },

    // --- NOVO TÓPICO: TEMPO PARA RECEBER PROPOSTA ---
    {
        keywords: [
            "tempo para proposta",
            "quanto tempo orcamento",
            "prazo proposta",
            "rapidez orcamento",
        ],
        answer: [
            "O tempo para receber uma proposta ou orçamento do Grupo Nepen varia conforme a complexidade da sua demanda. Para projetos mais simples, podemos ter um retorno em **até 24-48 horas úteis** após o entendimento inicial da necessidade. Para projetos mais complexos de consultoria ou desenvolvimento, pode levar um pouco mais, mas sempre te manteremos informado sobre o andamento. Para agilizar, forneça o máximo de detalhes ao solicitar! ⏱️",
            "Nosso objetivo é ser o mais rápido possível! Projetos mais definidos geralmente têm propostas em 1 a 2 dias úteis. Para demandas mais elaboradas, pode ser que precisemos de uma conversa aprofundada para entender tudo e montar a melhor proposta, o que pode estender um pouco o prazo.",
        ],
        followUpQuestions: [
            "Como posso acelerar o processo?",
            "Quem é o responsável por orçamentos?",
            "Posso acompanhar o status da minha proposta?",
        ],
        categories: ["orcamento", "prazo", "comercial"],
    },

    // --- NOVO TÓPICO: AGENDAR REUNIÃO PARA PROJETO ---
    {
        keywords: [
            "agendar reuniao projeto",
            "apresentar projeto",
            "marcar conversa projeto",
            "falar sobre meu projeto",
        ],
        answer: [
            "Sim, com certeza! Adoramos conhecer novos projetos e entender como podemos contribuir. Para agendar uma reunião e nos apresentar sua ideia, por favor, entre em contato pelo WhatsApp **(85) 9 9115-5111** ou envie um e-mail para **faleconosco@nepen.org.br**. Nossa equipe comercial está pronta para te atender! 🗓️",
            "Será um prazer conversar sobre seu projeto! Agendar uma reunião é o melhor caminho. Entre em contato pelos nossos canais (WhatsApp ou e-mail) e nos diga qual a sua disponibilidade. Estamos ansiosos para ouvir suas ideias!",
        ],
        contactInfo: {
            phone: "(85) 9 9115-5111",
            email: "faleconosco@nepen.org.br",
        },
        followUpQuestions: [
            "A reunião pode ser online?",
            "Quanto tempo dura a reunião?",
            "Preciso levar alguma documentação?",
        ],
        categories: ["orcamento", "agendamento", "comercial"],
    },

    // --- NOVO TÓPICO: LUCRO REAL ---
    {
        keywords: [
            "o que é lucro real",
            "regime tributario lucro real",
            "lucro real para lei do bem",
        ],
        answer: [
            "**Lucro Real** é um regime tributário brasileiro para cálculo do Imposto de Renda (IRPJ) e da Contribuição Social sobre o Lucro Líquido (CSLL), onde a apuração é feita com base no lucro contábil ajustado por adições, exclusões e compensações. É um requisito fundamental para que uma empresa possa usufruir dos benefícios da **Lei do Bem**. Empresas com faturamento acima de R$ 78 milhões anuais são obrigadas a esse regime, mas outras podem optar por ele. Sua empresa se enquadra? 📊",
            "No Lucro Real, os impostos são calculados sobre o lucro líquido efetivo da empresa, com ajustes previstos em lei. É um dos pré-requisitos para acessar os incentivos da Lei do Bem, pois permite a dedução de gastos com P&D.",
        ],
        followUpQuestions: [
            "Minha empresa pode mudar para Lucro Real?",
            "Quais as vantagens do Lucro Real?",
            "O Grupo Nepen ajuda com contabilidade?",
        ],
        categories: ["lei-do-bem", "tributacao", "lucro-real"],
    },

    // --- NOVO TÓPICO: CND (CERTIDÃO NEGATIVA DE DÉBITOS) ---
    {
        keywords: [
            "o que é cnd",
            "certidao negativa de debitos",
            "importancia cnd",
            "cnd lei do bem",
        ],
        answer: [
            "A **CND (Certidão Negativa de Débitos)** é um documento emitido por órgãos públicos que comprova a regularidade fiscal de uma empresa ou pessoa física, ou seja, que não existem pendências de dívidas ou outras irregularidades. Para a **Lei do Bem**, possuir a CND (ou uma Certidão Positiva com Efeitos de Negativa) é um **requisito obrigatório** para comprovar que a empresa está em dia com suas obrigações fiscais e previdenciárias e, assim, poder usufruir dos incentivos. Você tem sua CND em dia? ✅",
            "A Certidão Negativa de Débitos é como um atestado de 'bom pagador' com o governo. Para a Lei do Bem, ela é fundamental, pois o benefício fiscal só é concedido a empresas que não possuem dívidas tributárias federais e com a Previdência Social.",
        ],
        followUpQuestions: [
            "Como consigo uma CND?",
            "O que fazer se tiver débitos?",
            "O Grupo Nepen ajuda com regularização fiscal?",
        ],
        categories: ["lei-do-bem", "tributacao", "cnd"],
    },

    // --- NOVO TÓPICO: AVALIAÇÃO DE PROJETOS P&D PARA LEI DO BEM ---
    {
        keywords: [
            "como projetos p&d avaliados",
            "criterios p&d lei do bem",
            "elegibilidade projetos p&d",
            "o que qualifica um projeto p&d",
        ],
        answer: [
            "Para que um projeto de **P&D** seja elegível para os benefícios da **Lei do Bem**, ele precisa atender a critérios específicos que demonstrem a inovação e o esforço técnico. Basicamente, os projetos são avaliados quanto a:\n\n" +
            "1.  **Originalidade/Novidade:** O projeto busca uma solução nova ou uma melhoria substancial?\n" +
            "2.  **Risco Tecnológico:** Há incerteza quanto ao resultado técnico ou à viabilidade da solução?\n" +
            "3.  **Caráter Sistemático:** As atividades são organizadas, planejadas e documentadas?\n" +
            "4.  **Conhecimento Agregado:** O projeto gera novos conhecimentos ou tecnologias?\n\n" +
            "Nossa consultoria é especializada em identificar e documentar esses aspectos em seus projetos para garantir a conformidade e o aproveitamento do benefício. Podemos detalhar isso para você! 📝",
            "Um projeto de P&D para a Lei do Bem é avaliado pela sua originalidade, pelo risco tecnológico envolvido (ou seja, se há incerteza em alcançar o resultado) e pela forma como é estruturado e documentado. Precisamos demonstrar que houve um esforço genuíno de pesquisa e desenvolvimento.",
        ],
        followUpQuestions: [
            "Preciso de uma equipe de P&D para me qualificar?",
            "Qual a documentação necessária para os projetos?",
            "Qual o papel do Grupo Nepen nessa avaliação?",
        ],
        categories: ["lei-do-bem", "p&d", "elegibilidade-projetos"],
    },

    // --- NOVO TÓPICO: OUTROS INCENTIVOS PARA P&D ---
    {
        keywords: [
            "outros incentivos p&d",
            "alem da lei do bem",
            "outros beneficios inovacao",
            "financiamento p&d",
        ],
        answer: [
            "A **Lei do Bem** é o principal, mas existem outros **incentivos à inovação e P&D** no Brasil! O Grupo Nepen também pode te orientar sobre programas como:\n\n" +
            "1.  **Fundos de Financiamento:** Linhas de crédito subsidiadas de bancos como BNDES e FINEP.\n" +
            "2.  **Incentivos Regionais/Estaduais:** Programas de fomento à inovação específicos de alguns estados ou municípios.\n" +
            "3.  **Subvenção Econômica:** Recursos não reembolsáveis para projetos de inovação.\n" +
            "4.  **Programas Setoriais:** Incentivos para setores específicos da economia.\n\n" +
            "Podemos fazer um diagnóstico para identificar quais oportunidades sua empresa pode aproveitar! 📈",
            "Além da Lei do Bem, há diversas outras formas de incentivar P&D, incluindo fundos governamentais, subvenções e programas regionais. O Grupo Nepen tem expertise para te ajudar a navegar por essas opções e encontrar as mais adequadas para o seu negócio.",
        ],
        followUpQuestions: [
            "Como o Grupo Nepen ajuda a conseguir esses incentivos?",
            "Quais são os requisitos para esses outros incentivos?",
            "Qual o melhor incentivo para minha empresa?",
        ],
        categories: ["inovacao", "p&d", "incentivos-fiscais", "financiamento"],
    },

    // --- NOVO TÓPICO: MENSURAR RETORNO P&D ---
    {
        keywords: [
            "mensurar retorno p&d",
            "roi p&d",
            "como medir p&d",
            "indicadores p&d",
        ],
        answer: [
            "Mensurar o retorno sobre o investimento em **P&D (ROI de P&D)** é crucial e pode ser feito através de diversos indicadores, tanto financeiros quanto estratégicos. Alguns exemplos são:\n\n" +
            "1.  **Economia gerada** por novos processos ou produtos.\n" +
            "2.  **Aumento da receita** com inovações.\n" +
            "3.  **Redução de custos** operacionais.\n" +
            "4.  **Número de patentes** ou registros de software.\n" +
            "5.  **Market share** conquistado por produtos inovadores.\n" +
            "6.  **Benefícios fiscais** obtidos (Lei do Bem).\n\n" +
            "Nossa consultoria pode te ajudar a definir as métricas mais adequadas e a monitorar o ROI dos seus projetos de P&D de forma eficiente! 📊",
            "Medir o retorno do P&D envolve olhar para a economia de custos, o aumento de receita, o número de inovações geradas e, claro, os incentivos fiscais que você consegue. O Grupo Nepen pode te ajudar a criar um sistema de indicadores para acompanhar isso de perto.",
        ],
        followUpQuestions: [
            "Qual a melhor forma de acompanhar esses indicadores?",
            "Vocês oferecem ferramentas para gestão de P&D?",
            "Como a Lei do Bem impacta o ROI do P&D?",
        ],
        categories: ["inovacao", "p&d", "gestao", "roi"],
    },

    // --- NOVO TÓPICO: SETORES BENEFICIADOS POR P&D ---
    {
        keywords: [
            "setores beneficiados p&d",
            "quem mais usa p&d",
            "industrias p&d",
            "qual empresa se beneficia p&d",
        ],
        answer: [
            "Praticamente todos os setores podem se beneficiar do investimento em **P&D**, mas alguns se destacam pela intensidade e pelo retorno das inovações. Os mais comuns são:\n\n" +
            "1.  **Tecnologia da Informação (TI):** Desenvolvimento de softwares, inteligência artificial, cybersecurity.\n" +
            "2.  **Indústria:** Novas máquinas, processos de produção, materiais.\n" +
            "3.  **Saúde e Farmacêutica:** Novas drogas, tratamentos, equipamentos médicos.\n" +
            "4.  **Engenharia:** Soluções para infraestrutura, energia, meio ambiente.\n" +
            "5.  **Agronegócio:** Novas culturas, biotecnologia, equipamentos agrícolas.\n\n" +
            "Se sua empresa busca diferenciação e crescimento, P&D é essencial, independentemente do setor! O Grupo Nepen tem experiência multidisciplinar para te atender. 🌍",
            "Empresas de TI, indústria, saúde, agronegócio e energia são alguns dos setores que mais investem e colhem os frutos do P&D. No entanto, a inovação é transversal, e qualquer empresa pode se beneficiar ao aplicar a pesquisa e desenvolvimento em seus produtos ou processos.",
        ],
        followUpQuestions: [
            "Meu setor é (mencione o setor), como P&D pode me ajudar?",
            "Vocês têm cases de sucesso em P&D em diferentes setores?",
            "O Grupo Nepen atende empresas de todos os portes?",
        ],
        categories: ["inovacao", "p&d", "setores"],
    },

    // --- NOVO TÓPICO: DIFERENÇA PESQUISA APLICADA E DESENVOLVIMENTO EXPERIMENTAL ---
    {
        keywords: [
            "diferenca pesquisa aplicada desenvolvimento experimental",
            "pesquisa aplicada x desenvolvimento",
            "o que e pesquisa aplicada",
            "o que e desenvolvimento experimental",
        ],
        answer: [
            "A diferença entre **Pesquisa Aplicada** e **Desenvolvimento Experimental** é sutil, mas importante para a Lei do Bem:\n\n" +
            "1.  **Pesquisa Aplicada:** Tem um objetivo prático específico. Ela busca aplicar conhecimentos existentes ou gerados pela pesquisa básica para resolver um problema ou criar uma nova tecnologia.\n" +
            "2.  **Desenvolvimento Experimental:** Pega os conhecimentos da pesquisa aplicada (ou básica) e os transforma em algo tangível – um protótipo, um novo produto, um processo melhorado. É a fase de testes e validação para levar a ideia ao mercado.\n\n" +
            "Ambas são cruciais para a inovação e são elegíveis para os incentivos da Lei do Bem. Conseguimos te ajudar a identificar e documentar cada fase de seus projetos! 🤔",
            "A Pesquisa Aplicada tenta resolver um problema prático através da aplicação de conhecimento, enquanto o Desenvolvimento Experimental é a fase de concretização, de transformar essa solução em algo funcional, como um protótipo ou um novo produto/processo testado.",
        ],
        followUpQuestions: [
            "Um projeto pode ter os dois tipos de P&D?",
            "Qual o foco do Grupo Nepen nesses tipos de P&D?",
            "A documentação é diferente para cada tipo?",
        ],
        categories: ["inovacao", "p&d", "tipos"],
    },
    // --- NOVO TÓPICO: MINHA EMPRESA FAZ P&D EM QUAL TIPO? ---
    {
        keywords: [
            "minha empresa faz p&d em qual tipo",
            "como identificar tipo de p&d",
            "classificacao p&d minha empresa",
        ],
        answer: [
            "Para identificar em qual tipo de **P&D** sua empresa se encaixa (Pesquisa Básica, Aplicada ou Desenvolvimento Experimental), precisamos entender as atividades que você realiza. Geralmente, a maioria das empresas foca em **Pesquisa Aplicada** (resolvendo problemas específicos) e **Desenvolvimento Experimental** (criando ou aprimorando produtos/processos).",
            "Você pode me dar mais detalhes sobre o que sua empresa está desenvolvendo ou pesquisando? Assim, consigo te ajudar a classificar e, mais importante, a ver como isso se alinha à Lei do Bem! 😊",
            "A classificação do P&D da sua empresa depende do estágio e do objetivo das suas atividades. Se você está criando um protótipo, é desenvolvimento experimental. Se está buscando uma nova forma de aplicar uma tecnologia existente, é pesquisa aplicada. Podemos analisar seus projetos para te dar uma visão clara.",
        ],
        followUpQuestions: [
            "Pode me dar exemplos de cada tipo de P&D?",
            "Como o Grupo Nepen avalia meus projetos para P&D?",
            "Essa classificação impacta os benefícios fiscais?",
        ],
        categories: ["p&d", "tipos", "identificacao-p&d"],
    },
    // --- NOVO TÓPICO: QUAL TIPO DE P&D A LEI DO BEM ABRANGE? ---
    {
        keywords: [
            "qual tipo p&d lei do bem abrange",
            "lei do bem pesquisa aplicada",
            "lei do bem desenvolvimento experimental",
            "lei do bem pesquisa basica",
        ],
        answer: [
            "A **Lei do Bem** é abrangente e engloba os três tipos de **Pesquisa e Desenvolvimento (P&D)**: **Pesquisa Básica, Pesquisa Aplicada e Desenvolvimento Experimental**. O mais importante é que as atividades demonstrem esforço técnico e incerteza no resultado, visando à inovação. Nosso papel é te ajudar a identificar e documentar adequadamente todas as suas atividades de P&D para que elas sejam reconhecidas pela Lei do Bem. Qual tipo de P&D você está realizando? 🤔",
            "Sim, a Lei do Bem abrange os três tipos de P&D! O foco é que a atividade gere inovação ou aprimoramento, com um certo nível de risco tecnológico. Se você está desenvolvendo algo novo ou melhorando significativamente um produto/processo, há grandes chances de se qualificar.",
        ],
        followUpQuestions: [
            "Existe alguma preferência por tipo de P&D na Lei do Bem?",
            "Como comprovar que um projeto é P&D para a Lei do Bem?",
            "O Grupo Nepen me ajuda a documentar isso?",
        ],
        categories: ["lei-do-bem", "p&d", "elegibilidade-projetos"],
    },

    // --- NOVO TÓPICO: QUEM É O DPO DO GRUPO NEPEN? ---
    {
        keywords: [
            "quem é o dpo",
            "dpo grupo nepen",
            "encarregado de dados",
            "contato lgpd",
        ],
        answer: [
            "O **DPO (Data Protection Officer)**, ou Encarregado de Dados, do Grupo Nepen é o profissional responsável por garantir a conformidade com a LGPD e atuar como canal de comunicação entre o titular dos dados, a empresa e a Autoridade Nacional de Proteção de Dados (ANPD).",
            "Para entrar em contato com nosso DPO ou para dúvidas sobre privacidade de dados, você pode enviar um e-mail para **privacidade@nepen.org.br**. Ele(a) estará pronto(a) para te auxiliar! 🔒",
        ],
        contactInfo: {
            email: "privacidade@nepen.org.br",
        },
        followUpQuestions: [
            "Qual o papel do DPO?",
            "Como faço uma solicitação de dados?",
            "Onde vejo a política de privacidade completa?",
        ],
        categories: ["lgpd", "privacidade", "governanca"],
    },

    // --- NOVO TÓPICO: MEUS DADOS SÃO COMPARTILHADOS COM TERCEIROS? ---
    {
        keywords: [
            "dados compartilhados",
            "compartilham dados",
            "terceiros dados",
            "vazamento de dados",
        ],
        answer: [
            "A proteção dos seus dados é fundamental para o Grupo Nepen. Nós **não compartilhamos seus dados pessoais com terceiros para fins comerciais** ou sem a sua permissão explícita, exceto em casos estritamente necessários para a prestação dos nossos serviços (ex: parceiros tecnológicos sob acordos de confidencialidade) ou quando exigido por lei. Tudo isso está detalhado em nossa **Política de Privacidade**. Sua segurança é nossa prioridade! 🛡️",
            "Seus dados são confidenciais e tratados com o máximo rigor. O compartilhamento ocorre apenas quando essencial para a execução de um serviço que você contratou, e sempre com parceiros que também seguem as normas de segurança e privacidade. Nunca para venda ou uso indevido.",
        ],
        followUpQuestions: [
            "Onde vejo a política de privacidade para detalhes?",
            "Com quem vocês podem compartilhar dados (exemplos)?",
            "Como vocês garantem a segurança em caso de compartilhamento?",
        ],
        categories: ["lgpd", "privacidade", "seguranca"],
    },

    // --- NOVO TÓPICO: AGENDAR REUNIÃO (GENÉRICO) ---
    {
        keywords: [
            "agendar reuniao",
            "marcar reuniao",
            "agendar conversa",
            "fazer reuniao",
        ],
        answer: [
            "Para agendarmos uma reunião, seja online ou presencial, por favor, entre em contato com nossa equipe pelo WhatsApp **(85) 9 9115-5111** ou envie um e-mail para **faleconosco@nepen.org.br**. Nos diga o assunto e sua disponibilidade para que possamos te conectar com o especialista certo. 🤝",
            "Sim, é totalmente possível agendar um horário! Para facilitar, envie um WhatsApp para **(85) 9 9115-5111** ou um e-mail para **faleconosco@nepen.org.br** informando o motivo da reunião e seus horários preferidos. Assim, agilizamos o processo!",
        ],
        contactInfo: {
            phone: "(85) 9 9115-5111",
            email: "faleconosco@nepen.org.br",
        },
        followUpQuestions: [
            "A reunião pode ser online?",
            "Quanto tempo dura uma reunião típica?",
            "Preciso me preparar para a reunião?",
        ],
        categories: ["agendamento", "contato", "reuniao"],
    },
    // --- NOVO TÓPICO: Ajuda a encontrar financiamento para P&D? ---
    {
        keywords: [
            "ajuda a encontrar financiamento p&d",
            "ajudam a conseguir dinheiro para p&d",
            "financiar p&d",
            "fomento a inovacao",
            "bndes",
            "finep",
        ],
        answer: [
            "Sim! O Grupo Nepen não só te ajuda a estruturar seus projetos de P&D, mas também te orienta na busca por **linhas de financiamento e fomento à inovação**! Temos expertise para identificar os programas mais adequados para sua empresa (como BNDES, FINEP, entre outros), auxiliar na elaboração de propostas e na gestão dos recursos. Nosso objetivo é que sua inovação se torne realidade com o melhor suporte financeiro! 💰",
            "Com certeza! A obtenção de recursos para P&D é uma das nossas especialidades. Identificamos as melhores fontes de financiamento para o seu projeto, auxiliamos na elaboração de documentação e no trâmite burocrático, maximizando suas chances de aprovação.",
        ],
        followUpQuestions: [
            "Quais os tipos de financiamento para P&D?",
            "Minha empresa se qualifica para financiamento?",
            "Como funciona a assessoria do Grupo Nepen para financiamento?",
        ],
        categories: ["p&d", "financiamento", "inovacao", "consultoria"],
    },
    // --- NOVO TÓPICO: Vocês oferecem treinamento para a Lei do Bem? ---
    {
        keywords: [
            "oferecem treinamento lei do bem",
            "treinamento lei do bem",
            "curso lei do bem",
            "capacitacao lei do bem",
        ],
        answer: [
            "Sim, oferecemos **treinamentos personalizados sobre a Lei do Bem** para sua equipe! Acreditamos que o conhecimento é chave para o sucesso na aplicação do benefício. Nossos treinamentos podem cobrir:\n\n" +
            "1.  Os fundamentos e requisitos da Lei.\n" +
            "2.  Como identificar e documentar projetos de P&D elegíveis.\n" +
            "3.  Aspectos contábeis e fiscais.\n" +
            "4.  Melhores práticas de gestão da inovação.\n\n" +
            "O formato e o conteúdo são adaptados à sua necessidade. Que tal agendarmos uma conversa para planejar o treinamento ideal para sua empresa? 📚",
            "Podemos capacitar sua equipe sobre todos os aspectos da Lei do Bem, desde a teoria até a prática da identificação e documentação de projetos. O objetivo é que sua empresa tenha autonomia e segurança para aproveitar o incentivo ao máximo.",
        ],
        followUpQuestions: [
            "Qual o formato dos treinamentos?",
            "Qual o custo do treinamento?",
            "O treinamento pode ser online?",
        ],
        categories: ["lei-do-bem", "treinamento", "consultoria"],
    },
    // --- NOVO TÓPICO: Qual o custo da consultoria para a Lei do Bem? ---
    {
        keywords: [
            "custo consultoria lei do bem",
            "preco consultoria lei do bem",
            "quanto custa consultoria lei do bem",
            "valores consultoria lei do bem",
        ],
        answer: [
            "O **custo da consultoria para a Lei do Bem** pode variar bastante, pois depende da complexidade e do escopo dos projetos da sua empresa, do histórico de P&D e do nível de suporte necessário. Para que possamos te dar um **orçamento preciso e personalizado**, o ideal é conversarmos sobre suas necessidades específicas. Podemos agendar uma reunião sem compromisso para entender seu cenário? 💼",
            "Para definir o valor da consultoria da Lei do Bem, precisamos entender a dimensão dos seus projetos e qual o nível de apoio que sua empresa precisa. Cada caso é único! Entre em contato para que possamos detalhar e te apresentar uma proposta justa.",
        ],
        followUpQuestions: [
            "Como é calculado o valor da consultoria?",
            "Vocês oferecem diferentes pacotes de consultoria?",
            "Posso ter um orçamento inicial por telefone?",
        ],
        categories: ["lei-do-bem", "consultoria", "orcamento"],
    },
    // --- NOVO TÓPICO: Vocês oferecem ferramentas para gestão de P&D? ---
    {
        keywords: [
            "ferramentas gestao p&d",
            "software p&d",
            "plataforma p&d",
            "gerenciamento p&d",
        ],
        answer: [
            "Sim, o Grupo Nepen pode indicar e até mesmo desenvolver **ferramentas personalizadas para a gestão de P&D** em sua empresa! Entendemos a importância de otimizar o acompanhamento e a documentação dos seus projetos de inovação. Dependendo da sua necessidade, podemos:\n\n" +
            "1.  Recomendar softwares de mercado que se adequem ao seu perfil.\n" +
            "2.  Desenvolver soluções de software sob medida para sua gestão de P&D.\n" +
            "3.  Auxiliar na implementação e integração de ferramentas existentes.\n\n" +
            "Nosso objetivo é tornar sua gestão de inovação mais eficiente e transparente. Como podemos te ajudar nessa frente? 🛠️",
            "Podemos auxiliar na escolha ou no desenvolvimento de ferramentas que facilitem a gestão do seu P&D, desde o planejamento até o monitoramento e a documentação. Isso garante que seus projetos sejam mais organizados e que você tenha controle total sobre o processo.",
        ],
        followUpQuestions: [
            "Quais ferramentas de mercado vocês recomendam?",
            "Quanto custa um software personalizado?",
            "O Grupo Nepen faz a manutenção desses softwares?",
        ],
        categories: ["p&d", "gestao", "ferramentas", "desenvolvimento"],
    },
    // --- NOVO TÓPICO: O Grupo Nepen atende empresas de todos os portes? ---
    {
        keywords: [
            "grupo nepen atende todos portes",
            "atendem pequenas empresas",
            "atendem grandes empresas",
            "atendem startups",
        ],
        answer: [
            "Sim, o Grupo Nepen atende **empresas de todos os portes**! Nossa expertise em inovação, consultoria e desenvolvimento de sistemas é adaptável às necessidades de pequenas, médias e grandes empresas, além de startups. Acreditamos que a inovação é fundamental para o crescimento de qualquer negócio. Qual o porte da sua empresa e como podemos te ajudar? 🏢",
            "Nosso portfólio de clientes inclui desde startups inovadoras até grandes corporações. Adaptamos nossas soluções e metodologias para atender às particularidades de cada empresa, independentemente do seu tamanho. Sua necessidade é o que nos guia!",
        ],
        followUpQuestions: [
            "Vocês têm soluções específicas para startups?",
            "Como adaptam a consultoria para diferentes portes?",
            "Quais os cases de sucesso em empresas de pequeno porte?",
        ],
        categories: ["informacoes-gerais", "clientes", "escopo"],
    },
    // --- NOVO TÓPICO: Um projeto pode ter os dois tipos de P&D (aplicada e experimental)? ---
    {
        keywords: [
            "projeto com dois tipos p&d",
            "pesquisa aplicada e desenvolvimento experimental juntos",
            "combinar p&d",
        ],
        answer: [
            "Sim, um mesmo projeto de inovação **pode e frequentemente abrange tanto a Pesquisa Aplicada quanto o Desenvolvimento Experimental**! Na verdade, é comum que um projeto comece com a pesquisa aplicada para encontrar uma solução para um problema, e em seguida avance para o desenvolvimento experimental para criar e testar um protótipo ou um novo produto/processo baseado nessa solução. Ambos os esforços são elegíveis para os incentivos da Lei do Bem. 😊",
            "É muito comum que projetos de inovação integrem tanto a fase de pesquisa aplicada quanto a de desenvolvimento experimental. Uma etapa complementa a outra, levando à materialização da inovação. Podemos te ajudar a identificar e documentar cada fase do seu projeto.",
        ],
        followUpQuestions: [
            "Como documentar as fases de P&D para a Lei do Bem?",
            "O Grupo Nepen ajuda na identificação das fases?",
            "Isso aumenta os benefícios fiscais?",
        ],
        categories: ["p&d", "tipos", "elegibilidade-projetos"],
    },
    // --- NOVO TÓPICO: Como documentar as fases de P&D para a Lei do Bem? ---
    {
        keywords: [
            "documentar p&d lei do bem",
            "documentacao p&d",
            "relatorio p&d",
            "comprovar p&d",
        ],
        answer: [
            "A documentação correta das fases de **P&D** é crucial para garantir o aproveitamento da **Lei do Bem**. É preciso comprovar o esforço técnico e a originalidade dos projetos. Geralmente, isso envolve:\n\n" +
            "1.  **Relatórios técnicos:** Detalhando o objetivo, metodologia, resultados e desafios da pesquisa e desenvolvimento.\n" +
            "2.  **Registros contábeis:** Comprovando os gastos elegíveis.\n" +
            "3.  **Cronogramas e planos de projeto:** Demonstrando a organização das atividades.\n" +
            "4.  **Comprovantes de equipe:** Qualificação dos profissionais envolvidos.\n\n" +
            "O Grupo Nepen é especialista em te auxiliar na elaboração de toda essa documentação, garantindo que ela esteja em conformidade com as exigências da Lei do Bem. Quer saber mais detalhes? 📝",
            "Para a Lei do Bem, a documentação de P&D precisa ser detalhada e comprovar o caráter inovador e o esforço técnico. Isso inclui relatórios, registros contábeis, cronogramas e dados da equipe. Nós oferecemos todo o suporte para montar essa documentação de forma robusta.",
        ],
        followUpQuestions: [
            "Existe um modelo de relatório específico?",
            "Qual o prazo para entregar a documentação?",
            "O Grupo Nepen faz auditoria da documentação?",
        ],
        categories: ["lei-do-bem", "p&d", "documentacao", "consultoria"],
    },
    // --- NOVO TÓPICO: Isso aumenta os benefícios fiscais (combinar P&D)? ---
    {
        keywords: [
            "aumenta beneficios fiscais combinar p&d",
            "maior beneficio p&d",
            "incrementar beneficios lei do bem",
        ],
        answer: [
            "Combinar diferentes tipos de **P&D** (Pesquisa Aplicada e Desenvolvimento Experimental) em um mesmo projeto não aumenta diretamente a porcentagem de benefício fiscal da **Lei do Bem**. O que impacta o valor do benefício é o **montante total dos gastos elegíveis** comprovadamente realizados no projeto, independentemente de estarem em uma fase de pesquisa ou de desenvolvimento. O importante é que a atividade seja caracterizada como P&D e que os gastos sejam elegíveis. Nossa consultoria ajuda a maximizar a identificação desses gastos! 💰",
            "O benefício da Lei do Bem é calculado sobre os gastos com P&D. O fato de um projeto ter fases de pesquisa aplicada e desenvolvimento experimental aumenta a probabilidade de ter mais gastos elegíveis, o que, consequentemente, pode levar a um maior benefício. O foco é identificar o máximo de gastos que se encaixam.",
        ],
        followUpQuestions: [
            "Quais gastos são elegíveis na Lei do Bem?",
            "Como o Grupo Nepen ajuda a maximizar os gastos elegíveis?",
            "Existe um limite de benefício na Lei do Bem?",
        ],
        categories: ["lei-do-bem", "p&d", "beneficios-fiscais"],
    },
    // --- NOVO TÓPICO: Quais gastos são elegíveis na Lei do Bem? ---
    {
        keywords: [
            "gastos elegiveis lei do bem",
            "despesas lei do bem",
            "o que pode deduzir lei do bem",
            "custos p&d elegiveis",
        ],
        answer: [
            "A **Lei do Bem** permite a dedução de uma série de **gastos elegíveis** relacionados às atividades de Pesquisa e Desenvolvimento (P&D). Os principais incluem:\n\n" +
            "1.  **Custos com pessoal:** Salários, encargos e benefícios de pesquisadores, engenheiros e técnicos dedicados ao P&D.\n" +
            "2.  **Custos de bens e insumos:** Materiais de consumo, componentes, softwares e equipamentos utilizados diretamente nos projetos de P&D.\n" +
            "3.  **Depreciação de bens:** Depreciação de máquinas, equipamentos e laboratórios dedicados ao P&D.\n" +
            "4.  **Despesas com consultoria e serviços de terceiros:** Contratação de instituições de pesquisa ou especialistas para projetos de P&D.\n" +
            "5.  **Gastos com patentes e registros:** Despesas relacionadas à proteção da propriedade intelectual gerada pelo P&D.\n\n" +
            "Nossa consultoria te ajuda a identificar e contabilizar corretamente todos esses gastos para maximizar o seu benefício! 💲",
            "Para a Lei do Bem, são elegíveis custos com equipe de P&D, insumos, softwares, depreciação de equipamentos usados na pesquisa e desenvolvimento, e até mesmo despesas com patentes. É fundamental que esses gastos estejam diretamente ligados às atividades de inovação.",
        ],
        followUpQuestions: [
            "Todos os gastos com pessoal são elegíveis?",
            "Posso deduzir gastos de anos anteriores?",
            "Há um limite para os gastos elegíveis?",
        ],
        categories: ["lei-do-bem", "gastos-elegiveis", "beneficios-fiscais"],
    },
    // --- NOVO TÓPICO: Todos os gastos com pessoal são elegíveis (Lei do Bem)? ---
    {
        keywords: [
            "gastos pessoal elegiveis lei do bem",
            "salarios p&d lei do bem",
            "equipe p&d lei do bem",
            "encargos p&d",
        ],
        answer: [
            "Não são todos os gastos com pessoal que são elegíveis na **Lei do Bem**, mas sim aqueles **diretamente relacionados** às atividades de Pesquisa e Desenvolvimento (P&D). Isso inclui salários, encargos sociais e benefícios de:\n\n" +
            "1.  **Pesquisadores, engenheiros e técnicos** que atuam exclusivamente ou de forma parcial nos projetos de P&D.\n" +
            "2.  Profissionais com **formação superior (Mestrado/Doutorado)** dedicados a P&D têm um incentivo adicional!\n\n" +
            "É crucial que a empresa consiga comprovar a dedicação desses profissionais aos projetos de inovação. Nossa consultoria ajuda na segregação e comprovação desses custos. 😉",
            "Apenas os gastos com o pessoal diretamente envolvido nas atividades de P&D podem ser deduzidos pela Lei do Bem. Isso exige um bom controle e alocação de horas para comprovar que esses profissionais estavam trabalhando nos projetos de inovação.",
        ],
        followUpQuestions: [
            "Como comprovar a dedicação dos profissionais ao P&D?",
            "Qual o incentivo adicional para Mestrado/Doutorado?",
            "Posso incluir terceirizados nos gastos com pessoal?",
        ],
        categories: ["lei-do-bem", "gastos-elegiveis", "pessoal"],
    },
    // --- NOVO TÓPICO: Qual o incentivo adicional para Mestrado/Doutorado (Lei do Bem)? ---
    {
        keywords: [
            "incentivo adicional mestrado doutorado lei do bem",
            "beneficio doutores lei do bem",
            "mestres p&d lei do bem",
            "deducao doutorado",
        ],
        answer: [
            "Sim, a **Lei do Bem** oferece um incentivo ainda maior para empresas que possuem **pesquisadores com Mestrado ou Doutorado** envolvidos em atividades de P&D! Além da dedução normal dos gastos com P&D, você pode deduzir **150% do valor gasto com salários desses profissionais** (incluindo encargos sociais). Ou seja, para cada R$1,00 gasto, você deduz R$1,50! É um estímulo importante para a qualificação da mão de obra em inovação. 🎓",
            "Se sua empresa tem mestres ou doutores dedicados ao P&D, a Lei do Bem permite uma dedução de 150% sobre os salários desses profissionais. Isso é um grande diferencial para empresas que investem em capital humano altamente qualificado.",
        ],
        followUpQuestions: [
            "Como comprovar a formação desses profissionais?",
            "Precisa ser CLT para ter esse benefício?",
            "Esse benefício se acumula com outros da Lei do Bem?",
        ],
        categories: ["lei-do-bem", "beneficios-fiscais", "pessoal", "qualificacao"],
    },
    // --- NOVO TÓPICO: Posso incluir terceirizados nos gastos com pessoal (Lei do Bem)? ---
    {
        keywords: [
            "terceirizados gastos pessoal lei do bem",
            "servicos de terceiros p&d",
            "consultores p&d lei do bem",
            "subcontratacao p&d",
        ],
        answer: [
            "Sim, é possível incluir gastos com **serviços de terceiros** (como consultores, pesquisadores externos ou instituições de pesquisa) nos gastos elegíveis da **Lei do Bem**, desde que esses serviços estejam **diretamente ligados às atividades de Pesquisa e Desenvolvimento (P&D)**. É fundamental que haja um contrato claro e que a prestação do serviço seja comprovada e focada na inovação. O Grupo Nepen pode te auxiliar na estruturação desses contratos e na documentação! 🤝",
            "Gastos com terceiros que realizam atividades de P&D para sua empresa podem ser elegíveis na Lei do Bem. É crucial ter contratos bem definidos e comprovar que esses serviços são de fato voltados para pesquisa e desenvolvimento tecnológico.",
        ],
        followUpQuestions: [
            "Qual a diferença de P&D interno e terceirizado para a Lei do Bem?",
            "Existe limite para gastos com terceiros?",
            "Preciso de CNPJ do terceiro para deduzir?",
        ],
        categories: ["lei-do-bem", "gastos-elegiveis", "terceiros"],
    },
    // --- NOVO TÓPICO: Existe limite de benefício na Lei do Bem? ---
    {
        keywords: [
            "limite beneficio lei do bem",
            "teto lei do bem",
            "valor maximo lei do bem",
        ],
        answer: [
            "Não há um **limite de valor pré-estabelecido** para o benefício da **Lei do Bem** em si. O que acontece é que o incentivo fiscal é calculado sobre o **montante dos gastos elegíveis em P&D** que sua empresa comprovadamente realizou. Ou seja, quanto mais você investir em inovação (e documentar corretamente), maior será o seu benefício fiscal, limitado, claro, ao valor do seu Imposto de Renda e CSLL devidos. Nosso trabalho é te ajudar a maximizar a identificação desses gastos! 📈",
            "O benefício da Lei do Bem não tem um teto fixo. Ele é diretamente proporcional aos seus investimentos em Pesquisa e Desenvolvimento. Quanto mais você inova e documenta, maior o potencial de redução no IR e CSLL.",
        ],
        followUpQuestions: [
            "O benefício da Lei do Bem é um desconto no imposto?",
            "Posso usar o benefício mesmo com prejuízo?",
            "Como a Receita Federal fiscaliza a Lei do Bem?",
        ],
        categories: ["lei-do-bem", "beneficios-fiscais", "limite"],
    },
    // --- NOVO TÓPICO: O benefício da Lei do Bem é um desconto no imposto? ---
    {
        keywords: [
            "beneficio lei do bem desconto imposto",
            "reducao ir csll lei do bem",
            "lei do bem abatimento imposto",
        ],
        answer: [
            "Sim, o principal benefício da **Lei do Bem** é a possibilidade de **deduzir os gastos com Pesquisa e Desenvolvimento (P&D) do Imposto de Renda Pessoa Jurídica (IRPJ) e da Contribuição Social sobre o Lucro Líquido (CSLL)**. Isso significa que, ao invés de ser um desconto direto no valor final do imposto, você diminui a base de cálculo, o que na prática resulta em um imposto menor a pagar. É uma excelente forma de transformar seus investimentos em inovação em economia tributária! 💲",
            "A Lei do Bem permite que você reduza a base de cálculo do seu IRPJ e CSLL em função dos investimentos em P&D. Isso se traduz em um valor menor de imposto a ser pago, funcionando como um incentivo fiscal direto para a inovação.",
        ],
        followUpQuestions: [
            "Além da dedução no IR/CSLL, há outros benefícios?",
            "Como a dedução é calculada na prática?",
            "O Grupo Nepen faz o cálculo do benefício?",
        ],
        categories: ["lei-do-bem", "beneficios-fiscais", "deducao"],
    },
    // --- NOVO TÓPICO: Posso usar o benefício mesmo com prejuízo (Lei do Bem)? ---
    {
        keywords: [
            "usar beneficio prejuizo lei do bem",
            "lei do bem lucro real prejuizo",
            "como funciona lei do bem com prejuizo",
        ],
        answer: [
            "Não, infelizmente, o benefício da **Lei do Bem** é aplicável apenas para empresas que apuram **Lucro Real** e que, no ano-calendário da apuração, tenham **Lucro Real antes do incentivo**. Se a empresa apurar prejuízo fiscal no período, ela não conseguirá usufruir do benefício naquele ano, pois não haverá Imposto de Renda ou CSLL a deduzir. No entanto, os projetos de P&D e a expertise acumulada ainda são valiosos! 📉",
            "O benefício da Lei do Bem está atrelado ao lucro real da empresa. Se houver prejuízo fiscal, não há imposto a ser deduzido. Portanto, o incentivo não pode ser aproveitado naquele exercício. É importante ter um planejamento tributário.",
        ],
        followUpQuestions: [
            "Se eu tiver prejuízo, perco o benefício para sempre?",
            "Existe alguma forma de recuperar o benefício em anos seguintes?",
            "O Grupo Nepen ajuda no planejamento tributário para a Lei do Bem?",
        ],
        categories: ["lei-do-bem", "beneficios-fiscais", "prejuizo"],
    },
    // --- NOVO TÓPICO: Como a Receita Federal fiscaliza a Lei do Bem? ---
    {
        keywords: [
            "fiscalizacao lei do bem receita federal",
            "auditoria lei do bem",
            "receita federal lei do bem",
            "como receita federal verifica p&d",
        ],
        answer: [
            "A **Receita Federal** fiscaliza a aplicação da **Lei do Bem** com rigor para garantir que os benefícios sejam concedidos apenas a projetos de **P&D** legítimos e que a documentação esteja em conformidade. A fiscalização pode ocorrer por meio de:\n\n" +
            "1.  **Cruzamento de dados:** Com base nas informações declaradas pela empresa (como ECF, e-Social).\n" +
            "2.  **Auditorias:** Solicitação de documentos comprobatórios e visitas técnicas para avaliar os projetos de P&D.\n" +
            "3.  **Pareceres de especialistas:** A Receita pode solicitar a opinião de órgãos técnicos (como o Ministério da Ciência, Tecnologia e Inovação) sobre a caracterização dos projetos.\n\n" +
            "Por isso, a correta documentação e comprovação dos gastos e atividades de P&D são essenciais. Nosso suporte visa te dar total segurança nesse processo! 🛡️",
            "A fiscalização da Lei do Bem é minuciosa. A Receita Federal analisa os dados declarados, pode realizar auditorias e até solicitar a avaliação técnica dos seus projetos. Manter a documentação impecável e os processos bem definidos é a melhor forma de garantir a conformidade.",
        ],
        followUpQuestions: [
            "Qual o risco de fiscalização da Lei do Bem?",
            "O Grupo Nepen dá suporte em caso de fiscalização?",
            "Quais são as penalidades por irregularidades na Lei do Bem?",
        ],
        categories: ["lei-do-bem", "fiscalizacao", "conformidade"],
    },

    // --- NOVO TÓPICO: Qual o risco de fiscalização da Lei do Bem? ---
    {
        keywords: [
            "risco fiscalizacao lei do bem",
            "multa lei do bem",
            "consequencias lei do bem irregular",
        ],
        answer: [
            "O principal risco de fiscalização da **Lei do Bem** é a **glosa dos benefícios** (ou seja, a Receita Federal não reconhecer o direito ao incentivo) e a **cobrança dos impostos retroativos** (IRPJ e CSLL) com juros e multas, caso as atividades de P&D ou a documentação não estejam em conformidade. Por isso, é fundamental ter um processo robusto de identificação, documentação e comprovação dos projetos e gastos. Nossa consultoria minimiza esse risco para você! ⚠️",
            "O risco da Lei do Bem mal aplicada é a glosa do benefício e a cobrança dos impostos com multas e juros. Para evitar isso, é crucial ter um mapeamento detalhado dos projetos de P&D, documentação completa e alinhamento com as regras fiscais. Nossa consultoria garante essa segurança.",
        ],
        followUpQuestions: [
            "O Grupo Nepen dá suporte em caso de fiscalização?",
            "Como evitar problemas com a fiscalização?",
            "Quais são as multas por uso indevido da Lei do Bem?",
        ],
        categories: ["lei-do-bem", "fiscalizacao", "riscos"],
    },
    // --- NOVO TÓPICO: O Grupo Nepen dá suporte em caso de fiscalização? ---
    {
        keywords: [
            "suporte fiscalizacao lei do bem",
            "ajuda fiscalizacao receita federal",
            "acompanhamento fiscalizacao",
            "defesa lei do bem",
        ],
        answer: [
            "Sim, o Grupo Nepen oferece **suporte completo em caso de fiscalização da Lei do Bem**! Se sua empresa for notificada pela Receita Federal, nossa equipe estará ao seu lado para:\n\n" +
            "1.  Analisar as solicitações da fiscalização.\n" +
            "2.  Reunir e organizar a documentação necessária.\n" +
            "3.  Elaborar respostas e defesas técnicas.\n" +
            "4.  Representar sua empresa junto aos órgãos competentes.\n\n" +
            "Nosso objetivo é garantir que você tenha a tranquilidade e a segurança de que seu benefício foi aplicado corretamente. Conte conosco para isso! 🛡️",
            "Em caso de fiscalização da Lei do Bem, o Grupo Nepen oferece total apoio. Desde a análise da notificação até a elaboração das defesas e o acompanhamento junto à Receita Federal, nossa equipe estará presente para garantir sua segurança e conformidade.",
        ],
        followUpQuestions: [
            "Qual a experiência do Grupo Nepen em fiscalizações?",
            "Esse suporte já está incluso na consultoria?",
            "Como funciona a defesa administrativa?",
        ],
        categories: ["lei-do-bem", "fiscalizacao", "suporte", "consultoria"],
    },

    // --- NOVO TÓPICO: Quais são as penalidades por irregularidades na Lei do Bem? ---
    {
        keywords: [
            "penalidades lei do bem",
            "multas lei do bem",
            "irregularidades lei do bem",
            "sancoes lei do bem",
        ],
        answer: [
            "As **penalidades por irregularidades na aplicação da Lei do Bem** podem ser severas. Se a Receita Federal identificar que os projetos de P&D ou os gastos declarados não são elegíveis, a empresa pode sofrer:\n\n" +
            "1.  **Glosa do benefício:** Exigência do pagamento do IRPJ e da CSLL que foram indevidamente deduzidos.\n" +
            "2.  **Multas:** Multas de ofício sobre o valor do imposto devido (geralmente 75%, podendo chegar a 150% em caso de fraude).\n" +
            "3.  **Juros de mora:** Correção monetária pelo Selic desde a data em que o imposto deveria ter sido pago.\n\n" +
            "Por isso, a conformidade e a segurança jurídica são tão importantes. Nossa consultoria atua para que sua empresa esteja sempre em dia com as exigências da Lei. 🚨",
            "As irregularidades na Lei do Bem podem resultar na cobrança do imposto que foi deduzido indevidamente, acrescido de multas elevadas e juros. É um risco que pode ser evitado com uma consultoria especializada e uma documentação impecável dos projetos de P&D.",
        ],
        followUpQuestions: [
            "Como garantir a conformidade na Lei do Bem?",
            "O Grupo Nepen é especialista em evitar essas penalidades?",
            "Há casos de empresas que foram penalizadas?",
        ],
        categories: ["lei-do-bem", "fiscalizacao", "penalidades", "riscos"],
    },
    // --- NOVO TÓPICO: Como garantir a conformidade na Lei do Bem? ---
    {
        keywords: [
            "garantir conformidade lei do bem",
            "seguranca lei do bem",
            "melhores praticas lei do bem",
            "compliance lei do bem",
        ],
        answer: [
            "Para garantir a **conformidade na Lei do Bem** e evitar riscos, é essencial adotar as seguintes práticas:\n\n" +
            "1.  **Análise rigorosa de elegibilidade:** Tanto da empresa quanto dos projetos de P&D.\n" +
            "2.  **Documentação detalhada:** Manter registros completos e comprobatórios das atividades e gastos de P&D.\n" +
            "3.  **Segregação contábil:** Separar os gastos de P&D dos demais gastos da empresa.\n" +
            "4.  **Acompanhamento da legislação:** Manter-se atualizado sobre as regras da Lei do Bem.\n" +
            "5.  **Consultoria especializada:** Contar com o apoio de especialistas como o Grupo Nepen para todas as etapas.\n\n" +
            "Nossa consultoria é focada em te dar essa segurança e tranquilidade. Quer saber como aplicamos isso na prática para sua empresa? ✅",
            "A conformidade na Lei do Bem exige um processo bem estruturado: desde a identificação correta dos projetos de P&D, a documentação meticulosa dos gastos, a segregação contábil e, principalmente, o acompanhamento por uma consultoria especializada que garanta que tudo está em linha com a legislação.",
        ],
        followUpQuestions: [
            "O Grupo Nepen oferece um checklist de conformidade?",
            "Quanto tempo devo guardar a documentação da Lei do Bem?",
            "Qual a frequência de atualização da legislação da Lei do Bem?",
        ],
        categories: ["lei-do-bem", "conformidade", "consultoria", "melhores-praticas"],
    },
    // --- NOVO TÓPICO: Quanto tempo devo guardar a documentação da Lei do Bem? ---
    {
        keywords: [
            "tempo guardar documentacao lei do bem",
            "prazo guarda documentos p&d",
            "documentos lei do bem prazo",
        ],
        answer: [
            "A documentação referente à **Lei do Bem**, assim como outros documentos fiscais e contábeis, deve ser guardada pelo prazo mínimo de **5 anos, contados a partir do primeiro dia útil do exercício seguinte ao da apuração** do benefício. Este é o prazo que a Receita Federal tem para fiscalizar. No entanto, por segurança e para o histórico da empresa, muitas empresas optam por guardar por um período ainda maior. Nossa consultoria te ajuda a organizar e manter essa documentação! 🗄️",
            "É crucial manter a documentação da Lei do Bem por pelo menos 5 anos a partir do exercício de apuração do benefício, para fins de fiscalização. Ter esses registros bem organizados e acessíveis é fundamental para a segurança da sua empresa.",
        ],
        followUpQuestions: [
            "Quais documentos preciso guardar?",
            "Posso guardar a documentação digitalmente?",
            "O Grupo Nepen oferece serviço de organização de documentos?",
        ],
        categories: ["lei-do-bem", "documentacao", "prazo", "conformidade"],
    },
    // --- NOVO TÓPICO: Quais documentos preciso guardar (Lei do Bem)? ---
    {
        keywords: [
            "quais documentos lei do bem",
            "documentos necessarios lei do bem",
            "lista documentos p&d",
            "comprovantes lei do bem",
        ],
        answer: [
            "Para a **Lei do Bem**, você precisará guardar uma série de documentos que comprovem a realização das atividades de **P&D** e a elegibilidade dos gastos. Os principais incluem:\n\n" +
            "1.  **Relatórios técnicos descritivos** dos projetos de P&D.\n" +
            "2.  **Comprovantes de despesas:** Notas fiscais de compra de insumos, equipamentos, serviços, folha de pagamento da equipe de P&D, etc.\n" +
            "3.  **Contratos:** De pesquisa, desenvolvimento ou subcontratação.\n" +
            "4.  **Comprovantes de formação** da equipe (Mestrado/Doutorado, se aplicável).\n" +
            "5.  **Planilhas de alocação de horas** da equipe nos projetos.\n" +
            "6.  **Patentes ou registros** de propriedade intelectual (se houver).\n" +
            "7.  **Certidões Negativas de Débitos (CNDs)**.\n\n" +
            "É um conjunto de documentos que comprova a inovação. Nós te auxiliamos em cada etapa da organização! 📄",
            "Os documentos essenciais para a Lei do Bem incluem relatórios técnicos, comprovantes de gastos, contratos com terceiros, comprovação da qualificação da equipe e a CND. Tudo isso deve estar organizado para demonstrar a legitimidade dos seus projetos de P&D.",
        ],
        followUpQuestions: [
            "Onde consigo os modelos de relatórios técnicos?",
            "O Grupo Nepen ajuda a organizar esses documentos?",
            "A Receita Federal aceita documentos digitais?",
        ],
        categories: ["lei-do-bem", "documentacao", "conformidade"],
    },
    // --- NOVO TÓPICO: Posso guardar a documentação digitalmente (Lei do Bem)? ---
    {
        keywords: [
            "guardar documentacao digitalmente lei do bem",
            "documentos digitais p&d",
            "digitalizacao lei do bem",
            "documentacao eletronica lei do bem",
        ],
        answer: [
            "Sim, a Receita Federal **aceita a guarda de documentos digitalmente** para fins de fiscalização da **Lei do Bem**, desde que a digitalização obedeça a certos requisitos de integridade e autenticidade (por exemplo, uso de certificação digital para garantir a validade jurídica). É uma ótima forma de otimizar o espaço e o acesso à informação. Nossa consultoria pode te orientar sobre as melhores práticas para a guarda eletrônica! 🖥️",
            "É permitido armazenar digitalmente a documentação da Lei do Bem, desde que os arquivos digitais tenham validade jurídica (com assinaturas digitais, por exemplo) e que a empresa garanta a segurança e a acessibilidade desses documentos durante o período de guarda.",
        ],
        followUpQuestions: [
            "Preciso de certificação digital para todos os documentos?",
            "Quais os requisitos de segurança para documentos digitais?",
            "O Grupo Nepen oferece sistema para gestão de documentos?",
        ],
        categories: ["lei-do-bem", "documentacao", "digitalizacao", "conformidade"],
    },
    // --- NOVO TÓPICO: Qual a frequência de atualização da legislação da Lei do Bem? ---
    {
        keywords: [
            "frequencia atualizacao lei do bem",
            "quando lei do bem muda",
            "novas regras lei do bem",
            "alteracoes legislacao p&d",
        ],
        answer: [
            "A legislação da **Lei do Bem** não passa por alterações drásticas com muita frequência, mas **pode haver ajustes ou interpretações** por parte da Receita Federal ou do Ministério da Ciência, Tecnologia e Inovação (MCTI) anualmente ou em períodos maiores. É essencial estar atento às publicações oficiais e às instruções normativas. O Grupo Nepen monitora essas atualizações para garantir que sua empresa esteja sempre em conformidade! 🔄",
            "A Lei do Bem, como a maioria das leis tributárias, pode ter ajustes pontuais ou novas instruções normativas periodicamente. Nosso time acompanha de perto essas mudanças para assegurar que a consultoria esteja sempre atualizada e em total conformidade.",
        ],
        followUpQuestions: [
            "O Grupo Nepen me avisa sobre as atualizações?",
            "Onde posso acompanhar as atualizações da Lei do Bem?",
            "As mudanças impactam benefícios passados?",
        ],
        categories: ["lei-do-bem", "legislacao", "atualizacao", "conformidade"],
    },
    
];

const defaultFallbackMessage = {
    text: "Desculpe, não consegui entender sua pergunta. 😔 Poderia tentar reformular ou escolher uma das opções abaixo? Talvez isso ajude:",
    sender: "bot",
    isError: true,
    options: [
        "Serviços do Grupo Nepen",
        "Horário de atendimento",
        "Informações de contato (telefone/email)",
        "Endereços dos escritórios",
        "O que é a Lei do Bem?",
        "Falar sobre P&D",
        "Pedir um orçamento",
    ],
    personalTouch: ["Ainda estou aprendendo, me ajude a te ajudar!"],
};

export { knowledgeBase, defaultFallbackMessage };