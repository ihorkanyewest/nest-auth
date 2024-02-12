import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeService = {
      find: ({ email }) => {
        return Promise.resolve(users.filter((user) => user.email === email));
      },
      create: ({ email, password }) => {
        const user: User = { id: 0, email, password };

        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create new user with crypted password', async () => {
    const email = 'test@test.test';

    const password = 'test';

    const user = await service.signup({
      email,
      password,
    });

    expect(user.password).not.toEqual(password);

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();

    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    const email = 'test@test.test';

    const password = 'test';

    fakeService.find = () => Promise.resolve([{ id: 1, email, password }]);

    await expect(service.signup({ email, password })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if user signs in with email that is unused', async () => {
    const email = 'test@test.test';

    const password = 'test';

    await expect(service.signin({ email, password })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws an error if invalid password provided', async () => {
    const email = 'test@test.test';

    const password = 'test';

    fakeService.find = () =>
      Promise.resolve([{ id: 1, email, password: 'password' }]);

    await expect(service.signin({ email, password })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('return a user if credentials correct', async () => {
    const email = 'test@test.test';

    const password = 'test';

    await service.signup({ email, password });

    const user = await service.signin({ email, password });

    expect(user).toBeDefined();
  });
});
