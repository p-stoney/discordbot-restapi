import { Kysely } from 'kysely';
import supertest from 'supertest';
import createApp from '@/app';
import { createTestDatabase } from '@/modules/common/tests/createTestDatabase';
import { DB } from '@/database/types';
import { TemplateService } from '../templateService';
import { templatesRepository } from '../repository';
import { templateMatcher } from '@/modules/templates/tests/templatesHelpers';

describe('Templates Controller', () => {
  let db: Kysely<DB>;
  let request: supertest.SuperTest<supertest.Test>;
  let repository: ReturnType<typeof templatesRepository>;
  let templateService: TemplateService;

  beforeAll(async () => {
    db = await createTestDatabase();
    const app = createApp(db);
    request = supertest(app);
    repository = templatesRepository(db);
    templateService = new TemplateService(db);
  });

  beforeEach(async () => {
    await db.deleteFrom('templates').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('GET /templates should return a list of templates', async () => {
    await templateService.createTemplate({
      template: 'testtemplate',
      isActive: '1',
    });
    await templateService.createTemplate({
      template: 'testtemplate2',
      isActive: '1',
    });

    const response = await request.get('/templates').expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ template: 'testtemplate', isActive: '1' }),
        expect.objectContaining({ template: 'testtemplate2', isActive: '1' }),
      ])
    );
  });

  it('GET /templates/:id should return a specific template', async () => {
    const newTemplate = await templateService.createTemplate({
      template: 'testtemplate',
      isActive: '1',
    });

    const response = await request
      .get(`/templates/${newTemplate.id}`)
      .expect(200);

    expect(response.body).toMatchObject(templateMatcher());
  });

  it('POST /templates should create a new template', async () => {
    const newTemplateData = { template: 'testtemplate', isActive: '1' };

    const response = await request
      .post('/templates')
      .send(newTemplateData)
      .expect(201);

    expect(response.body).toMatchObject(templateMatcher(newTemplateData));
  });

  it('PATCH /templates/:id should update a specific template', async () => {
    const template = await templateService.createTemplate({
      template: 'testtemplate',
      isActive: '1',
    });
    const updatedTemplateData = { template: 'updatedtemplate' };

    await request
      .patch(`/templates/${template.id}`)
      .send(updatedTemplateData)
      .expect(204);
    const dbTemplate = await repository.findById(template.id);

    expect(dbTemplate).toMatchObject(updatedTemplateData);
  });

  it('DELETE /templates/:id should delete a template', async () => {
    const template = await templateService.createTemplate({
      template: 'testtemplate',
      isActive: '1',
    });

    await request.delete(`/templates/${template.id}`).expect(204);
    const dbTemplate = await repository.findById(template.id);

    expect(dbTemplate).toBeUndefined();
  });
});
