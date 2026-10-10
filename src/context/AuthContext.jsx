import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const restore = useCallback(async () => {
    try {
      setUser(await api.auth.current());
    } catch (error) {
      if (error?.response?.status === 401) {
        try {
          await api.auth.refresh();
          setUser(await api.auth.current());
        } catch {
          setUser(null);
        }
      } else setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { restore(); }, [restore]);

  const login = async (credentials) => {
    const result = await api.auth.login(credentials);
    setUser(result?.user || (await api.auth.current()));
  };

  const logout = async () => {
    try { await api.auth.logout(); } finally { setUser(null); }
  };

  const value = useMemo(() => ({ user, loading, login, logout, restore, setUser }), [user, loading, restore]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
