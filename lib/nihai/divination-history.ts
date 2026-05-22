'use client';
import { useEffect, useState, useCallback } from 'react';
import type { DivinationMethod, DivinationResult } from './types';

const STORAGE_KEY = 'divination_history';
const MAX_ENTRIES = 20;

export interface DivinationHistoryEntry {
  id: string;
  method: DivinationMethod;
  question: string;
  result: DivinationResult;
  aiText: string;
  label: string;
  savedAt: number;
}

function getToken(): string | null {
  try { return localStorage.getItem('token'); } catch { return null; }
}

export function useDivinationHistory() {
  const [history, setHistory] = useState<DivinationHistoryEntry[]>([]);

  useEffect(() => {
    const t = getToken();
    if (t) {
      fetch('/api/user/divination', {
        headers: { Authorization: `Bearer ${t}` },
      }).then(r => r.ok ? r.json() : []).then(data => {
        if (data.length > 0) {
          setHistory(data.map((d: any) => ({
            id: d.id,
            method: d.method,
            question: d.question,
            result: d.result,
            aiText: d.aiText,
            label: d.label,
            savedAt: new Date(d.savedAt).getTime(),
          })));
        } else {
          loadLocal();
        }
      }).catch(() => loadLocal());
    } else {
      loadLocal();
    }
  }, []);

  function loadLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }

  const save = useCallback((entry: Omit<DivinationHistoryEntry, 'id' | 'savedAt'>): string => {
    const t = getToken();
    if (t) {
      const id = Date.now().toString();
      const savedAt = Date.now();
      fetch('/api/user/divination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({ ...entry, id, savedAt }),
      });
      const newEntry: DivinationHistoryEntry = { id, ...entry, savedAt };
      setHistory(prev => [newEntry, ...prev].slice(0, MAX_ENTRIES));
      return id;
    }

    const id = Date.now().toString();
    const newEntry: DivinationHistoryEntry = { id, ...entry, savedAt: Date.now() };
    setHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
    return id;
  }, []);

  const updateAI = useCallback((id: string, aiText: string) => {
    const t = getToken();
    if (t) {
      fetch('/api/user/divination', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({ id, aiText }),
      });
    }
    setHistory(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, aiText } : e);
      if (!t) try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const remove = useCallback((id: string) => {
    const t = getToken();
    if (t) {
      fetch('/api/user/divination', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({ id }),
      });
    }
    setHistory(prev => {
      const updated = prev.filter(e => e.id !== id);
      if (!t) try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const clear = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return { history, save, updateAI, remove, clear };
}
