import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const savedId = localStorage.getItem("user_id");
    if (savedId) {
      setIsLoggedIn(true);
      setUserId(savedId);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
