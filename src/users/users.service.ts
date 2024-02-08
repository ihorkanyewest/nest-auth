import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindUserParams } from 'src/users/types';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(props: Omit<User, 'id'>) {
    const user = this.repo.create(props);

    return this.repo.save(user);
  }

  async findOne(id: number) {
    const user = this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async find(params: FindUserParams) {
    return this.repo.findBy(params);
  }

  async update(id, params: Partial<User>) {
    const user = await this.findOne(id);

    Object.assign(user, params);

    return this.repo.update(id, user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return this.repo.remove(user);
  }
}
