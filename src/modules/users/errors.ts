import NotFound from '@/modules/common/utils/errors/NotFound';

export class UserNotFound extends NotFound {
  constructor(user = 'User not found') {
    super(user);
  }
}
