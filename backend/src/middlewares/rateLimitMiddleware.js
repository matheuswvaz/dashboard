
const MESSAGE_LIMIT_PER_IP = 20; // Exemplo: 10 mensagens por IP
const RESET_INTERVAL_MS = 60 * 60 * 1000; // Exemplo: Resetar a cada 1 hora (em milissegundos)

const messageCounts = {}; // Armazena a contagem de mensagens por IP

const rateLimitMiddleware = (req, res, next) => {
    const userIp = req.ip;

    if (!messageCounts[userIp]) {
        messageCounts[userIp] = { count: 0, timestamp: Date.now() };
    }

    // Reseta a contagem se o intervalo de tempo for excedido
    if (Date.now() - messageCounts[userIp].timestamp > RESET_INTERVAL_MS) {
        messageCounts[userIp].count = 0;
        messageCounts[userIp].timestamp = Date.now();
    }

    if (messageCounts[userIp].count >= MESSAGE_LIMIT_PER_IP) {
        return res.status(429).json({
            error: "Limite de mensagens atingido.",
            message: `Você atingiu o limite de ${MESSAGE_LIMIT_PER_IP} mensagens por hora. Por favor, aguarde ou entre em contato conosco para mais assistência.`,
            contactInfo: {
                phone: "(85) 9 9115-5111",
                email: "faleconosco@nepen.org.br",
            },
        });
    }

    messageCounts[userIp].count++;
    console.log(
        `IP: ${userIp}, Mensagens: ${messageCounts[userIp].count}/${MESSAGE_LIMIT_PER_IP}`
    );
    next(); // Continua para a próxima função middleware ou rota
};

export default rateLimitMiddleware;