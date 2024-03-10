import { z } from 'zod';
import { Sprints } from '@/database/types';

type Record = Sprints;

/**
 * Zod schema for validating sprint objects.
 */
export const sprintsSchema = z.object({
  id: z.coerce.number().int().positive(),
  course: z.string().length(2),
  module: z.number().int().positive(),
  sprint: z.number().int().positive(),
  code: z.string(),
  title: z.string().min(1).max(100),
});

/**
 * Schema for sprint data that can be inserted into the database.
 * Omits `id` field as it is handled automatically.
 */
export const insertable = sprintsSchema.omit({ id: true });
export type InsertableSprintData = z.infer<typeof insertable>;

/**
 * Schema for sprint data that can be updated. Allows partial updates.
 */
export const updateable = insertable.partial();
export type UpdateableSprintData = z.infer<typeof updateable>;

export const parse = (record: unknown) => sprintsSchema.parse(record);
export const parseId = (id: unknown) => sprintsSchema.shape.id.parse(id);
export const parseCode = (code: unknown) =>
  sprintsSchema.shape.code.parse(code);
export const parseCourse = (course: unknown) =>
  sprintsSchema.shape.course.parse(course);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  sprintsSchema.shape
) as (keyof z.infer<typeof sprintsSchema>)[];
