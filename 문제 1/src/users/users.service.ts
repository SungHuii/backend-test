import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from './utils/password.utils';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersRepository } from './repository/users.repository';

@Injectable()
export class UsersService {
    private validationPipe: ValidationPipe;

    constructor(
        private readonly usersRepository: UsersRepository,
    ) {
        this.validationPipe = new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory: (errors) => {
                const messages = errors.map(error => {
                    if (error.constraints) {
                        return Object.values(error.constraints);
                    }
                    return [];
                }).flat();
                return new BadRequestException({ message: messages });
            }
        });
    }

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        // DTO 유효성 검사
        await this.validationPipe.transform(createUserDto, { type: 'body', metatype: CreateUserDto });

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
