import React, { useState, useEffect } from "react";
import axios from "./utils/axios";
import { useNavigate } from "react-router-dom";
import "./styles/AdminLogin.css";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { motion } from "framer-motion";

// URL Base da API
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL;

// Componente da Página de Login
const AdminLogin = () => {
  // --- Estados ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("darkMode", darkMode); // Salvar a preferência do tema
  }, [darkMode]);

  // --- Lógica da API  ---
  const handleApiCall = async (
    url,
    data,
    successMessage,
    modeAfterSuccess = "login"
  ) => {
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await axios.post(url, data);
      const token = response.data?.data?.token;
      if (url.endsWith("/admin-login")) {
        if (token && typeof token === "string" && token.length > 0) {
          localStorage.setItem("adminToken", token);
          navigate("/admin-dashboard");
        } else {
          throw new Error("Token inválido ou não recebido.");
        }
      } else {
        setMessage(response.data?.message || successMessage);
        if (modeAfterSuccess === "login") {
          setIsLoginMode(true);
          setResetPasswordMode(false);
          resetFormState();
          setMessage(response.data?.message || successMessage);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || `Erro ao processar.`);
      console.error("API Error:", err.response || err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Usuário/senha obrigatórios.");
      return;
    }
    handleApiCall(`${API_BASE_URL}/admin-login`, { username, password }, "");
  };
  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !password || !email) {
      setError("Todos os campos obrigatórios.");
      return;
    }
    if (password.length < 6) {
      setError("Senha curta.");
      return;
    }
    handleApiCall(
      `${API_BASE_URL}/admin-register`,
      { username, password, email },
      "Cadastro OK! Faça login.",
      "login"
    );
  };
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!username) {
      setError("Informe o usuário.");
      return;
    }
    handleApiCall(
      `${API_BASE_URL}/admin-forgot-password`,
      { username },
      "Verifique seu e-mail."
    );
  };
  const handleSubmit = (e) => {
    if (isLoading) return;
    if (resetPasswordMode) {
      handleForgotPassword(e);
    } else if (isLoginMode) {
      handleLogin(e);
    } else {
      handleRegister(e);
    }
  };
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setResetPasswordMode(false);
    resetFormState();
  };
  const toggleResetMode = () => {
    setResetPasswordMode(!resetPasswordMode);
    resetFormState(false);
  };
  const resetFormState = (clearUser = true) => {
    setError("");
    setMessage("");
    if (clearUser) setUsername("");
    setPassword("");
    setEmail("");
  };

  const getTitle = () => {
    if (resetPasswordMode) return "Recuperar Senha";
    return isLoginMode ? "Acesso à plataforma" : "Crie sua conta";
  };

  // Variantes para a animação do card e seus filhos
  const cardVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150,
        staggerChildren: 0.1, // Atraso para os filhos
        delayChildren: 0.2, // Atraso inicial antes de os filhos começarem
      },
    },
    exit: {
      // Adiciona uma variante de saída para transições mais suaves
      opacity: 0,
      y: 50,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150,
      },
    },
  };

  const modeToggleVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", damping: 10, stiffness: 100, delay: 0.3 },
    },
    exit: { opacity: 0, x: 20 },
  };

  // --- Renderização ---
  return (
    // Wrapper com ID para escopo do CSS
    <div id="admin-login-scope">
      <motion.button
        onClick={() => setDarkMode(!darkMode)}
        title={darkMode ? "Mudar para tema claro" : "Mudar para tema escuro"}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "30px",
          color: darkMode ? "var(--text)" : "var(--login-clr-primary)",
          transition: "color 0.3s ease-in-out",
          zIndex: 100, // Garante que o botão esteja acima do card
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {darkMode ? <MdLightMode /> : <MdDarkMode />}
      </motion.button>
      <motion.div
        className="login-card"
        initial="hidden"
        animate="visible"
        exit="exit" // Adiciona a variante de saída
        variants={cardVariants}
        key={isLoginMode || resetPasswordMode} // A chave muda quando o modo muda, forçando a re-animação
      >
        <div className="login-header">
          <motion.h2 variants={itemVariants}>Dashboard Matheus</motion.h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {error && (
            <motion.p
              className="login-message error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}
          {message && (
            <motion.p
              className="login-message success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message}
            </motion.p>
          )}

          <motion.div
            className="input-group animated-label"
            variants={itemVariants}
          >
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="username">Usuário</label>
          </motion.div>

          {!resetPasswordMode && !isLoginMode && (
            <motion.div
              className="input-group animated-label"
              variants={itemVariants}
            >
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
              />
              <label htmlFor="email">Email</label>
            </motion.div>
          )}

          {!resetPasswordMode && (
            <motion.div
              className="input-group animated-label"
              variants={itemVariants}
            >
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                placeholder=" "
              />
              <label htmlFor="password">Senha</label>
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="form-button primary full-width"
            disabled={isLoading}
            variants={buttonVariants}
          >
            {isLoading
              ? "Aguarde..."
              : resetPasswordMode
                ? "Enviar Link"
                : isLoginMode
                  ? "Entrar"
                  : "Criar Conta"}
          </motion.button>
        </form>

        <motion.div className="login-links" variants={itemVariants}>
          {!resetPasswordMode && (
            <motion.button
              type="button"
              className="form-button link"
              onClick={toggleMode}
              variants={modeToggleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              key="toggleModeButton" // Chave para animar a troca do botão
            >
              {" "}
              {isLoginMode ? "Criar conta" : "Já tenho conta"}{" "}
            </motion.button>
          )}
          {!resetPasswordMode && isLoginMode && (
            <motion.button
              type="button"
              className="form-button link"
              onClick={toggleResetMode}
              variants={modeToggleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              key="forgotPasswordButton" // Chave para animar a troca do botão
            >
              {" "}
              Esqueci senha{" "}
            </motion.button>
          )}
          {resetPasswordMode && (
            <motion.button
              type="button"
              className="form-button link"
              onClick={toggleResetMode}
              variants={modeToggleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              key="backToLoginButton" // Chave para animar a troca do botão
            >
              {" "}
              Voltar para a página de Login{" "}
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;