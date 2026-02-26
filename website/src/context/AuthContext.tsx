/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../server/API";

interface AuthContextType {
  user: UserProps | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await API.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });

        const userRes = response.data.data;
        setUser(userRes);
      } catch (error) {
        if (error) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}