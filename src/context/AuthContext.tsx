import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('proptrack_token');
    const storedUser = localStorage.getItem('proptrack_user');
    
    if (storedToken) {
      setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
      
      // Auto-validate session and fetch fresh profile
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.id) {
          setUser(data);
          localStorage.setItem('proptrack_user', JSON.stringify(data));
        } else {
          // Token invalid
          localStorage.removeItem('proptrack_token');
          localStorage.removeItem('proptrack_user');
          setToken(null);
          setUser(null);
        }
      })
      .catch(console.error);
    }
  }, []);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('proptrack_token', authToken);
    localStorage.setItem('proptrack_user', JSON.stringify(userData));
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('proptrack_token');
    localStorage.removeItem('proptrack_user');
    navigate('/auth');
  };

  const updateUser = (newData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...newData };
      setUser(updatedUser);
      localStorage.setItem('proptrack_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
