import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

interface User {
  id: string;
  phone: string;
  name: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  membershipTier: string;
  expiresAt: string | null;
}

interface ChartRecord {
  id: string;
  userId: string;
  birthInfo: string;
  chart: string;
  createdAt: string;
}

interface PaymentRecord {
  id: string;
  userId: string;
  amount: number;
  tier: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

interface DbData {
  users: Record<string, User>;
  charts: ChartRecord[];
  payments: PaymentRecord[];
  nextId: number;
}

let data: DbData;

function load(): DbData {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const initial: DbData = { users: {}, charts: [], payments: [], nextId: 1 };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
      return initial;
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return { users: {}, charts: [], payments: [], nextId: 1 };
  }
}

function save() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

data = load();

export const db = {
  users: {
    findByPhone(phone: string): User | null {
      return Object.values(data.users).find(u => u.phone === phone) || null;
    },
    findById(id: string): User | null {
      return data.users[id] || null;
    },
    create(phone: string, name?: string): User {
      const now = new Date().toISOString();
      const user: User = {
        id: uid(),
        phone,
        name: name || '',
        avatar: '',
        createdAt: now,
        updatedAt: now,
        membershipTier: 'free',
        expiresAt: null,
      };
      data.users[user.id] = user;
      save();
      return user;
    },
    update(id: string, fields: Partial<User>): User | null {
      const user = data.users[id];
      if (!user) return null;
      Object.assign(user, fields, { updatedAt: new Date().toISOString() });
      save();
      return user;
    },
  },

  charts: {
    create(userId: string, birthInfo: any, chart: any): ChartRecord {
      const record: ChartRecord = {
        id: uid(),
        userId,
        birthInfo: JSON.stringify(birthInfo),
        chart: JSON.stringify(chart),
        createdAt: new Date().toISOString(),
      };
      data.charts.push(record);
      save();
      return record;
    },
    findByUser(userId: string): ChartRecord[] {
      return data.charts
        .filter(c => c.userId === userId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 20);
    },
    delete(id: string, userId: string) {
      data.charts = data.charts.filter(c => !(c.id === id && c.userId === userId));
      save();
    },
    countSince(userId: string, since: Date): number {
      return data.charts.filter(c => c.userId === userId && new Date(c.createdAt) >= since).length;
    },
  },

  payments: {
    create(userId: string, amount: number, tier: string): PaymentRecord {
      const now = new Date().toISOString();
      const record: PaymentRecord = {
        id: uid(),
        userId,
        amount,
        tier,
        status: 'paid',
        paidAt: now,
        createdAt: now,
      };
      data.payments.push(record);
      save();
      return record;
    },
  },
};
