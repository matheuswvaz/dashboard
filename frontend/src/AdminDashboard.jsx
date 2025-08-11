import React, { useState, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/AdminDashboard.css";

// Hooks
import useUserData from "../hooks/useUserData";

// Componentes de UI
import Sidebar from "../componentes/admin/ui/Sidebar";
import FeedbackPopup from "../componentes/admin/ui/FeedbackPopup";

// Seções carregadas de forma otimizada (Lazy Loading)
// Isso melhora o tempo de carregamento inicial da dashboard.
const ResumoSection = React.lazy(
  () => import("../componentes/admin/secoes/ResumoSection")
);
const EstatisticasSection = React.lazy(
  () => import("../componentes/admin/secoes/EstatisticasSection")
);
const PostagensSection = React.lazy(
  () => import("../componentes/admin/secoes/PostagensSection")
);
const LeadsSection = React.lazy(
  () => import("../componentes/admin/secoes/LeadsSection")
);
const CandidaturasSection = React.lazy(
  () => import("../componentes/admin/secoes/CandidaturasSection")
);
const GeolocalizacaoSection = React.lazy(
  () => import("../componentes/admin/secoes/GeolocalizacaoSection")
);
const ConfiguracoesSection = React.lazy(
  () => import("../componentes/admin/secoes/ConfiguracoesSection")
);

// Mapeamento para renderizar o componente correto
const sectionComponents = {
  resumo: ResumoSection,
  estatisticas: EstatisticasSection,
  postagens: PostagensSection,
  leads: LeadsSection,
  candidaturas: CandidaturasSection,
  geolocalizacao: GeolocalizacaoSection,
  configuracoes: ConfiguracoesSection,
};

// Animação para a transição suave entre as seções
const sectionVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

// Componente para exibir enquanto uma seção está sendo carregada
const LoadingFallback = () => (
  <div className="app-loading-overlay">
    <div className="app-spinner large"></div>
  </div>
);

const AdminDashboard = () => {
  // O hook agora gerencia o usuário, o carregamento inicial e o logout
  const { userData, loading, handleUserUpdate, handleLogout } = useUserData();

  // Estado para controlar a seção ativa e o feedback para o usuário
  const [activeSection, setActiveSection] = useState("resumo");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Função para exibir pop-ups de feedback (passada como prop para as seções)
  const showFeedback = useCallback((type, message) => {
    setFeedback({ type, message });
    const timer = setTimeout(
      () => setFeedback({ type: "", message: "" }),
      4000
    );
    return () => clearTimeout(timer);
  }, []);

  // Determina qual componente de seção deve ser renderizado
  const ActiveComponent = sectionComponents[activeSection];

  // Exibe o loading principal apenas na primeira vez
  if (loading) {
    return <LoadingFallback />;
  }

  // O hook `useUserData` já lida com o redirecionamento se não houver usuário
  if (!userData) {
    return null;
  }

  return (
    // O ID principal para o escopo de estilos (ex: tema dark/light)
    <div id="admin-dashboard-scope">
      <Sidebar
        userData={userData}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />

      <main className="app-main-content">
        <FeedbackPopup feedback={feedback} />

        {/* O Suspense é necessário para o React.lazy funcionar.
              Ele mostra o LoadingFallback enquanto o JS da seção é baixado. */}
        <Suspense fallback={<LoadingFallback />}>
          {/* AnimatePresence do Framer Motion garante as animações de entrada e saída */}
          <AnimatePresence mode="wait">
            <motion.div
              // A 'key' é crucial. Quando ela muda, o Framer Motion ativa a animação.
              key={activeSection}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Renderiza o componente da seção ativa, passando as props necessárias.
                    TODA a lógica de posts, leads, etc., que antes estava aqui,
                    agora vive dentro do ActiveComponent. */}
              {ActiveComponent && (
                <ActiveComponent
                  userData={userData}
                  showFeedback={showFeedback}
                  onUserUpdate={handleUserUpdate}
                  setActiveSection={setActiveSection} // Permite navegação entre seções (ex: Resumo -> Leads)
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  );
};

export default AdminDashboard;
