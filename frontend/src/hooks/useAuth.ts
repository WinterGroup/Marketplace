'use client'
import { useState, useEffect } from "react";
import { LoginRequest, LoginInterface } from "@/lib/auth-api";

export interface AuthInterface {
  access_token: string;
  refresh_token: string;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthInterface | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    if (access_token && refresh_token) {
      setAuth({ access_token, refresh_token });
    }
  }, []);

  const login = async (data: LoginInterface) => {
    try {
      setLoading(true);
      setError(null);
      const response = await LoginRequest(data);
      if (response.access_token && response.refresh_token) {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        setAuth({
          access_token: response.access_token,
          refresh_token: response.refresh_token
        });
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

  return { auth, error, loading, login };
}
