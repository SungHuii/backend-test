import { IsString, IsEmail, MinLength, MaxLength, IsNotEmpty, Length, isString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(8)
    password: string;

}