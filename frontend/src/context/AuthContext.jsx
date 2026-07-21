import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
  const response = await api.post("/api/auth/login/", { email, password });


  console.log("===== LOGIN RESPONSE =====");
  console.log(response.data);

  const { access, refresh, user: userData } = response.data;

  console.log("Access :", access);
  console.log("Refresh :", refresh);
  console.log("User :", userData);

  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
  localStorage.setItem("user", JSON.stringify(userData));

  console.log(
    "Token enregistré :",
    localStorage.getItem("access_token")
  );

  setUser(userData);

  return userData;
};

  const register = async (username, email, password) => {
    await api.post("/api/auth/register/", { username, email, password });

  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
