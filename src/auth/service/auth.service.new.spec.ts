import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

describe('AuthService test suite', () => {
  let victim: AuthService;
  let mockUserService: Partial<UserService>;
  const USER = { id: 1, email: 'dummy_email', password: 'dummyPass' };

  beforeEach(async () => {
    mockUserService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
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
    //given
    mockUserService.findByEmail = jest.fn().mockResolvedValue([]);
    mockUserService.create = jest.fn().mockResolvedValue(USER);
    //when
    const user = await victim.signup(USER.email, USER.password);
    //then
    expect(mockUserService.findByEmail).toHaveBeenNthCalledWith(1, USER.email);
    expect(mockUserService.create).toHaveBeenNthCalledWith(
      1,
      USER.email,
      expect.stringContaining('.'),
    );
    expect(user).toEqual(USER);
  });

  it('should throw an error if user signup with email that is already used', async () => {
    mockUserService.findByEmail = jest.fn().mockResolvedValue([USER]);

    await expect(victim.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      'Email already exist',
    );
    await expect(victim.signup('asdf@asdf.com', 'asdf')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should throw an error if user sign in in with non existing email', async () => {
    mockUserService.findByEmail = jest.fn().mockResolvedValue([]);

    await expect(victim.signin('asdf@asdf.com', 'asdf')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should throw an error if invalid password is provided', async () => {
    mockUserService.findByEmail = jest.fn().mockResolvedValue([USER]);

    await expect(
      victim.signin('asdf@asdf.com', 'invalid-pass'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should return an user if correct password is provided', async () => {
    mockUserService.findByEmail = jest.fn().mockResolvedValue([USER]);

    const user = await expect(victim.signin('demo@gmail.com', USER.password));
    expect(user).toBeDefined();
  });
});
