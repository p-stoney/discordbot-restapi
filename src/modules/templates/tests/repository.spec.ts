import { Kysely } from 'kysely';
import createTestDatabase from '@/modules/common/tests/createTestDatabase';
import { templatesRepository } from '@/modules/templates/repository';
import { createTemplatesFactory } from './templatesHelpers';
import { DB } from '@/database/types';

describe('Templates Repository', () => {
  let db: Kysely<DB>;
  let repository: ReturnType<typeof templatesRepository>;
  let templatesFactory: ReturnType<typeof createTemplatesFactory>;

  beforeAll(async () => {
    db = await createTestDatabase();
    repository = templatesRepository(db);
    templatesFactory = createTemplatesFactory(db);
  });

  beforeEach(async () => {
    await db.deleteFrom('templates').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should create and retrieve templates', async () => {
    const template1 = await templatesFactory.create({
      template: 'testtemplate',
      isActive: '1',
    });
    const template2 = await templatesFactory.create({
      template: 'testtemplate2',
      isActive: '1',
    });

    const templates = await repository.findAll();

    expect(templates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ template: template1.template }),
        expect.objectContaining({ template: template2.template }),
      ])
    );
  });

  it('findById should retrieve a specific template', async () => {
    const template = await templatesFactory.create({
      template: 'testtemplate',
      isActive: '1',
    });

    const foundTemplate = await repository.findById(template.id);

    expect(foundTemplate).toMatchObject({
      id: template.id,
      template: template.template,
      isActive: template.isActive,
    });
  });

  it('update should modify an existing template', async () => {
    const template = await templatesFactory.create({
      template: 'testtemplate',
      isActive: '1',
    });
    const updatedTemplateData = { template: 'updatedtemplate' };
    const updatedTemplate = await repository.update(
      template.id,
      updatedTemplateData
    );

    expect(updatedTemplate).toMatchObject({
      ...updatedTemplateData,
      id: template.id,
    });
  });

  it('remove should delete a template', async () => {
    const template = await templatesFactory.create({
      template: 'testtemplate',
      isActive: '1',
    });

    await repository.remove(template.id);
    const dbTemplate = await repository.findById(template.id);

    expect(dbTemplate).toBeUndefined();
  });
});
