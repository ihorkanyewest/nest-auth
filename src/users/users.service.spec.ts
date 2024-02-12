import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';

describe('UsersService', () => {
  let service: UsersService;

  const fakeService = {
    find: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersService, useValue: fakeService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
