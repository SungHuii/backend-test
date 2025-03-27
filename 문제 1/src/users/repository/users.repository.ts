import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../entities/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { plainToClass } from "class-transformer";
@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(
        @InjectRepository(User) private readonly usersRepo: Repository<User>
    ) {
        super(usersRepo.target, usersRepo.manager, usersRepo.queryRunner);
    }
    

    async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const { name, email, password } = createUserDto;
        const user = this.usersRepo.create({ name, email, password });
        await this.usersRepo.save(user);
        return plainToClass(UserResponseDto, user, { excludeExtraneousValues: true });
    }

    async findByEmail(email: string): Promise<UserResponseDto | null> {
        const user = await this.usersRepo.findOne({ where: { email } });
        return user ? plainToClass(UserResponseDto, user, { excludeExtraneousValues: true }) : null;
    }
}