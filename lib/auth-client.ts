'use client';
import { useState, useEffect, useCallback } from 'react';

interface UserInfo {
  id: string;
  phone: string;
  name: string;
  avatar: string;
  membershipTier: string;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) { setUser(null); return; }
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.ok ? r.json() : null).then(u => {
      if (u) setUser(u);
      else { localStorage.removeItem('token'); setToken(null); }
    }).catch(() => {});
  }, [token]);

  const login = useCallback((phone: string, name?: string) => {
    return fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, name: name || '' }),
    }).then(async r => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  return { token, user, isLoggedIn: !!token, login, logout };
}
