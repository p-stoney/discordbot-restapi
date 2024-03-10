import { Kysely } from 'kysely';
import supertest from 'supertest';
import createApp from '@/app';
import { createTestDatabase } from '@/modules/common/tests/createTestDatabase';
import { DB } from '@/database/types';
import { SprintService } from '@/modules/sprints/sprintService';
import { sprintsRepository } from '@/modules/sprints/repository';
import { sprintMatcher } from '@/modules/sprints/tests/sprintsHelpers';

describe('Sprints Controller', () => {
  let db: Kysely<DB>;
  let request: supertest.SuperTest<supertest.Test>;
  let repository: ReturnType<typeof sprintsRepository>;
  let sprintService: SprintService;

  beforeAll(async () => {
    db = await createTestDatabase();
    const app = createApp(db);
    request = supertest(app);
    repository = sprintsRepository(db);
    sprintService = new SprintService(db);
  });

  beforeEach(async () => {
    await db.deleteFrom('sprints').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('GET /sprints should return a list of sprints', async () => {
    await sprintService.createSprint({
      course: 'WD',
      module: 1,
      sprint: 1,
      code: 'WD-1.1',
      title: 'Test',
    });
    await sprintService.createSprint({
      course: 'WD',
      module: 1,
      sprint: 2,
      code: 'WD-1.2',
      title: 'Test',
    });

    const response = await request.get('/sprints').expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          course: 'WD',
          module: 1,
          sprint: 1,
          code: 'WD-1.1',
          title: 'Test',
        }),
        expect.objectContaining({
          course: 'WD',
          module: 1,
          sprint: 2,
          code: 'WD-1.2',
          title: 'Test',
        }),
      ])
    );
  });

  it('GET /sprints/:id should return a specific sprint', async () => {
    const newSprint = await sprintService.createSprint({
      course: 'WD',
      module: 1,
      sprint: 1,
      code: 'WD-1.1',
      title: 'Test',
    });

    const response = await request.get(`/sprints/${newSprint.id}`).expect(200);

    expect(response.body).toMatchObject(sprintMatcher());
  });

  it('POST /sprints should create a new sprint', async () => {
    const newSprintData = {
      course: 'WD',
      module: 1,
      sprint: 1,
      code: 'WD-1.1',
      title: 'Test',
    };

    const response = await request
      .post('/sprints')
      .send(newSprintData)
      .expect(201);

    expect(response.body).toMatchObject(sprintMatcher(newSprintData));
  });

  it('PATCH /sprints/:id should update a specific sprint', async () => {
    const sprint = await sprintService.createSprint({
      course: 'WD',
      module: 1,
      sprint: 1,
      code: 'WD-1.1',
      title: 'Test',
    });
    const updatedSprintData = { title: 'Updated Sprint' };

    await request
      .patch(`/sprints/${sprint.id}`)
      .send(updatedSprintData)
      .expect(204);
    const dbSprint = await repository.findById(sprint.id);

    expect(dbSprint).toMatchObject(updatedSprintData);
  });

  it('DELETE /sprints/:id should delete a sprint', async () => {
    const sprint = await sprintService.createSprint({
      course: 'WD',
      module: 1,
      sprint: 1,
      code: 'WD-1.1',
      title: 'Test',
    });

    await request.delete(`/sprints/${sprint.id}`).expect(204);
    const dbSprint = await repository.findById(sprint.id);

    expect(dbSprint).toBeUndefined();
  });
});
