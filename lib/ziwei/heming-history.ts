'use client';
import { useEffect, useState, useCallback } from 'react';
import type { BirthFormState } from '@/components/BirthForm';

const STORAGE_KEY = 'heming_history';
const MAX_ENTRIES = 10;

export interface HemmingEntry {
  id: string;
  label: string;
  formA: BirthFormState;
  formB: BirthFormState;
  savedAt: number;
}

function getToken(): string | null {
  try { return localStorage.getItem('token'); } catch { return null; }
}

export function useHemmingHistory() {
  const [history, setHistory] = useState<HemmingEntry[]>([]);

  useEffect(() => {
    const t = getToken();
    if (t) {
      fetch('/api/user/form-history?type=heming', {
        headers: { Authorization: `Bearer ${t}` },
      }).then(r => r.ok ? r.json() : []).then(data => {
        if (data.length > 0) {
          setHistory(data.map((d: any) => ({
            id: d.id,
            label: d.label,
            formA: d.formData.formA,
            formB: d.formData.formB,
            savedAt: new Date(d.createdAt).getTime(),
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

  const save = useCallback((formA: BirthFormState, formB: BirthFormState) => {
    const labelA = [formA.name || `A`, `${formA.year}年${formA.month}月${formA.day}日`, formA.gender === 'male' ? '男' : '女'].filter(Boolean).join(' ');
    const labelB = [formB.name || `B`, `${formB.year}年${formB.month}月${formB.day}日`, formB.gender === 'male' ? '男' : '女'].filter(Boolean).join(' ');
    const label = `${labelA} × ${labelB}`;

    const t = getToken();
    if (t) {
      fetch('/api/user/form-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({ type: 'heming', label, formData: { formA, formB } }),
      }).then(r => {
        if (r.ok) r.json().then(({ id, createdAt }) => {
          setHistory(prev => [{ id, label, formA, formB, savedAt: new Date(createdAt).getTime() }, ...prev].slice(0, MAX_ENTRIES));
        });
      });
      return;
    }

    const id = Date.now().toString();
    const entry: HemmingEntry = { id, label, formA, formB, savedAt: Date.now() };
    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, MAX_ENTRIES);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const remove = useCallback((id: string) => {
    const t = getToken();
    if (t) {
      fetch('/api/user/form-history', {
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

  return { history, save, remove };
}
