import NotFound from '@/modules/common/utils/errors/NotFound';

export class TemplateNotFound extends NotFound {
  constructor(template = 'Template not found') {
    super(template);
  }
}
