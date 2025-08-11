// Objeto para armazenar contadores de mensagens por IP
const messageCounts = {};
const MESSAGE_LIMIT_PER_IP = 10; 
const LIMIT_RESET_TIME_MS = 60 * 60 * 1000; 
// Função para limpar contadores antigos (opcional, mas recomendado para evitar inchaço da memória)
setInterval(() => {
  const now = Date.now();
  for (const ip in messageCounts) {
    if (now - messageCounts[ip].timestamp > LIMIT_RESET_TIME_MS) {
      delete messageCounts[ip];
      console.log(`Contador para IP ${ip} resetado.`);
    }
  }
}, LIMIT_RESET_TIME_MS); // Executa a limpeza no mesmo intervalo do reset

export { messageCounts, MESSAGE_LIMIT_PER_IP };
