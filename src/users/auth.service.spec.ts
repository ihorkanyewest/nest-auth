import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const fakeService: Partial<UsersService> = {
    find: () => Promise.resolve([]),
    create: ({ email, password }) =>
      Promise.resolve({ id: 0, email, password }),
  };

  beforeEach(async () => {
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
    const email = 'test';

    const password = 'test';

    fakeService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' }]);
    await expect(service.signup({ email, password })).rejects.toThrow(
      BadRequestException,
    );
  });
});
