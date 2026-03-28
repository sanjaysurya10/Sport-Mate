"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MOCK_USER_PLAYER, MOCK_USER_OWNER } from "./mockData";

type User = {
  id: string;
  name: string;
  role: string;
  email?: string;
  city?: string;
  turfCoins?: number;
};

type AuthContextType = {
  user: User | null;
  role: string | null;
  login: (role: "player" | "owner" | "admin") => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("sm_mock_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (role: "player" | "owner" | "admin") => {
    let mockUser: User;
    if (role === "player") mockUser = MOCK_USER_PLAYER;
    else if (role === "owner") mockUser = MOCK_USER_OWNER;
    else mockUser = { id: "u0", name: "Admin", role: "admin" };

    setUser(mockUser);
    localStorage.setItem("sm_mock_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sm_mock_user");
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
