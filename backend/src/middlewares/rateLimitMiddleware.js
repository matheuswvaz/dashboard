const MESSAGE_LIMIT_PER_IP = 20;
const RESET_INTERVAL_MS = 60 * 60 * 1000;

const messageCounts = {};

const rateLimitMiddleware = (req, res, next) => {
    const userIp = req.ip;

    if (!messageCounts[userIp]) {
        messageCounts[userIp] = { count: 0, timestamp: Date.now() };
    }

    if (Date.now() - messageCounts[userIp].timestamp > RESET_INTERVAL_MS) {
        messageCounts[userIp].count = 0;
        messageCounts[userIp].timestamp = Date.now();
    }

    if (messageCounts[userIp].count >= MESSAGE_LIMIT_PER_IP) {
        return res.status(429).json({
            error: "Limite de mensagens atingido.",
            message: `Você atingiu o limite de ${MESSAGE_LIMIT_PER_IP} mensagens por hora. Por favor, aguarde ou entre em contato conosco para mais assistência.`,
            contactInfo: {
                phone: "(XX) X XXXX-XXXX", 
                email: "contato@seudominio.com", 
            },
        });
    }

    messageCounts[userIp].count++;
    console.log(
        `IP: ${userIp}, Mensagens: ${messageCounts[userIp].count}/${MESSAGE_LIMIT_PER_IP}`
    );
    next();
};

export default rateLimitMiddleware;