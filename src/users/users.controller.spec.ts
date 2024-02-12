import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/users/auth.service';
import { User } from 'src/users/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      async findOne(id: number): Promise<User | null> {
        return Promise.resolve({ id, email: '', password: '' });
      },
      async find({ email }): Promise<User[]> {
        return Promise.resolve([{ id: 0, email, password: '' }]);
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

  it('find all users return a list of users', async () => {
    const email = 'test@test.test';

    const users = await controller.findUsers(email);

    expect(users.length).toEqual(1);

    expect(users[0].email).toEqual(email);
  });

  it('find user return single user with given id', async () => {
    const id = '0';

    const users = await controller.findUser(id);

    expect(users).toBeDefined();
  });

  it('throws an error if user not found ', async () => {
    const id = '0';

    fakeUserService.findOne = () =>
      Promise.reject(new NotFoundException('user not found'));

    await expect(controller.findUser(id)).rejects.toThrow(NotFoundException);
  });
});
