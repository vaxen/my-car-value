import { Test } from '@nestjs/testing';
import { CreateUserDto } from '../client/create-user.dto';
import { User } from '../model/user.entity';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';
import { UserController } from './user.controller';

const ID = '1';
describe('UserController test suite', () => {
  let victim: UserController;
  let mockUserService: Partial<UserService>;
  let mockAuthService: Partial<AuthService>;
  const VALID_EMAIL = 'valid_email';
  const VALID_PASSWORD = 'valid_pass';
  const USER = { id: 2, email: VALID_EMAIL, password: VALID_PASSWORD } as User;

  beforeEach(async () => {
    mockAuthService = {
      signin: jest.fn(),
      signup: jest.fn(),
    };

    mockUserService = {
      findOne: jest.fn(),
      findByEmail: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    victim = moduleRef.get(UserController);
  });

  it('should be defined', () => {
    expect(victim).toBeDefined();
  });

  it('should return a list of users with given email', async () => {
    //given valid user service
    mockUserService.findByEmail = jest.fn().mockResolvedValue([USER]);
    //when calling findByEmail
    const users = await victim.findByEmail(VALID_EMAIL);

    //then
    expect(mockUserService.findByEmail).toBeCalledTimes(1);
    expect(mockUserService.findByEmail).toBeCalledWith(USER.email);
    expect(users).toEqual([USER]);
  });

  it('should update User', async () => {
    //given valid user service
    mockUserService.update = jest.fn().mockResolvedValue(USER);
    //when calling updateUser
    const users = await victim.updateUser(ID, USER);
    //then
    expect(mockUserService.update).toBeCalledTimes(1);
    expect(mockUserService.update).toBeCalledWith(parseInt(ID), USER);
    expect(users).toEqual(USER);
  });

  it('should delete User', async () => {
    //given
    mockUserService.delete = jest.fn().mockResolvedValue(USER);
    //when
    const users = await victim.deleteUser(ID);
    //then
    expect(mockUserService.delete).toBeCalledTimes(1);
    expect(mockUserService.delete).toBeCalledWith(parseInt(ID));
    expect(users).toEqual(USER);
  });

  it('should return an User', async () => {
    //given
    mockUserService.findOne = jest.fn().mockResolvedValue(USER);
    //when
    const users = await victim.findUser(ID);
    //then
    expect(mockUserService.findOne).toBeCalledTimes(1);
    expect(mockUserService.findOne).toBeCalledWith(parseInt(ID));
    expect(users).toEqual(USER);
  });

  it('should remove userId from cookies on signout', () => {
    //given
    const session = { userId: 'dummy' };
    //when
    victim.signout(session);
    //then
    expect(session.userId).toBeNull();
  });

  it('should add userId to the cookies when signin', async () => {
    //given
    const session = { userId: 'demo' };
    mockAuthService.signin = jest.fn().mockResolvedValue(USER);
    //when
    const user = await victim.signin(USER as CreateUserDto, session);
    //then
    expect(session.userId).toEqual(USER.id);
    expect(user).toEqual(USER);
  });

  it('should add userId to the cookies when signup', async () => {
    //given
    const session = { userId: null };
    mockAuthService.signup = jest.fn().mockResolvedValue(USER);
    //when
    const user = await victim.createUser(USER as CreateUserDto, session);
    //then
    expect(session.userId).toEqual(USER.id);
    expect(user).toEqual(USER);
  });
});
