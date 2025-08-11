
import { useState, useEffect } from "react";
import axios from "../utils/axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL;

const useFeedData = (categoria) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/postagens?categoria=${categoria}`
        );
        if (response.data.success && Array.isArray(response.data.data)) {
          const postsProcessados = response.data.data.map((p) => ({
            ...p,
            // Cria um objeto Date a partir da string ISO da API para ordenação confiável
            data_publicacao_obj: p.data_publicacao
              ? new Date(p.data_publicacao)
              : null,
          }));
          setPosts(postsProcessados);
        } else {
          setError(
            response.data.message || `Nenhum post de ${categoria} encontrado.`
          );
          setPosts([]);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Não foi possível conectar ao servidor."
        );
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [categoria]);

  return { posts, loading, error };
};

export default useFeedData;
