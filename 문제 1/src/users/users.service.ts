import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from './utils/password.utils';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersRepository } from './repository/users.repository';
@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {

        const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await hashPassword(createUserDto.password);

        try {
            const savedUser = await this.usersRepository.createUser(
                {
                    name: createUserDto.name,
                    email: createUserDto.email,
                    password: hashedPassword,
                }
            );
            return savedUser;
        } catch (error) {
            throw new InternalServerErrorException('회원가입에 실패했습니다.');
        }
    }
}
