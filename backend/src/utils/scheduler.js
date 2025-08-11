// src/utils/scheduler.js
import cron from "node-cron";
// Altere esta linha:
import db from "../config/database.js"; 

export const startPostScheduler = () => {
  // Agenda uma tarefa para rodar a cada minuto
  cron.schedule("* * * * *", async () => {
    console.log("Scheduler: Verificando posts agendados...");
    try {
      const [postsToPublish] = await db.execute(
        "SELECT id, titulo FROM postagens WHERE status = 'agendado' AND data_agendamento <= NOW()"
      );

      if (postsToPublish.length > 0) {
        console.log(
          `Scheduler: Encontrados ${postsToPublish.length} posts para publicar.`
        );
        for (const post of postsToPublish) {
          await db.execute(
            "UPDATE postagens SET status = 'publicado', data_publicacao = NOW(), data_agendamento = NULL WHERE id = ?",
            [post.id]
          );
          console.log(
            `Scheduler: Post "${post.titulo}" (ID: ${post.id}) publicado.`
          );
        }
      }
    } catch (error) {
      console.error("Scheduler: Erro ao processar posts agendados:", error);
    }
  });
  console.log("Scheduler de posts agendados iniciado.");
};
