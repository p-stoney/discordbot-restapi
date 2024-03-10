import { Kysely } from 'kysely';
import { createTestDatabase } from '@/modules/common/tests/createTestDatabase';
import { createTemplatesFactory } from './templatesHelpers';
import {
  parse,
  parseInsertable,
  parseUpdateable,
} from '@/modules/templates/schema';
import { DB } from '@/database/types';

describe('templatesSchema validation', () => {
  let db: Kysely<DB>;
  let templatesFactory: ReturnType<typeof createTemplatesFactory>;

  beforeAll(async () => {
    db = await createTestDatabase();
    templatesFactory = createTemplatesFactory(db);
  });

  beforeEach(async () => {
    await db.deleteFrom('templates').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('parses a valid templates object with all fields', async () => {
    const template = await templatesFactory.create();

    expect(parse(template)).toEqual(template);
  });

  it('throws an error for missing required fields', async () => {
    const templatesWithMissingFields = {
      template: 'Test',
    };

    expect(() => parse(templatesWithMissingFields)).toThrow(/isActive/i);
  });

  it('allows creating a template without id', () => {
    const templateData = {
      template: 'testmessage',
      isActive: '1',
    };

    expect(() => parseInsertable(templateData)).not.toThrow();
  });

  it('allows updating a template with partial fields', () => {
    const partialUpdateData = {
      is_active: '0',
    };

    expect(() => parseUpdateable(partialUpdateData)).not.toThrow();
  });
});
