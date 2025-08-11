import React from 'react';

// Componente extraído para reutilização
export const Button = ({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
  className = "",
  isLoading = false,
  textIcon,
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`app-button ${variant} ${className}`}
  >
    {isLoading ? (
      <span className="app-spinner small"></span>
    ) : (
      textIcon && <span className="app-button-icon">{textIcon}</span>
    )}
    <span className="app-button-text">
      {isLoading ? "Aguarde..." : children}
    </span>
  </button>
);

export const TextButton = ({
  textIcon,
  onClick,
  disabled,
  title,
  className = "",
  ariaLabel,
}) => (
  <button
    className={`app-button link ${className}`}
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={ariaLabel || title}
  >
    {textIcon}
  </button>
);