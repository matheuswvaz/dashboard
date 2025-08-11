import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/axios";

const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    setUserData(null);
    navigate("/admin-login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!localStorage.getItem("adminToken")) {
        handleLogout();
        return;
      }
      try {
        const { data } = await apiClient.get("/api/admin/user-data");
        if (data.success) {
          setUserData(data.data);
        } else {
          throw new Error(data.message || "Falha ao autenticar");
        }
      } catch (error) {
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [handleLogout]);

  const handleUserUpdate = useCallback((updatedData) => {
    setUserData((prev) => ({ ...prev, ...updatedData }));
  }, []);

  return { userData, loading, handleUserUpdate, handleLogout };
};

export default useUserData;
