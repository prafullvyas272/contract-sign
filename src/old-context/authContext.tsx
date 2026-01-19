"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  isLoggedIn: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: any }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<any>(false);

  useEffect(() => {
    const hasTokenStored = localStorage.getItem("token");
    if (hasTokenStored) {
      setIsLoggedIn(true);
    }
  }, []);

  const login: any = (data: any) => {
    setIsLoggedIn(true);
    localStorage.setItem("token", data);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  return (
    <SessionProvider>
      <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
