import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from './utils/password.utils';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, 
        {
        provide: getRepositoryToken(User),
        useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
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

    // mockRepository.findOne.mockResolvedValue(null);
    // mockRepository.save.mockResolvedValue(user);
    // mockRepository.create.mockReturnValue(user);

    jest.spyOn(repo, 'findOne').mockResolvedValue(null);
    jest.spyOn(repo, 'save').mockResolvedValue(user);
    jest.spyOn(repo, 'create').mockReturnValue(user);

    const result = await service.create(createUserDto);

    console.log(result);

    expect(result).toEqual(user);
    expect(result.password).not.toBe(createUserDto.password); // 해싱 확인
  });

  it('should throw an error if user already exists', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: '[john@example.com](mailto:john@example.com)',
      password: 'securePassword123',
    };

    const existingUser = new User();
    existingUser.email = createUserDto.email;

    mockRepository.findOne.mockResolvedValue(existingUser);

    await expect(service.create(createUserDto)).rejects.toThrow(
      ConflictException,
    );
  });
});
