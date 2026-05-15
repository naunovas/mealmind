import { createContext, useContext, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const getRole = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.role;
    } catch {
      return null;
    }
  };

  const login = (userData, accessToken) => {
    setToken(accessToken);
    localStorage.setItem('token', accessToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, role: getRole() }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}