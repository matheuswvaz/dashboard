// src/componentes/admin/secoes/GeolocalizacaoSection.jsx
import React from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import GeolocationMap from "../ui/GeolocationMap"; // Seu componente de mapa existente
import apiClient from '../../../utils/axios'; 
const GeolocalizacaoSection = () => {
  return (
    <div className="app-dashboard-section">
      <h2 className="app-section-title">
        <span>
          <FaMapMarkedAlt />
        </span>{" "}
        Acessos por Localização
      </h2>
      {/* O componente GeolocationMap deve ser ajustado para fazer seu próprio fetch de dados internamente */}
      <GeolocationMap apiClient={apiClient} />
    </div>
  );
};

export default GeolocalizacaoSection;
