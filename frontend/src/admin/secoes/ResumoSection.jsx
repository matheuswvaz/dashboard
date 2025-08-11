import React, { useState, useEffect } from "react";
import apiClient from "../../utils/axios";
import { formatDateSafe } from "../../utils/formatDate";
import {
  FaEye,
  FaCalendarAlt,
  FaUsers,
  FaFileAlt,
  FaHome,
} from "react-icons/fa";


const SummaryCard = ({ title, value, icon, onClick }) => (
  <div
    className={`app-summary-card ${onClick ? "clickable" : ""}`}
    onClick={onClick}
  >
    <div className="card-icon">{icon}</div>
    <div className="card-content">
      <h3>{title}</h3>
      <p className="value">{value ?? "-"}</p>
      {onClick && <span className="link">Ver Detalhes &rarr;</span>}
    </div>
  </div>
);

const ResumoSection = ({ setActiveSection }) => {
  const [stats, setStats] = useState({ today: 0, month: 0, total: 0 });
  const [postCount, setPostCount] = useState(0);
  const [leadCount, setLeadCount] = useState(0);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumoData = async () => {
      setLoading(true);
      try {
        // Chamadas de API ao backend, SEM alterar as funções existentes lá.
        // Acessamos .data.data porque o `successResponse` do backend encapsula os dados.
        const [statsRes, postsRes, allLeadsRes] = await Promise.all([
          apiClient.get("/api/admin/visitor-stats"),
          apiClient.get("/api/postagens?status=publicado"), // Apenas filtra por publicado, o backend retorna a lista completa
          apiClient.get("/api/admin/leads?limit=999"), // Usamos um limite alto para buscar 'todos' os leads, como no useLeads.js
        ]);

        // 1. Processar Estatísticas de Visitas
        if (statsRes.data && statsRes.data.success) {
          setStats(statsRes.data.data); // O objeto de stats está em .data.data
        } else {
          console.warn(
            "API de estatísticas retornou sucesso: false ou dados ausentes.",
            statsRes.data
          );
        }

        // 2. Processar Contagem de Posts Publicados
        if (
          postsRes.data &&
          postsRes.data.success &&
          Array.isArray(postsRes.data.data)
        ) {
          setPostCount(postsRes.data.data.length); // A contagem é o tamanho do array de posts publicados
        } else {
          console.warn(
            "API de postagens retornou sucesso: false ou dados ausentes/não é um array.",
            postsRes.data
          );
        }

        // 3. Processar Contagem Total de Leads e Leads Recentes
        if (
          allLeadsRes.data &&
          allLeadsRes.data.success &&
          Array.isArray(allLeadsRes.data.data)
        ) {
          setLeadCount(allLeadsRes.data.data.length); // A contagem total de leads é o tamanho do array completo

          // Para leads recentes, filtramos o array completo se necessário ou pegamos os primeiros 5
          // Se a API original já limitava a 5, então a chamada para 999 deve pegar tudo.
          // Aqui, apenas pegamos os 5 primeiros do array completo para 'recentLeads'.
          setRecentLeads(allLeadsRes.data.data.slice(0, 5));
        } else {
          console.warn(
            "API de leads retornou sucesso: false ou dados ausentes/não é um array.",
            allLeadsRes.data
          );
        }
      } catch (error) {
        console.error("Erro ao carregar dados do resumo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResumoData();
  }, []); // O array de dependências vazio garante que o useEffect rode apenas uma vez ao montar o componente.

  // Exibe um spinner de carregamento enquanto os dados estão sendo buscados
  if (loading) return <div className="app-spinner large"></div>;

  return (
    <div className="app-dashboard-section homepage">
      <h2 className="app-section-title">
        <span>
          <FaHome />
        </span>{" "}
        Resumo
      </h2>
      <div className="app-summary-grid">
        <SummaryCard
          title="Visitas Hoje"
          value={stats.today}
          icon={<FaEye />}
          onClick={() => setActiveSection("estatisticas")}
        />
        <SummaryCard
          title="Visitas Mês"
          value={stats.month}
          icon={<FaCalendarAlt />}
          onClick={() => setActiveSection("estatisticas")}
        />
        <SummaryCard
          title="Total Leads"
          value={leadCount} 
          icon={<FaUsers />}
          onClick={() => setActiveSection("leads")}
        />
        <SummaryCard
          title="Total Posts"
          value={postCount} 
          icon={<FaFileAlt />}
          onClick={() => setActiveSection("postagens")}
        />
      </div>

      <div className="app-section-grid">
        <div className="app-placeholder-section activity-feed">
          <h3>Leads Recentes</h3>
          {recentLeads.length > 0 ? (
            <ul className="app-recent-list">
              {recentLeads.map((l) => (
                <li key={l.id}>
                  <div className="lead-info">
                    <strong>{l.name || "S/ Nome"}</strong>
                    <span>{l.email}</span>
                  </div>
                  <span className="app-list-date">
                    {formatDateSafe(l.data_envio)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="app-no-data">Nenhum lead recente.</p>
          )}
          {/* O botão "Ver todos" aparecerá se a contagem total de leads for maior que 5 */}
          {leadCount > 5 && (
            <button
              className="app-button link small"
              onClick={() => setActiveSection("leads")}
            >
              Ver todos &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumoSection;
