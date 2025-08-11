import db from "../config/database.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import env from "../config/env.js";

const getMonthAbbreviation = (monthNumber) => {
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return months[monthNumber - 1] || "";
};

export const getChartData = async (req, res) => {
  try {
    const [leadsDaily] = await db.execute(`
        SELECT DATE(data_envio) as date, COUNT(*) as count
        FROM leads
        WHERE data_envio >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(data_envio) ORDER BY date ASC
    `);
    const [visitsDaily] = await db.execute(`
        SELECT DATE(access_time) as date, COUNT(*) as count
        FROM access_logs
        WHERE access_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(access_time) ORDER BY date ASC
    `);

    const [leadsMonthly] = await db.execute(`
        SELECT YEAR(data_envio) as year, MONTH(data_envio) as month, COUNT(*) as count
        FROM leads
        WHERE YEAR(data_envio) = YEAR(CURDATE())
        GROUP BY year, month ORDER BY year, month ASC
    `);
    const [visitsMonthly] = await db.execute(`
        SELECT YEAR(access_time) as year, MONTH(access_time) as month, COUNT(*) as count
        FROM access_logs
        WHERE YEAR(access_time) = YEAR(CURDATE())
        GROUP BY year, month ORDER BY year, month ASC
    `);

    const [leadsYearlyRaw] = await db.execute(`
        SELECT YEAR(data_envio) as year, COUNT(*) as count
        FROM leads
        WHERE YEAR(data_envio) IS NOT NULL
        GROUP BY year ORDER BY year ASC
    `);
    const [visitsYearlyRaw] = await db.execute(`
        SELECT YEAR(access_time) as year, COUNT(*) as count
        FROM access_logs
        WHERE YEAR(access_time) IS NOT NULL
        GROUP BY year ORDER BY year ASC
    `);

    const formatMonthlyData = (data) => {
      const labels = Array.from({ length: 12 }, (_, i) =>
        getMonthAbbreviation(i + 1)
      );
      const counts = Array(12).fill(0);
      data.forEach((item) => {
        if (item.month >= 1 && item.month <= 12) {
          counts[item.month - 1] = item.count;
        }
      });
      return { labels, counts };
    };

    const formatDailyData = (data, days = 30) => {
      const labels = [];
      const counts = [];
      const dateMap = new Map(
        data.map((item) => [item.date.toISOString().split("T")[0], item.count])
      );
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - days + 1);
      for (let i = 0; i < days; i++) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const formattedDate = currentDate.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        });
        labels.push(formattedDate);
        counts.push(dateMap.get(dateStr) || 0);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return { labels, counts };
    };

    const formatYearlyData = (data) => {
      const labels = data.map((item) => String(item.year));
      const counts = data.map((item) => item.count);
      return { labels, counts };
    };

    const leadsMonthlyFormatted = formatMonthlyData(leadsMonthly);
    const visitsMonthlyFormatted = formatMonthlyData(visitsMonthly);
    const leadsDailyFormatted = formatDailyData(leadsDaily);
    const visitsDailyFormatted = formatDailyData(visitsDaily);
    const leadsYearlyFormatted = formatYearlyData(leadsYearlyRaw);
    const visitsYearlyFormatted = formatYearlyData(visitsYearlyRaw);

    const currentYear = new Date().getFullYear();

    const chartData = {
      leadsDaily: {
        labels: leadsDailyFormatted.labels,
        datasets: [
          {
            label: `Leads por Dia (Últimos 30 dias)`,
            data: leadsDailyFormatted.counts,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            tension: 0.1,
          },
        ],
      },
      leadsMonthly: {
        labels: leadsMonthlyFormatted.labels,
        datasets: [
          {
            label: `Leads por Mês (${currentYear})`,
            data: leadsMonthlyFormatted.counts,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
          },
        ],
      },
      visitsDaily: {
        labels: visitsDailyFormatted.labels,
        datasets: [
          {
            label: `Visitas por Dia (Últimos 30 dias)`,
            data: visitsDailyFormatted.counts,
            backgroundColor: "rgba(255, 159, 64, 0.6)",
            borderColor: "rgba(255, 159, 64, 1)",
            tension: 0.1,
          },
        ],
      },
      visitsMonthly: {
        labels: visitsMonthlyFormatted.labels,
        datasets: [
          {
            label: `Visitas por Mês (${currentYear})`,
            data: visitsMonthlyFormatted.counts,
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
          },
        ],
      },
      leadsYearly: {
        labels: leadsYearlyFormatted.labels,
        datasets: [
          {
            label: `Leads por Ano`,
            data: leadsYearlyFormatted.counts,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
          },
        ],
      },
      visitsYearly: {
        labels: visitsYearlyFormatted.labels,
        datasets: [
          {
            label: `Visitas por Ano`,
            data: visitsYearlyFormatted.counts,
            backgroundColor: "rgba(255, 206, 86, 0.6)",
            borderColor: "rgba(255, 206, 86, 1)",
          },
        ],
      },
    };

    return successResponse(
      res,
      "Dados para gráficos obtidos com sucesso.",
      chartData
    );
  } catch (err) {
    console.error("Erro ao buscar dados para gráficos:", err);
    if (err.code === "ER_NO_SUCH_TABLE") {
      console.warn(
        "Tabela 'leads' ou 'access_logs' não encontrada para gráficos."
      );
      const emptyDataset = {
        labels: [],
        datasets: [{ label: "Dados Indisponíveis", data: [] }],
      };
      return successResponse(
        res,
        "Tabela necessária não encontrada.",
        {
          leadsDaily: emptyDataset,
          leadsMonthly: emptyDataset,
          visitsDaily: emptyDataset,
          visitsMonthly: emptyDataset,
          leadsYearly: emptyDataset,
          visitsYearly: emptyDataset,
        },
        200
      );
    }
    return errorResponse(
      res,
      "Erro interno ao buscar dados para gráficos.",
      500,
      env.NODE_ENV === "development" ? err : null
    );
  }
};
