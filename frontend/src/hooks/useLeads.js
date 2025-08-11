import { useState, useEffect, useMemo, useCallback } from "react";
import apiClient from "../utils/axios";
import { formatDateSafe } from "../utils/formatDate";
import * as XLSX from "xlsx";

export const useLeads = (showFeedback) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/admin/leads?limit=999");
      if (data.success) {
        setLeads(data.data);
      } else {
        throw new Error(data.message || "Falha ao carregar leads.");
      }
    } catch (error) {
      showFeedback("error", `Erro ao carregar leads: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    if (!searchTerm) return leads;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.name?.toLowerCase().includes(lowerSearchTerm) ||
        lead.email?.toLowerCase().includes(lowerSearchTerm) ||
        lead.phone?.includes(searchTerm)
    );
  }, [leads, searchTerm]);

  const handleDownload = useCallback(() => {
    if (!filteredLeads?.length) {
      showFeedback("warning", "Não há leads para exportar com o filtro atual.");
      return;
    }
    try {
      const sheetData = filteredLeads.map((l) => ({
        Nome: l.name || "-",
        Email: l.email || "-",
        Telefone: l.phone || "-",
        Data: formatDateSafe(l.data_envio),
        "Consentimento Marketing":
          l.consent_marketing === 1
            ? "Sim"
            : l.consent_marketing === 0
              ? "Não"
              : "N/D",
      }));
      const worksheet = XLSX.utils.json_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
      XLSX.writeFile(workbook, "leads_exportados.xlsx");
      showFeedback("success", "Arquivo Excel gerado com sucesso!");
    } catch (error) {
      showFeedback("error", "Ocorreu um erro ao gerar o arquivo Excel.");
    }
  }, [filteredLeads, showFeedback]);

  return {
    loading,
    searchTerm,
    setSearchTerm,
    filteredLeads,
    handleDownload,
  };
};
