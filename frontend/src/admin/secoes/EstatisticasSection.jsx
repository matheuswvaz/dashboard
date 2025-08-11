import React, { useState, useEffect } from "react";
import apiClient from "../../utils/axios";
import { FaChartBar } from "react-icons/fa";
import ChartDisplay from "../ui/ChartDisplay"; // Componente de UI para o gráfico

/**
 * Componente StatCard
 * Exibe um cartão simples com um título e um valor para estatísticas rápidas.
 */
const StatCard = ({ title, value }) => (
  <div className="app-stat-card">
    <h5>{title}</h5>
    <p>{value ?? "-"}</p>
  </div>
);

/**
 * Componente EstatisticasSection
 * Orquestra a exibição das estatísticas principais e dos gráficos interativos.
 */
const EstatisticasSection = () => {
  // --- ESTADO DO COMPONENTE ---

  // Estado para armazenar os dados dos cartões (Hoje, Mês, Total). Inicia como nulo.
  const [visitorStats, setVisitorStats] = useState(null);

  // Estado para armazenar TODOS os dados de gráficos recebidos da API.
  // Renomeado de 'chartData' para 'allChartData' para maior clareza.
  const [allChartData, setAllChartData] = useState(null);

  // Estado para controlar qual gráfico está sendo exibido no momento.
  // O valor é uma chave que corresponde a um dos gráficos em 'allChartData'.
  // 'visitsMonthly' é definido como padrão inicial.
  const [activeChart, setActiveChart] = useState("visitsMonthly");

  // Estado para controlar a exibição do spinner de carregamento.
  const [loading, setLoading] = useState(true);

  // --- LÓGICA E DADOS ---

  // Objeto para mapear as chaves dos gráficos para nomes amigáveis que serão exibidos nos botões.
  // Facilita a criação dos controles de UI de forma dinâmica.
  const chartOptions = {
    visitsMonthly: "Visitas (Mês)",
    leadsMonthly: "Leads (Mês)",
    visitsDaily: "Visitas (30 dias)",
    leadsDaily: "Leads (30 dias)",
    visitsYearly: "Visitas (Ano)",
    leadsYearly: "Leads (Ano)",
  };

  // Efeito para buscar os dados da API quando o componente é montado.
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Inicia o carregamento
      try {
        // Usa Promise.all para buscar dados das estatísticas e dos gráficos em paralelo, otimizando o tempo de carregamento.
        const [statsRes, chartRes] = await Promise.all([
          apiClient.get("/api/admin/visitor-stats"),
          apiClient.get(`/api/chart-data`),
        ]);

        // Armazena os dados dos cartões no estado se a requisição for bem-sucedida.
        if (statsRes.data.success) {
          setVisitorStats(statsRes.data.data);
        }

        // Armazena o objeto completo com todos os gráficos no estado.
        if (chartRes.data.success) {
          setAllChartData(chartRes.data.data); //
        }
      } catch (error) {
        // Em caso de erro na API, exibe no console e define um valor padrão para 'allChartData'.
        // Isso evita que a aplicação quebre ao tentar acessar uma propriedade de um objeto nulo.
        console.error("Falha ao buscar dados de estatísticas", error);
        setAllChartData({
          visitsMonthly: { labels: [], datasets: [] }, // Fallback para o gráfico padrão
        });
      } finally {
        // Independentemente de sucesso ou falha, o carregamento é finalizado.
        setLoading(false);
      }
    };

    fetchData();
  }, []); // O array vazio [] como segundo argumento garante que o efeito rode apenas uma vez.

  // --- RENDERIZAÇÃO ---

  // Enquanto os dados estão sendo carregados, exibe um spinner.
  if (loading) {
    return <div className="app-spinner large"></div>;
  }

  return (
    <>
      {/* Seção dos cartões de estatísticas */}
      <div className="app-dashboard-section">
        <h2 className="app-section-title">
          <span>
            <FaChartBar />
          </span>{" "}
          Estatísticas
        </h2>
        <div className="app-stats-grid">
          <StatCard title="Hoje" value={visitorStats?.today ?? 0} />
          <StatCard title="Mês" value={visitorStats?.month ?? 0} />
          <StatCard title="Total" value={visitorStats?.total ?? 0} />
        </div>
      </div>

      {/* Seção do gráfico interativo */}
      <div className="app-dashboard-section">
        {/* Controles para Seleção do Gráfico */}
        {/* Este container utiliza a classe .app-section-actions para alinhar os botões. */}
        <div
          className="app-section-actions"
          style={{ marginBottom: "var(--spacing-lg)", flexWrap: "wrap" }}
        >
          {/*
            - Object.entries(chartOptions) transforma o objeto de opções em um array de pares [chave, valor].
            - .map() itera sobre esse array para criar um botão para cada tipo de gráfico.
          */}
          {Object.entries(chartOptions).map(([key, name]) => (
            <button
              key={key}
              // Ao clicar, o estado 'activeChart' é atualizado com a chave do botão clicado.
              onClick={() => setActiveChart(key)}
              // A classe do botão é definida dinamicamente:
              // - `app-button small`: Classes base de estilo e tamanho.
              // - `${activeChart === key ? "primary" : "secondary"}`: Lógica condicional.
              //   - Se o `activeChart` atual for igual à chave deste botão, aplica a classe 'primary' (destaque).
              //   - Caso contrário, aplica a classe 'secondary' (padrão).
              className={`app-button small ${activeChart === key ? "primary" : "secondary"}`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Componente de Exibição do Gráfico */}
        <ChartDisplay
          // A prop 'chartData' recebe APENAS os dados do gráfico que está ativo no momento.
          // A expressão `allChartData[activeChart]` seleciona o objeto de gráfico correto (ex: allChartData['visitsMonthly']).
          // A verificação `allChartData ? ... : null` previne erros caso 'allChartData' ainda seja nulo.
          chartData={allChartData ? allChartData[activeChart] : null}
          isLoading={loading}
        />
      </div>
    </>
  );
};

export default EstatisticasSection;
