import express from "express";
import { errorResponse } from "../utils/responseHandler.js";
import { knowledgeBase, defaultFallbackMessage } from "../utils/knowledgeBase.js"; // Importa a base de conhecimento
import rateLimitMiddleware from "../middlewares/rateLimitMiddleware.js"; // Importa o middleware de rate limit

const router = express.Router();

// Aplica o middleware de rate limit a todas as requisições para esta rota
router.post("/", rateLimitMiddleware, async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return errorResponse(res, "Mensagem não fornecida", 400);
    }

    const normalizedMessage = message
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/gi, "");

    let botReply = defaultFallbackMessage;

    for (const item of knowledgeBase) {
        const foundKeyword = item.keywords.some((keyword) =>
            normalizedMessage.includes(keyword)
        );

        if (foundKeyword) {
            let chosenAnswer;

            if (Array.isArray(item.answer)) {
                const randomIndex = Math.floor(Math.random() * item.answer.length);
                chosenAnswer = item.answer[randomIndex];
            } else {
                chosenAnswer = item.answer;
            }

            // NOVIDADE AQUI: CONCATENA A RESPOSTA PRINCIPAL COM A OFERTA DE SERVIÇOS
            let fullAnswer = chosenAnswer;
            if (item.serviceOffer) {
                fullAnswer += item.serviceOffer;
            }

            botReply = {
                text: fullAnswer, // Usa a resposta completa
                sender: "bot",
                isError: false,
                contactInfo: item.contactInfo || null,
                followUpQuestions: item.followUpQuestions || null,
                options: item.options || null,
                sentimentResponse: item.sentimentResponse || null,
                problemSolvingGuidance: item.problemSolvingGuidance || null,
                personalTouch: item.personalTouch || null,
            };
            break;
        }
    }

    res.json({
        reply: botReply.text,
        isError: botReply.isError,
        contactInfo: botReply.contactInfo,
        followUpQuestions: botReply.followUpQuestions,
        options: botReply.options,
        sentimentResponse: botReply.sentimentResponse,
        problemSolvingGuidance: botReply.problemSolvingGuidance,
        personalTouch: botReply.personalTouch,
    });
});

export default router;