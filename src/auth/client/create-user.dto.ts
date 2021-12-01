/* istanbul ignore file */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'ddd@gmail.com', description: 'A valid email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'deMoPassWord18976!hj',
    description: 'A valid password',
  })
  @IsString()
  password: string;
}
