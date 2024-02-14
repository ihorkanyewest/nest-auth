import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { comparePasswords, generateCryptedPassword } from 'src/users/utils';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(props: Pick<User, 'email' | 'password'>) {
    const { email, password } = props;

    const users = await this.userService.find({ email });

    if (users.length) {
      throw new BadRequestException(`user with ${email} already exist`);
    }

    const cryptedPassword = await generateCryptedPassword(password);

    return this.userService.create({
      email,
      password: cryptedPassword,
      admin: false,
    });
  }

  async signin({ email, password }: Pick<User, 'email' | 'password'>) {
    const [user] = await this.userService.find({ email });

    if (!user) {
      throw new NotFoundException(`user with ${email} not found`);
    }

    const match = await comparePasswords(user.password, password);

    if (!match) {
      throw new BadRequestException(`Bad password`);
    }

    return user;
  }
}
