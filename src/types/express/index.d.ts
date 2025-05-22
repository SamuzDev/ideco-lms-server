import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}

export type SafeUser = Partial<User> & Pick<User, 'id' | 'email' | 'name'>;
