import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from './utils/password.utils';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersRepository } from './repository/users.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repo: UsersRepository;

  const mockRepository = {
    createUser: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user and return the user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: '[john@example.com](mailto:john@example.com)',
      password: 'securePassword123',
    };

    const user = new User();
    user.id = 1;
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = await hashPassword(createUserDto.password);
    user.createdAt = new Date();

    mockRepository.findOne.mockResolvedValue(null);
    mockRepository.createUser.mockResolvedValue(user);

    const result = await service.create(createUserDto);

    const userResponse = plainToClass(UserResponseDto, result);
    const { password, ...userResponseWithoutPassword } = userResponse;

    expect(userResponse.id).toBe(user.id);
    expect(userResponse.name).toBe(user.name);
    expect(userResponse.email).toBe('john@example.com');
    expect(userResponse.createdAt.getTime()).toBe(user.createdAt.getTime());
    expect(userResponse.password).toBeUndefined();
  });

  it('should throw an error if Email already exists', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securePassword123',
    };

    const existingUser = new User();
    existingUser.email = createUserDto.email;

    mockRepository.findOne.mockResolvedValue(existingUser);

    await expect(service.create(createUserDto)).rejects.toMatchObject({
      response: { message: 'Email already exists' }
    });
  });

  it('should throw an error if password is under 8 characters', async () => {
    const createUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'short',
    };

    await expect(service.create(createUserDto as CreateUserDto)).rejects.toMatchObject({
      response: { message: expect.arrayContaining(['Password must be at least 8 characters long']) }
    });
  });

  it('should throw an error if password does not contain a number', async () => {
    const createUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'onlyletters',
    };

    await expect(service.create(createUserDto as CreateUserDto)).rejects.toMatchObject({
      response: { message: expect.arrayContaining(['Password must contain both letters and numbers']) }
    });
  });
  
  it('should throw an error if password does not contain a letter', async () => {
    const createUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '12345678',
    };

    await expect(service.create(createUserDto as CreateUserDto)).rejects.toMatchObject({
      response: { message: expect.arrayContaining(['Password must contain both letters and numbers']) }
    });
  });
});
