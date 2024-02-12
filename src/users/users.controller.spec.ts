import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/users/auth.service';
import { User } from 'src/users/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      async findOne(id: number): Promise<User | null> {
        return Promise.resolve({ id, email: '', password: '' });
      },
      async find(): Promise<User[]> {
        return Promise.resolve([]);
      },
    };

    fakeAuthService = {
      async signup(props: Pick<User, 'email' | 'password'>): Promise<User> {
        return Promise.resolve({ id: 0, ...props });
      },
      async signin({
        email,
        password,
      }: Pick<User, 'email' | 'password'>): Promise<User> {
        return Promise.resolve({ id: 0, email, password });
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
