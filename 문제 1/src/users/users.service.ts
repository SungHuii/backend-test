import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from './utils/password.utils';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {

        const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            console.error('Email already exists', createUserDto.email);
            throw new ConflictException('Email already exists');
        }

        if (!/(?=.*[A-Za-z])(?=.*\d).{8,}/.test(createUserDto.password)) {
            console.error('Password must be at least 8 characters long', createUserDto.password);
            throw new BadRequestException('Password must be at least 8 characters long');
        }

        const hashedPassword = await hashPassword(createUserDto.password);

        const user = this.usersRepository.create({
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashedPassword,
        });

        try {
            const savedUser = await this.usersRepository.save(user);
            
            const userResponse = plainToClass(UserResponseDto, savedUser, { excludeExtraneousValues: true });
            return userResponse;
        } catch (error) {
            throw new InternalServerErrorException('회원가입에 실패했습니다.');
        }
    }
}
