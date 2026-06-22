import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('artisan_hub_token'));
  const [loading, setLoading] = useState(true); // true while restoring session

  // ── Persist token to localStorage ────────────────────────────────────────
  const saveToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('artisan_hub_token', newToken);
    } else {
      localStorage.removeItem('artisan_hub_token');
    }
  };

  // ── Restore session on mount ─────────────────────────────────────────────
  const restoreSession = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await authAPI.getMe();
      setUser(data.user);
    } catch (err) {
      // Token is invalid or expired — clear it
      console.warn('Session restore failed:', err.message);
      saveToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // ── Register ─────────────────────────────────────────────────────────────
  const register = async ({ firstName, middleName, lastName, email, password, role }) => {
    const name = [firstName, middleName, lastName].filter(Boolean).join(' ');

    const data = await authAPI.register({
      name,
      email,
      password,
      role: role || 'buyer',
    });

    saveToken(data.token);
    setUser(data.user);
    return data;
  };

  // ── Login ────────────────────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    const data = await authAPI.login({ email, password });

    saveToken(data.token);
    setUser(data.user);
    return data;
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    saveToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
