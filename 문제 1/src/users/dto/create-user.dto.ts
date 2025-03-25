import { IsString, IsEmail, MinLength, MaxLength, Matches, IsNotEmpty, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @Transform(({ value }) => {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        const match = value.match(emailRegex);
        return match ? match[0] : value;
    })
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, { message: 'Password must contain both letters and numbers' })
    password: string;

}