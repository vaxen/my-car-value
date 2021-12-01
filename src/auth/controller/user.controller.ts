import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from '../../auth/service/user.service';
import { Serialize } from '../../interceptor/serialize.interceptor';
import { CreateUserDto } from '../client/create-user.dto';
import { UpdateUserDto } from '../client/update-user.dto';
import { UserDto } from '../client/user.dto';
import { CurrentUser } from '../decorator/current-user.decorator';
import { User } from '../model/user.entity';
import { AuthService } from '../service/auth.service';
import { AuthGuard } from '../../guard/auth.guard';

@Controller('auth')
@Serialize(UserDto)
//@UseInterceptors(CurrentUserInterceptor) moved to global interceptor
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  //########### TEST COOKIES
  @Get('/colors/:color')
  @ApiOperation({ summary: 'Add test cookie color' })
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  @ApiOperation({ summary: 'Read test cookie color' })
  getColor(@Session() session: any) {
    return session.color;
  }
  //######################

  /* @Get('/who-am-i')
  @ApiOperation({ summary: 'Get signed in user' })
  getUserFromCookies(@Session() session: User) {
    return this.userService.findOne(session.userId);
  } */

  @Get('/who-am-i')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get signed in user' })
  getUserFromCookies(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  @ApiOperation({ summary: 'Create user' })
  async createUser(
    @Body() createUserReq: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signup(
      createUserReq.email,
      createUserReq.password,
    );
    session.userId = user.id;
    return user;
  }

  @Post('/sign-in')
  @ApiOperation({ summary: 'Login' })
  async signin(@Body() createUserReq: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(
      createUserReq.email,
      createUserReq.password,
    );
    session.userId = user.id;
    return user;
  }

  @Post('sign-out')
  @ApiOperation({ summary: 'Logout' })
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get user by id' })
  findUser(@Param('id') id: string) {
    console.log('handler is running');

    return this.userService.findOne(parseInt(id));
  }

  @Get()
  @Get('/:id')
  @ApiOperation({ summary: 'Get users by email' })
  findByEmail(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete an user' })
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update an existing user' })
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
