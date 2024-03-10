import { z } from 'zod';
import { Messages } from '@/database/types';

type Record = Messages;

/**
 * Zod schema for validating message objects.
 */
export const messagesSchema = z.object({
  id: z.coerce.number().int().positive(),
  userId: z.number().int().positive(),
  sprintId: z.number().int().positive(),
  timestamp: z.string().optional(),
  status: z.number().int().min(100).max(599),
  gifUrl: z.string().url(),
  message: z.string().min(1).max(500),
});

/**
 * Schema for message data that can be inserted into the database.
 * Omits `id` and `timestamp` fields as they are handled automatically.
 */
export const insertable = messagesSchema.omit({ id: true, timestamp: true });
export type InsertableMessageData = z.infer<typeof insertable>;

/**
 * Schema for message data that can be updated. Allows partial updates.
 */
export const updateable = insertable.partial();
export type UpdateableMessageData = z.infer<typeof updateable>;

export const parse = (record: unknown) => messagesSchema.parse(record);
export const parseId = (id: unknown) => messagesSchema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  messagesSchema.shape
) as (keyof z.infer<typeof messagesSchema>)[];
