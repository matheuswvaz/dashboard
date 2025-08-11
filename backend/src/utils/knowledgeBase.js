
const knowledgeBase = [
    {
        keywords: ["ola", "oi", "bom dia", "boa tarde", "boa noite"],
        answer: ["Olá! Como posso te ajudar hoje?"],
    }
];

// Mensagem padrão caso o chatbot não entenda a pergunta.
const defaultFallbackMessage = {
    text: "Desculpe, não consegui entender sua pergunta. 😔 Poderia tentar reformular?",
    sender: "bot",
    isError: true,
    options: [
        "Qual o horário de atendimento?",
        "Como posso entrar em contato?",
    ],
};

export { knowledgeBase, defaultFallbackMessage };