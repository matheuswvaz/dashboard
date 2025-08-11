import { useState, useEffect, useCallback, useMemo } from "react";
import apiClient from "../utils/axios";

// Esta é a nova função de operação em massa. Note que ela não tem mais o `window.confirm`.
const executeBulkOperation = async (postIds, actionFunction, showFeedback) => {
  if (postIds.length === 0) return;

  showFeedback("info", `Processando ${postIds.length} item(ns)...`);

  // Executa todas as promessas em paralelo
  const results = await Promise.allSettled(
    postIds.map((id) => actionFunction(id))
  );

  // Conta sucessos e falhas

  const successCount = results.filter((r) => r.status === "fulfilled").length;
  const failureCount = results.length - successCount;

  if (successCount > 0) {
    showFeedback("success", `Operação realizada com sucesso.`);
  }
  if (failureCount > 0) {
    showFeedback("error", `Uma falha ocorreu.`);
    console.error(
      "Falhas na operação:",
      results.filter((r) => r.status === "rejected").map((r) => r.reason) 
    );
    const firstRejected = results.find((r) => r.status === "rejected");
    if (firstRejected && firstRejected.reason) {
      console.error(
        "Detalhes do primeiro erro:",
        firstRejected.reason.response?.data || firstRejected.reason.message
      );
    }
  }
};

export const usePosts = (showFeedback) => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Mudado para booleano
  const [selectedPosts, setSelectedPosts] = useState([]);

  const fetchPosts = useCallback(async () => {
    if (!loading) setLoading(true); // Garante que o loading seja ativado
    try {
      const statusesToFetch = ["publicado", "agendado", "draft", "trashed"];
      const fetchPromises = statusesToFetch.map((status) =>
        apiClient.get(`/api/postagens?status=${status}`)
      );
      const responses = await Promise.all(fetchPromises);
      const combinedPosts = responses.map((res) => res.data.data || []).flat();
      setAllPosts(combinedPosts);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
      showFeedback("error", `Erro ao carregar posts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [showFeedback, loading]);

  useEffect(() => {
    fetchPosts();
  }, []); // Executa apenas uma vez na montagem

  // ===================================================================
  // FUNÇÕES DE AÇÃO EM MASSA (AGORA CHAMAM A FUNÇÃO HELPER)
  // ===================================================================
  const handleDeleteSelected = async () => {
    if (
      window.confirm(`Mover ${selectedPosts.length} post(s) para a lixeira?`)
    ) {
      setIsProcessing(true);
      await executeBulkOperation(
        selectedPosts,
        (id) => apiClient.delete(`/api/postagens/${id}`),
        showFeedback
      );
      await fetchPosts();
      setSelectedPosts([]);
      setIsProcessing(false);
    }
  };

  const handleRestoreSelected = async () => {
    if (window.confirm(`Restaurar ${selectedPosts.length} post(s)?`)) {
      setIsProcessing(true);
      await executeBulkOperation(
        selectedPosts,
        (id) => apiClient.put(`/api/postagens/${id}/restore`),
        showFeedback
      );
      await fetchPosts();
      setSelectedPosts([]);
      setIsProcessing(false);
    }
  };

  const handleDeletePermanentSelected = async () => {
    if (
      window.confirm(
        `EXCLUIR PERMANENTEMENTE ${selectedPosts.length} post(s)? Esta ação é irreversível.`
      )
    ) {
      setIsProcessing(true);
      await executeBulkOperation(
        selectedPosts,
        (id) => apiClient.delete(`/api/postagens/${id}/permanent`),
        showFeedback
      );
      await fetchPosts();
      setSelectedPosts([]);
      setIsProcessing(false);
    }
  };

  // As ações individuais agora são apenas casos especiais da ação em massa
  const handleDeletePost = (id) => {
    if (window.confirm("Mover este post para a lixeira?")) {
      setIsProcessing(true);
      executeBulkOperation(
        [id],
        (i) => apiClient.delete(`/api/postagens/${i}`),
        showFeedback
      ).finally(() => fetchPosts().finally(() => setIsProcessing(false)));
    }
  };

  const handleRestorePost = (id) => {
    if (window.confirm("Restaurar este post?")) {
      setIsProcessing(true);
      executeBulkOperation(
        [id],
        (i) => apiClient.put(`/api/postagens/${i}/restore`),
        showFeedback
      ).finally(() => fetchPosts().finally(() => setIsProcessing(false)));
    }
  };

  const handleDeletePermanent = (id) => {
    if (window.confirm("EXCLUIR PERMANENTEMENTE? A ação é irreversível.")) {
      setIsProcessing(true);
      executeBulkOperation(
        [id],
        (i) => apiClient.delete(`/api/postagens/${i}/permanent`),
        showFeedback
      ).finally(() => fetchPosts().finally(() => setIsProcessing(false)));
    }
  };

  const handlePublishDraft = useCallback(
    async (id) => {
      if (window.confirm("Publicar este rascunho?")) {
        setIsProcessing(true);
        try {
          await apiClient.put(`/api/postagens/${id}/restore`);
          showFeedback("success", "Rascunho publicado com sucesso!");
          await fetchPosts();
        } catch (err) {
          showFeedback(
            "error",
            `Erro ao publicar: ${err.response?.data?.message || err.message}`
          );
        } finally {
          setIsProcessing(false);
        }
      }
    },
    [showFeedback, fetchPosts]
  );

  // Funções de Seleção
  const handleSelectPost = (postId) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = (postIds) => {
    const allSelected =
      postIds.every((id) => selectedPosts.includes(id)) && postIds.length > 0;
    if (allSelected) {
      setSelectedPosts((prev) => prev.filter((id) => !postIds.includes(id)));
    } else {
      setSelectedPosts((prev) => [...new Set([...prev, ...postIds])]);
    }
  };

  const clearSelection = useCallback(() => setSelectedPosts([]), []);

  // Memoização dos posts
  const postsByStatus = useMemo(
    () => ({
      publicado: allPosts.filter((p) => p.status === "publicado"),
      agendado: allPosts.filter((p) => p.status === "agendado"),
      draft: allPosts.filter((p) => p.status === "draft"),
      trashed: allPosts.filter((p) => p.status === "trashed"),
    }),
    [allPosts]
  );

  return {
    postsByStatus,
    loading,
    isProcessing,
    selectedPosts,
    fetchPosts,
    clearSelection,
    handleSelectPost,
    handleSelectAll,
    // Ações individuais
    handleDeletePost,
    handlePublishDraft,
    handleRestorePost,
    handleDeletePermanent,
    // Ações em massa para serem usadas pelo componente
    handleDeleteSelected,
    handleRestoreSelected,
    handleDeletePermanentSelected,
  };
};
