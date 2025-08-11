import { useState, useCallback, useEffect } from "react";
import apiClient from "../utils/axios";

export const useCandidaturas = (showFeedback) => {
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Estado do modal agora é um objeto para simplificar
  const [modalState, setModalState] = useState({
    isOpen: false,
    candidato: null,
    subject: "",
    body: "",
  });

  const fetchCandidaturas = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/admin/candidaturas");
      if (data.success) {
        setCandidaturas(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showFeedback("error", `Erro ao carregar candidaturas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  useEffect(() => {
    fetchCandidaturas();
  }, [fetchCandidaturas]);

  const handleUpdateStatus = useCallback(
    async (id, status) => {
      try {
        await apiClient.put(`/api/admin/candidaturas/${id}/status`, { status });
        showFeedback("success", `Status atualizado para "${status}"!`);
        fetchCandidaturas(); // Re-fetch para atualizar a lista
      } catch (e) {
        showFeedback(
          "error",
          `Erro ao atualizar status: ${e.response?.data?.message || e.message}`
        );
      }
    },
    [fetchCandidaturas, showFeedback]
  );

  const handleOpenModal = useCallback((candidato, action) => {
    let subject, body;
    if (action === "aprovar") {
      subject = `Processo Seletivo - Grupo Nepen: Próximas Etapas`;
      body = `Olá, ${candidato.nome}.\n\nAgradecemos seu interesse na vaga de ${candidato.vaga}.\n\nGostaríamos de convidá-lo(a) para a próxima etapa do nosso processo seletivo.\n\n[Detalhes da próxima etapa]\n\nAtenciosamente,`;
    } else {
      subject = `Retorno sobre o Processo Seletivo - Grupo Nepen`;
      body = `Olá, ${candidato.nome}.\n\nAgradecemos seu interesse na vaga de ${candidato.vaga}.\n\nNeste momento, optamos por seguir com outros candidatos.\n\nDesejamos sucesso em sua trajetória.\n\nAtenciosamente,`;
    }
    setModalState({ isOpen: true, candidato, subject, body });
  }, []);

  const handleCloseModal = () =>
    setModalState({ isOpen: false, candidato: null, subject: "", body: "" });

  const handleSendEmail = useCallback(
    async (e) => {
      e.preventDefault();
      setIsProcessing(true);
      const { candidato, subject, body } = modalState;
      try {
        await apiClient.post(
          `/api/admin/candidaturas/${candidato.id}/responder`,
          {
            assunto: subject,
            mensagem: body,
          }
        );
        showFeedback("success", "E-mail de resposta enviado!");
        const newStatus = subject.includes("Próximas Etapas")
          ? "Contato Realizado"
          : "Rejeitado";
        handleUpdateStatus(candidato.id, newStatus);
        handleCloseModal();
      } catch (e) {
        showFeedback(
          "error",
          `Erro ao enviar e-mail: ${e.response?.data?.message || e.message}`
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [modalState, showFeedback, handleUpdateStatus]
  );

  return {
    candidaturas,
    loading,
    isProcessing,
    modalState,
    setModalState,
    handleOpenModal,
    handleCloseModal,
    handleSendEmail,
  };
};
