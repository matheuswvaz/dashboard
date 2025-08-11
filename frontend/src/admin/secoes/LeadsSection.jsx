import React from "react";
import { useLeads } from "../../hooks/useLeads";
import { FaListAlt } from "react-icons/fa";
import { Button } from "../ui/Button";
import DataTable from "../ui/DataTable"; // Componente de UI reutilizável
import { formatDateSafe } from "../../utils/formatDate";

const LeadsSection = ({ showFeedback }) => {
  const { loading, searchTerm, setSearchTerm, filteredLeads, handleDownload } =
    useLeads(showFeedback);

  if (loading) return <div className="app-spinner large"></div>;

  return (
    <div className="app-dashboard-section">
      <div className="app-section-header">
        <h2>
          <span>
            <FaListAlt />
          </span>{" "}
          Leads ({filteredLeads.length})
        </h2>
        <div className="app-section-actions">
          <input
            type="search"
            placeholder="Buscar leads..."
            className="app-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={handleDownload}
            textIcon="↓"
            disabled={!filteredLeads?.length}
          >
            Exportar Excel
          </Button>
        </div>
      </div>
      <DataTable
        headers={["Nome", "Email", "Telefone", "Data", "Marketing"]}
        data={filteredLeads}
        renderRow={(l) => (
          <tr key={l.id}>
            <td>{l.name || "-"}</td>
            <td>
              {l.email ? <a href={`mailto:${l.email}`}>{l.email}</a> : "-"}
            </td>
            <td>
              {l.phone ? (
                <a
                  href={`https://wa.me/${l.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.phone}
                </a>
              ) : (
                "-"
              )}
            </td>
            <td>{formatDateSafe(l.data_envio)}</td>
            <td>
              {l.consent_marketing === 1
                ? "Sim"
                : l.consent_marketing === 0
                  ? "Não"
                  : "N/D"}
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default LeadsSection;
