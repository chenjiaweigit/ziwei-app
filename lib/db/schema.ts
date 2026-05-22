import { pgTable, text, doublePrecision } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  phone: text('phone').notNull().unique(),
  name: text('name').default('').notNull(),
  avatar: text('avatar').default('').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  membershipTier: text('membership_tier').default('free').notNull(),
  expiresAt: text('expires_at'),
});

export const charts = pgTable('charts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  birthInfo: text('birth_info').notNull(),
  chart: text('chart').notNull(),
  createdAt: text('created_at').notNull(),
});

export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  amount: doublePrecision('amount').notNull(),
  tier: text('tier').notNull(),
  status: text('status').default('paid').notNull(),
  paidAt: text('paid_at'),
  createdAt: text('created_at').notNull(),
});

export const divinations = pgTable('divinations', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  method: text('method').notNull(),
  question: text('question').default('').notNull(),
  result: text('result').notNull(),
  aiText: text('ai_text').default('').notNull(),
  label: text('label').default('').notNull(),
  savedAt: text('saved_at').notNull(),
});

export const formHistory = pgTable('form_history', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  type: text('type').notNull(),
  label: text('label').notNull(),
  formData: text('form_data').notNull(),
  createdAt: text('created_at').notNull(),
});
