import { User } from 'src/users/user.entity';

export type FindUserParams = Partial<Pick<User, 'email'>>;

export type UserSession = {
  userId?: number;
};
