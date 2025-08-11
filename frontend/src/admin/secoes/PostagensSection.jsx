import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaUpload,
  FaUndo,
  FaTrashAlt,
  FaPlus,
  FaMinus,
  FaPlusCircle,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

import { usePosts } from "../../../hooks/usePosts";
import CriarPost from "../../CriarPost";
import { TextButton } from "../ui/Button";
import apiClient from "../../../utils/axios";
import CustomSelect from "../../CustomSelect";
import "../../../styles/CustomSelect.css";

// ============================================================================
// COMPONENTE: PostCard (Card de Post Individual com Seleção)
// ============================================================================
const PostCard = ({ post, isSelected, onSelect, children }) => (
  <div className={`post-card ${isSelected ? "selected" : ""}`}>
    <label className="post-card-selector">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(post.id)}
        aria-label={`Selecionar post: ${post.titulo}`}
      />
    </label>
    {post.imagem && (
      <img
        src={post.imagem}
        alt={post.titulo}
        className="post-card__image"
        loading="lazy"
      />
    )}
    <div className="post-card__content">
      <Link
        to={`/${post.categoria}/${post.id}`}
        className="post-card__title-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h4 className="post-card__title">{post.titulo}</h4>
      </Link>
      <p className="post-card__meta">
        <span className={`app-tag status-${post.status.toLowerCase()}`}>
          {post.status}
        </span>
        {post.categoria && (
          <span className="app-tag category">{post.categoria}</span>
        )}
        <span>Por: {post.autor}</span>
        <span>
          {post.data_formatada || post.data_agendamento_formatada || "-"}
        </span>
      </p>
    </div>
    <div className="post-card__actions">{children}</div>
  </div>
);

