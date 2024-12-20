import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    userType: localStorage.getItem('userType'),
  });

  const login = (token, userType) => {
    // Store token and userType in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    
    // Update auth state
    setAuth({ token, userType });
  };

  const logout = () => {
    // Clear localStorage and reset state
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setAuth({ token: null, userType: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
