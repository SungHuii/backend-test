import { IsString, IsEmail, MinLength, MaxLength, Matches, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, { message: 'Password must contain both letters and numbers' })
    password: string;

}