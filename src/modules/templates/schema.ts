import { z } from 'zod';
import { Templates } from '@/database/types';

type Record = Templates;

/**
 * Zod schema for validating template objects.
 */
export const templatesSchema = z.object({
  id: z.coerce.number().int().positive(),
  template: z.string().min(5).max(100),
  isActive: z.string().regex(/^[01]$/),
});

/**
 * Schema for template data that can be inserted into the database.
 * Omits `id` field as it is handled automatically.
 */
export const insertable = templatesSchema.omit({ id: true });
export type InsertableTemplateData = z.infer<typeof insertable>;

/**
 * Schema for template data that can be updated. Allows partial updates.
 */
export const updateable = insertable.partial();
export type UpdateableTemplateData = z.infer<typeof updateable>;

export const parse = (record: unknown) => templatesSchema.parse(record);
export const parseId = (id: unknown) => templatesSchema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  templatesSchema.shape
) as (keyof z.infer<typeof templatesSchema>)[];
