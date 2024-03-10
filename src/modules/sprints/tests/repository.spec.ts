import { Kysely } from 'kysely';
import createTestDatabase from '@/modules/common/tests/createTestDatabase';
import { sprintsRepository } from '@/modules/sprints/repository';
import { createSprintsFactory } from './sprintsHelpers';
import { DB } from '@/database/types';

describe('Sprints Repository', () => {
  let db: Kysely<DB>;
  let repository: ReturnType<typeof sprintsRepository>;
  let sprintsFactory: ReturnType<typeof createSprintsFactory>;

  beforeAll(async () => {
    db = await createTestDatabase();
    repository = sprintsRepository(db);
    sprintsFactory = createSprintsFactory(db);
  });

  beforeEach(async () => {
    await db.deleteFrom('sprints').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should create and retrieve sprints', async () => {
    const newSprint = await sprintsFactory.create({
      course: 'WD',
      module: 3,
      sprint: 4,
      code: 'WD-3.4',
      title: 'Test Sprint 4',
    });
    const newSprint2 = await sprintsFactory.create({
      course: 'WD',
      module: 2,
      sprint: 4,
      code: 'WD-2.4',
      title: 'Test Sprint 2',
    });

    const sprints = await repository.findAll();

    expect(sprints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sprint: newSprint.sprint,
          code: newSprint.code,
        }),
        expect.objectContaining({
          sprint: newSprint2.sprint,
          code: newSprint2.code,
        }),
      ])
    );
  });

  it('findById should retrieve a specific sprint', async () => {
    const sprint = await sprintsFactory.create({
      course: 'WD',
      module: 1,
      sprint: 1,
      code: 'WD-1.1',
      title: 'Test Sprint 1',
    });

    const foundSprint = await repository.findById(sprint.id);

    expect(foundSprint).toMatchObject({
      id: sprint.id,
      sprint: sprint.sprint,
      code: sprint.code,
    });
  });

  it('update should modify an existing sprint', async () => {
    const sprint = await sprintsFactory.create({
      course: 'WD',
      module: 1,
      sprint: 1,
      code: 'WD-1.1',
      title: 'Test Sprint 1',
    });
    const updatedSprintData = { title: 'Updated Sprint 1' };
    const updatedSprint = await repository.update(sprint.id, updatedSprintData);

    expect(updatedSprint).toMatchObject({
      ...updatedSprintData,
      id: sprint.id,
    });
  });

  it('remove should delete a sprint', async () => {
    const sprint = await sprintsFactory.create({
      course: 'WD',
      module: 2,
      sprint: 4,
      code: 'WD-2.4',
      title: 'Test Sprint 1',
    });

    await repository.remove(sprint.id);
    const dbSprint = await repository.findById(sprint.id);

    expect(dbSprint).toBeUndefined();
  });
});
