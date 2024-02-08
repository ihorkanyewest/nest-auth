import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';
import { AuthService } from 'src/users/auth.service';
import { UserSession } from 'src/users/types';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { CurrentUserInterceptor } from 'src/users/interceptors/current-user.interceptor';

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: UserSession,
  ) {
    const user = await this.authService.signup(body);

    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  async signinUser(
    @Body() body: CreateUserDto,
    @Session() session: UserSession,
  ) {
    const user = await this.authService.signin(body);

    session.userId = user.id;

    return user;
  }

  @Post('/signout')
  async signinOut(@Session() session: UserSession) {
    session.userId = null;
  }

  @Get('/current_user')
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Get('')
  findUsers(@Query('email') email: string) {
    return this.userService.find({ email });
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
