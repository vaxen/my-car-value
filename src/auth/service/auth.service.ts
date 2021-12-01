import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from '../model/user.entity';
import { UserService } from './user.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signup(email: string, password: string) {
    //See if email exist
    const users = await this.userService.findByEmail(email);
    if (users.length) {
      throw new BadRequestException('Email already exist');
    }

    //Create new user and save it
    const hashedPass = await this.generateHashedPassword(password);
    const userCreated = await this.userService.create(email, hashedPass);
    //return the user
    return userCreated;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const [salt, hash] = user.password.split('.');
    const hashedPassword = await this.generateHashedPasswordWithSalt(
      password,
      salt,
    );
    if (hashedPassword != user.password) {
      throw new BadRequestException('Invalid Password!');
    }
    return user;
  }

  private async generateHashedPassword(password: string) {
    //Hash password
    //generate salt 16 chars
    const salt = randomBytes(8).toString('hex');

    //hash salt and password togheter
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //joined the hashed and salt
    const hashedPass = salt + '.' + hash.toString('hex');
    return hashedPass;
  }

  private async generateHashedPasswordWithSalt(password: string, salt: string) {
    //Hash password
    //hash salt and password togheter
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //joined the hashed and salt
    const hashedPass = salt + '.' + hash.toString('hex');
    return hashedPass;
  }
}
