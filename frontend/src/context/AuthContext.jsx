import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login as loginApi, logout as logoutApi, register as registerApi } from '../api/authApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await loginApi({ email, password });
    setUser(response.data.user);
    return response;
  };

  const register = async (data) => {
    const response = await registerApi(data);
    setUser(response.data.user);
    return response;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
