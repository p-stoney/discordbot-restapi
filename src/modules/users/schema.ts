import { z } from 'zod';
import { Users } from '@/database/types';

type Record = Users;

/**
 * Zod schema for validating user objects.
 */
export const usersSchema = z.object({
  id: z.coerce.number().int().positive(),
  username: z.string().min(5).max(20),
  discordId: z.string().length(18),
});

/**
 * Schema for user data that can be inserted into the database.
 * Omits `id` field as it is handled automatically.
 */
export const insertable = usersSchema.omit({ id: true });
export type InsertableUserData = z.infer<typeof insertable>;

/**
 * Schema for user data that can be updated. Allows partial updates.
 */
export const updateable = insertable.partial();
export type UpdateableUserData = z.infer<typeof updateable>;

export const parse = (record: unknown) => usersSchema.parse(record);
export const parseId = (id: unknown) => usersSchema.shape.id.parse(id);
export const parseUsername = (username: unknown) =>
  usersSchema.shape.username.parse(username);
export const parsediscordId = (discordId: string) =>
  usersSchema.shape.discordId.parse(discordId);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  usersSchema.shape
) as (keyof z.infer<typeof usersSchema>)[];
