import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '../model/user.entity';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

describe('AuthService', () => {
  let victim: AuthService;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    const users: User[] = [];
    mockUserService = {
      findByEmail: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.random() * 99999, email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    victim = module.get(AuthService);
  });

  it('should create an instance of auth service', async () => {
    expect(victim).toBeDefined();
  });

  it('should  create an user with salted and hashed password', async () => {
    const user = await victim.signup('adsd@gmail.com', 'dummy_password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw an error if user signup with email that is already used', async () => {
    mockUserService.findByEmail = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    await expect(victim.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      'Email already exist',
    );
    await expect(victim.signup('asdf@asdf.com', 'asdf')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should throw an error if user sign in in with non existing email', async () => {
    await expect(victim.signin('asdf@asdf.com', 'asdf')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should throw an error if invalid password is provided', async () => {
    mockUserService.findByEmail = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    await expect(victim.signin('asdf@asdf.com', 'asdf')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should return an user if correct password is provided', async () => {
    await victim.signup('demo@gmail.com', 'mypass');
    const user = await expect(victim.signin('demo@gmail.com', 'mypass'));
    expect(user).toBeDefined();
  });
});
