'use client'

import { useState, useEffect } from "react";
import { LoginRequest, LoginInterface, MeRequest, LogoutRequest } from "@/lib/auth-api";

export interface AuthInterface {
  username: string;
  email: string;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // при загрузке проверяем, есть ли активная сессия (кука)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const user = await MeRequest();
        setAuth(user);
      } catch {
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (data: LoginInterface) => {
    try {
      setLoading(true);
      setError(null);
      const success = await LoginRequest(data);
      if (success) {
        // после логина кука установится, подтянем юзера
        const user = await MeRequest();
        setAuth(user);
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await LogoutRequest();
      setAuth(null);
    } finally {
      setLoading(false);
    }
  };

  return { auth, error, loading, login, logout };
}
