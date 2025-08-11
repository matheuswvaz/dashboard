import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  Popup,
} from "react-leaflet";
import L from "leaflet";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const GeolocationMap = ({ apiClient }) => {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapCenter, setMapCenter] = useState([-15.7801, -47.9292]); // Centro do Brasil
  const [mapZoom, setMapZoom] = useState(4); // Zoom inicial

  useEffect(() => {
    const fetchMapData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await apiClient.get("/api/admin/map-data"); // Sua API
        if (response.data?.success && Array.isArray(response.data.data)) {
          const validData = response.data.data.filter(
            (item) =>
              typeof item.latitude === "number" &&
              typeof item.longitude === "number" &&
              item.latitude !== 0 &&
              item.longitude !== 0 // Adicionado filtro para lat/lon 0
          );
          setMapData(validData);

          if (validData.length === 0 && response.data.data.length > 0) {
            console.warn(
              "Dados de geolocalização recebidos, mas nenhum com coordenadas válidas após filtragem."
            );
          }
        } else {
          throw new Error(
            response.data?.message || "Falha ao buscar dados do mapa"
          );
        }
      } catch (err) {
        console.error(
          "Erro ao buscar dados do mapa da API (GeolocationMap):",
          err
        );
        if (err.response) {
          console.error("Resposta do erro (GeolocationMap):", err.response);
        }
        setError(err.message || "Não foi possível carregar os dados do mapa.");
      } finally {
        setLoading(false);
      }
    };

    if (apiClient) {
      fetchMapData();
    }
  }, [apiClient]);

  const getRadius = (value) => {
    // Ajuste esta função para escalar o raio da bolha de acordo com a contagem de acessos
    if (value < 10) return 6;
    if (value < 50) return 9;
    if (value < 200) return 12;
    if (value < 1000) return 16;
    return 20;
  };

  if (loading)
    return (
      <div className="app-placeholder-section">
        <span className="app-spinner"></span> Carregando mapa...
      </div>
    );
  if (error)
    return (
      <div className="app-placeholder-section error-message">
        Erro ao carregar mapa: {error}
      </div>
    );
  if (mapData.length === 0)
    return (
      <div className="app-placeholder-section">
        Sem dados de geolocalização com coordenadas válidas para exibir.
        (Observação: Novos dados de lat/long serão coletados a partir de agora).
      </div>
    );

  return (
    <div
      className="app-map-container"
      style={{
        height: "550px",
        width: "100%",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--border-radius-medium)",
        marginTop: "20px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapData.map((item, index) => (
          <CircleMarker
            key={`${item.city}-${item.country}-${index}-${item.latitude}-${item.longitude}`} // Chave mais robusta
            center={[item.latitude, item.longitude]}
            radius={getRadius(item.value)}
            pathOptions={{
              color: "var(--primary-color-dark)", // Usar variáveis CSS se definidas
              fillColor: "var(--primary-color)",
              fillOpacity: 0.6,
              weight: 1, // Espessura da borda do círculo
            }}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openTooltip();
              },
              mouseout: (e) => {
                e.target.closeTooltip();
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -getRadius(item.value)]}>
              <strong>
                {item.city || "Cidade Desconhecida"}, {item.country}
              </strong>
              <br />
              Acessos: {item.value}
            </Tooltip>
            {/* <Popup>
              <h3>{item.city || "Cidade Desconhecida"}, {item.country}</h3>
              <p>Total de Acessos: {item.value}</p>
            </Popup> */}
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GeolocationMap;
