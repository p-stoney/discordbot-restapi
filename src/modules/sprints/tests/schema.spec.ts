import { Kysely } from 'kysely';
import { createTestDatabase } from '@/modules/common/tests/createTestDatabase';
import { createSprintsFactory } from './sprintsHelpers';
import {
  parse,
  parseInsertable,
  parseUpdateable,
} from '@/modules/sprints/schema';
import { DB } from '@/database/types';

describe('sprintsSchema validation', () => {
  let db: Kysely<DB>;
  let sprintsFactory: ReturnType<typeof createSprintsFactory>;

  beforeAll(async () => {
    db = await createTestDatabase();
    sprintsFactory = createSprintsFactory(db);
  });

  beforeEach(async () => {
    await db.deleteFrom('sprints').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('parses a valid sprints object with all fields', async () => {
    const sprint = await sprintsFactory.create();

    expect(parse(sprint)).toEqual(sprint);
  });

  it('throws an error for missing required fields', async () => {
    const sprintsWithMissingFields = {
      course: 'WD',
      module: 1,
      sprint: 1,
    };

    expect(() => parse(sprintsWithMissingFields)).toThrow(/title/i);
  });

  it('allows creating a sprint without id', () => {
    const sprintData = {
      course: 'WD',
      module: 1,
      sprint: 1,
      code: 'WD-1.1',
      title: 'Test',
    };

    expect(() => parseInsertable(sprintData)).not.toThrow();
  });

  it('allows updating a sprint with partial fields', () => {
    const partialUpdateData = {
      title: 'Updated title',
    };

    expect(() => parseUpdateable(partialUpdateData)).not.toThrow();
  });
});
