import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartDisplay = ({ chartData, isLoading }) => {
  // A verificação de 'isLoading' continua importante para o estado inicial.
  if (isLoading) {
    return (
      <div className="app-placeholder-section chart-loading">
        <div className="app-spinner"></div>
      </div>
    );
  }

  // CORREÇÃO: Verificação mais robusta para garantir que os dados do gráfico são válidos.
  // Verificamos não só se 'chartData' existe, mas também se ele tem a propriedade 'datasets' como um array.
  if (!chartData || !Array.isArray(chartData.datasets)) {
    return (
      <div className="app-placeholder-section">
        <p>Não foi possível carregar os dados do gráfico.</p>
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Visão Geral de Acessos" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="app-dashboard-section">
      <div className="app-chart-container">
        {/* Agora, esta linha só será executada quando 'chartData.datasets' for um array válido */}
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};

export default ChartDisplay;
