export const PostCard = ({ post, isSelected, onSelect, children }) => {
  return (
    <label key={post.id} className="post-card-selector">
      <input
        type="checkbox"
        className="post-card-selector__input"
        checked={isSelected}
        onChange={() => onSelect(post.id)}
      />
      <div className="post-status-section__card">
        {post.imagem && (
          <img
            src={post.imagem}
            alt={`Imagem ${post.titulo}`}
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
        <div className="post-card__actions">
          {children} {/* Botões de ação específicos são injetados aqui */}
        </div>
      </div>
    </label>
  );
};
