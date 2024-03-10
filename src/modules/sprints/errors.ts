import NotFound from '@/modules/common/utils/errors/NotFound';

export class SprintNotFound extends NotFound {
  constructor(sprint = 'Sprint not found') {
    super(sprint);
  }
}