// ============================================================================
// COMPONENTE: PostList (Seção Retrátil para Lista de Posts)
// ============================================================================
const PostList = ({
  title,
  posts,
  renderCard,
  emptyMessage,
  isExpanded,
  onToggle,
  onSelectAll,
  isAllSelected,
}) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const showMore = () => setVisibleCount((prev) => prev + 10);

  return (
    <div className="post-list-section">
      <div className="post-list-section__header" onClick={onToggle}>
        <div className="post-list-section__header-main">
          <span className="post-list-section__toggle-icon">
            {isExpanded ? <FaMinus /> : <FaPlus />}
          </span>
          <h3 className="post-list-section__title">
            {title} ({posts.length})
          </h3>
        </div>
        {isExpanded && posts.length > 0 && (
          <div className="post-list-section__header-controls">
            <label
              className="select-all-label"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                onChange={onSelectAll}
                checked={isAllSelected}
              />
              Selecionar Todos
            </label>
          </div>
        )}
      </div>
      {isExpanded && (
        <>
          {posts.length > 0 ? (
            <div className="post-list-section__grid">
              {posts.slice(0, visibleCount).map(renderCard)}
            </div>
          ) : (
            <p className="no-posts-message">{emptyMessage}</p>
          )}
          {visibleCount < posts.length && (
            <div className="show-more-container">
              <button className="app-button link show-more" onClick={showMore}>
                VER MAIS ({posts.length - visibleCount} restantes)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENTE: BulkActionsToolbar (Barra de Ações em Massa) - CORRIGIDO
// ============================================================================
const BulkActionsToolbar = ({
  selectedCount,
  onApplyAction,
  onClearSelection,
  isProcessing,
}) => {
  const [action, setAction] = useState("");

  if (selectedCount === 0) return null;

  const handleApply = () => {
    if (action) {
      onApplyAction(action);
      setAction(""); // Resetar a ação após aplicar
    }
  };

  const bulkActionOptions = [
    { label: "Publicar", value: "publish" },
    { label: "Mover para Lixeira", value: "trash" },
    { label: "Restaurar da Lixeira", value: "restore" },
    { label: "Excluir Permanentemente", value: "delete_permanent" },
  ];

  return (
    <div className="bulk-actions-toolbar">
      <span className="selected-count">
        {selectedCount} item(s) selecionado(s)
      </span>
      <CustomSelect
        options={bulkActionOptions}
        selectedValue={action}
        onChange={setAction}
        placeholder="Selecionar..."
      />
      <button
        className="app-button"
        onClick={handleApply}
        disabled={!action || isProcessing}
      >
        {isProcessing ? "Processando..." : "Aplicar"}
      </button>
      <button
        className="app-button"
        onClick={onClearSelection}
        disabled={isProcessing}
        title="Limpar seleção"
      >
        Limpar
      </button>
    </div>
  );
};

// ============================================================================
// COMPONENTE: ManagementToolbar (Barra de Ferramentas com Filtros Avançados)
// ============================================================================

const ManagementToolbar = ({
  filters,
  onFilterChange,
  availableCategories,
  children,
}) => {
  // 1. Definindo as opções de categoria DENTRO do componente
  const categoryOptions = availableCategories.map((cat) => ({
    label: cat,
    value: cat.toLowerCase(),
  }));

  // 2. Definindo as opções para o seletor de ordenação
  const sortOrderOptions = [
    { label: "Mais Recentes", value: "recentes" },
    { label: "Mais Antigos", value: "antigos" },
  ];

  return (
    <div className="posts-management-toolbar">
      <div className="filters-primary">
        <div className="toolbar-search-field">
          <FaSearch />
          <input
            type="search"
            placeholder="Buscar por título..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange("searchTerm", e.target.value)}
          />
        </div>
        <div className="toolbar-filters-secondary">
          {/* Seletor de Categoria */}
          <CustomSelect
            options={[
              { label: "Todas as categorias", value: "todos" },
              ...categoryOptions,
            ]}
            selectedValue={filters.categoryFilter}
            onChange={(value) => onFilterChange("categoryFilter", value)}
            placeholder="Todas as categorias"
          />

          <div className="date-filter-wrapper">
            <input
              type="date"
              value={filters.dateFilter}
              onChange={(e) => onFilterChange("dateFilter", e.target.value)}
              aria-label="Filtrar por data"
            />
            {filters.dateFilter && (
              <button
                onClick={() => onFilterChange("dateFilter", "")}
                className="clear-date-btn"
                title="Limpar data"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* 3. Seletor de Ordenação  */}
          <CustomSelect
            options={sortOrderOptions}
            selectedValue={filters.sortOrder}
            onChange={(value) => onFilterChange("sortOrder", value)}
          />
        </div>
      </div>
      <div className="filters-bulk-actions">{children}</div>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL: PostagensSection
// ============================================================================
const PostagensSection = ({ userData, showFeedback }) => {
  const [editingPost, setEditingPost] = useState(null);
  const [sectionsVisibility, setSectionsVisibility] = useState({
    draft: true,
    agendado: true,
    publicado: true,
    trashed: false,
  });

  const [filters, setFilters] = useState({
    searchTerm: "",
    sortOrder: "recentes",
    categoryFilter: "todos",
    dateFilter: "",
  });

  const {
    postsByStatus,
    loading,
    isProcessing,
    selectedPosts,
    fetchPosts,
    handleDeletePost,
    handlePublishDraft,
    handleRestorePost,
    handleDeletePermanent,
    handleSelectPost,
    handleSelectAll,
    clearSelection,
    handleDeleteSelected,
    handleRestoreSelected,
    handleDeletePermanentSelected,
  } = usePosts(showFeedback);

  const handleEditPost = (post) => {
    setEditingPost(post);
    document
      .querySelector(".create-post-form-section details")
      ?.setAttribute("open", "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateOrCreate = () => {
    setEditingPost(null);
    fetchPosts();
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const toggleSection = (section) =>
    setSectionsVisibility((prev) => ({ ...prev, [section]: !prev[section] }));

  const { filteredPostsByStatus, availableCategories } = useMemo(() => {
    const allPosts = Object.values(postsByStatus).flat();
    const categories = [
      ...new Set(allPosts.map((p) => p.categoria).filter(Boolean)),
    ];
    let filtered = allPosts
      .filter((p) =>
        p.titulo.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
      .filter(
        (p) =>
          filters.categoryFilter === "todos" ||
          (p.categoria && p.categoria.toLowerCase() === filters.categoryFilter)
      )
      .filter((p) => {
        if (!filters.dateFilter) return true;
        const postDate = p.data_publicacao || p.data_agendamento;
        if (!postDate) return false;
        return (
          new Date(postDate).toISOString().slice(0, 10) === filters.dateFilter
        );
      });
    filtered.sort((a, b) => {
      const dateA = new Date(
        a.data_publicacao || a.data_agendamento || a.criado_em || 0
      );
      const dateB = new Date(
        b.data_publicacao || b.data_agendamento || b.criado_em || 0
      );
      return filters.sortOrder === "recentes" ? dateB - dateA : dateA - dateB;
    });
    const result = { draft: [], agendado: [], publicado: [], trashed: [] };
    filtered.forEach((post) => {
      if (result[post.status]) {
        result[post.status].push(post);
      }
    });
    return { filteredPostsByStatus: result, availableCategories: categories };
  }, [postsByStatus, filters]);

  // Função para aplicar ações em massa
  const handleApplyBulkAction = async (action) => {
    // Um mapeamento direto da string da ação para a função correta do hook.
    const actionMap = {
      trash: handleDeleteSelected,
      restore: handleRestoreSelected,
      delete_permanent: handleDeletePermanentSelected,
      // A ação 'publish' para rascunhos em massa pode ser adicionada aqui se necessário
    };

    const selectedAction = actionMap[action];

    if (selectedAction) {
      await selectedAction(); // Apenas chama a função. Toda a lógica já está no hook.
    } else {
      showFeedback("warn", `Ação '${action}' não implementada.`);
    }
  };

  if (loading) {
    return <div className="app-spinner large">Carregando Posts...</div>;
  }

  const postSections = [
    { key: "publicado", title: "Publicados", empty: "Nenhum post publicado." },
    { key: "draft", title: "Rascunhos", empty: "Nenhum rascunho encontrado." },
    { key: "agendado", title: "Agendados", empty: "Nenhum post agendado." },
    { key: "trashed", title: "Lixeira", empty: "A lixeira está vazia." },
  ];

  const renderPostActions = (post, sectionKey) => {
    switch (sectionKey) {
      case "draft":
        return (
          <>
            <TextButton
              textIcon={<FaUpload />}
              onClick={() => handlePublishDraft(post.id)}
              title="Publicar"
            />
            <TextButton
              textIcon={<FaEdit />}
              onClick={() => handleEditPost(post)}
              title="Editar"
            />
            <TextButton
              textIcon={<FaTrash />}
              onClick={() => handleDeletePost(post.id)}
              title="Lixeira"
              className="danger"
              disabled={isProcessing === post.id}
            />
          </>
        );
      case "agendado":
      case "publicado":
        return (
          <>
            <TextButton
              textIcon={<FaEdit />}
              onClick={() => handleEditPost(post)}
              title="Editar"
            />
            <TextButton
              textIcon={<FaTrash />}
              onClick={() => handleDeletePost(post.id)}
              title="Lixeira"
              className="danger"
              disabled={isProcessing === post.id}
            />
          </>
        );
      case "trashed":
        return (
          <>
            <TextButton
              textIcon={<FaUndo />}
              onClick={() => handleRestorePost(post.id)}
              title="Restaurar"
            />
            <TextButton
              textIcon={<FaTrashAlt />}
              onClick={() => handleDeletePermanent(post.id)}
              title="Excluir"
              className="danger"
              disabled={isProcessing === post.id}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="posts-management-page">
      <div className="create-post-form-section">
        <details>
          <summary>
            <h3>
              <FaPlusCircle />{" "}
              {editingPost ? "Editando Postagem" : "Adicionar Nova Postagem"}
            </h3>
          </summary>
          <CriarPost
            key={editingPost ? editingPost.id : "new"}
            onPostCreated={handleUpdateOrCreate}
            onPostUpdated={handleUpdateOrCreate}
            postToEdit={editingPost}
            onCancelEdit={() => setEditingPost(null)}
            authorName={userData?.name}
            showFeedback={showFeedback}
            apiClient={apiClient}
          />
        </details>
      </div>

      <ManagementToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        availableCategories={availableCategories}
      >
        <BulkActionsToolbar
          selectedCount={selectedPosts.length}
          onApplyAction={handleApplyBulkAction}
          onClearSelection={clearSelection}
          isProcessing={isProcessing}
        />
      </ManagementToolbar>

      {postSections.map((section) => {
        const posts = filteredPostsByStatus[section.key] || [];
        const postIds = posts.map((p) => p.id);
        const isAllSelected =
          postIds.length > 0 &&
          postIds.every((id) => selectedPosts.includes(id));

        return (
          <PostList
            key={section.key}
            title={section.title}
            posts={posts}
            emptyMessage={section.empty}
            isExpanded={sectionsVisibility[section.key]}
            onToggle={() => toggleSection(section.key)}
            onSelectAll={() => handleSelectAll(postIds)}
            isAllSelected={isAllSelected}
            renderCard={(p) => (
              <PostCard
                key={p.id}
                post={p}
                isSelected={selectedPosts.includes(p.id)}
                onSelect={handleSelectPost}
              >
                {renderPostActions(p, section.key)}
              </PostCard>
            )}
          />
        );
      })}
    </div>
  );
};

export default PostagensSection;
