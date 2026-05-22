import { eq, and, desc, count, gte } from 'drizzle-orm';
import { drizzleDb } from './db/client';
import { users, charts, payments } from './db/schema';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

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

export const db = {
  users: {
    async findByPhone(phone: string): Promise<User | null> {
      const rows = await drizzleDb.select().from(users).where(eq(users.phone, phone)).limit(1);
      return rows[0] || null;
    },
    async findById(id: string): Promise<User | null> {
      const rows = await drizzleDb.select().from(users).where(eq(users.id, id)).limit(1);
      return rows[0] || null;
    },
    async create(phone: string, name?: string): Promise<User> {
      const now = new Date().toISOString();
      const rows = await drizzleDb.insert(users).values({
        id: uid(),
        phone,
        name: name || '',
        avatar: '',
        createdAt: now,
        updatedAt: now,
        membershipTier: 'free',
        expiresAt: null,
      }).returning();
      return rows[0];
    },
    async update(id: string, fields: Partial<User>): Promise<User | null> {
      const rows = await drizzleDb.update(users)
        .set({ ...fields, updatedAt: new Date().toISOString() })
        .where(eq(users.id, id))
        .returning();
      return rows[0] || null;
    },
  },

  charts: {
    async create(userId: string, birthInfo: any, chart: any): Promise<ChartRecord> {
      const rows = await drizzleDb.insert(charts).values({
        id: uid(),
        userId,
        birthInfo: JSON.stringify(birthInfo),
        chart: JSON.stringify(chart),
        createdAt: new Date().toISOString(),
      }).returning();
      return rows[0];
    },
    async findByUser(userId: string): Promise<ChartRecord[]> {
      return drizzleDb.select().from(charts)
        .where(eq(charts.userId, userId))
        .orderBy(desc(charts.createdAt))
        .limit(20);
    },
    async delete(id: string, userId: string) {
      await drizzleDb.delete(charts)
        .where(and(eq(charts.id, id), eq(charts.userId, userId)));
    },
    async countSince(userId: string, since: Date): Promise<number> {
      const rows = await drizzleDb.select({ value: count() }).from(charts)
        .where(and(eq(charts.userId, userId), gte(charts.createdAt, since.toISOString())));
      return rows[0]?.value ?? 0;
    },
  },

  payments: {
    async create(userId: string, amount: number, tier: string): Promise<PaymentRecord> {
      const now = new Date().toISOString();
      const rows = await drizzleDb.insert(payments).values({
        id: uid(),
        userId,
        amount,
        tier,
        status: 'paid',
        paidAt: now,
        createdAt: now,
      }).returning();
      return rows[0];
    },
  },
};
