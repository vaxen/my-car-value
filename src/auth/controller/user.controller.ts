import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from '../../auth/service/user.service';
import { Serialize } from '../../interceptor/serialize.interceptor';
import { CreateUserDto } from '../client/create-user.dto';
import { UpdateUserDto } from '../client/update-user.dto';
import { UserDto } from '../client/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Create user' })
  createUser(@Body() createUserReq: CreateUserDto) {
    this.userService.create(createUserReq.email, createUserReq.password);
  }

  //@UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  findUser(@Param('id') id: string) {
    console.log('handler is running');

    return this.userService.findOne(parseInt(id));
  }

  @Get()
  findByEmail(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
